import torch
import torchvision.transforms as transforms
from PIL import Image
import io
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import DiseaseInfo, Review, ReviewHelpful
from .serializers import DiseaseInfoSerializer, ReviewSerializer
from rest_framework import status
from django.db import IntegrityError

import os
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

# Load the trained model
model_path = os.path.join(settings.BASE_DIR, "model_files", "model.pth")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class PlantDiseaseCNN(torch.nn.Module):
    def __init__(self, num_classes=15):  
        super(PlantDiseaseCNN, self).__init__()
        self.conv1 = torch.nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1)
        self.conv2 = torch.nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.conv3 = torch.nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1)
        self.pool = torch.nn.MaxPool2d(kernel_size=2, stride=2, padding=0)
        self.fc1 = torch.nn.Linear(128 * 16 * 16, 256)
        self.fc2 = torch.nn.Linear(256, num_classes)

    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))
        x = self.pool(torch.relu(self.conv2(x)))
        x = self.pool(torch.relu(self.conv3(x)))
        x = x.view(x.shape[0], -1)  
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

model = PlantDiseaseCNN(num_classes=15)
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()


transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.RandomRotation(20),  # Rotate images randomly up to 20 degrees
    transforms.RandomHorizontalFlip(p=0.5),  # Flip images horizontally with 50% probability
    transforms.RandomVerticalFlip(p=0.5),  # Flip images vertically with 50% probability
    transforms.ColorJitter(brightness=0.2, contrast=0.2),  # Adjust brightness and contrast
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5], std=[0.5])
])

@api_view(['GET', 'POST'])
def detect_disease(request):
    if "image" not in request.FILES:
        return Response({"error": "No image uploaded"}, status=400)

    image_file = request.FILES["image"]
    image = Image.open(io.BytesIO(image_file.read())).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(image)
        prediction = torch.argmax(output, dim=1).item()

    class_labels = [
    'Pepper Bell Bacterial Spot', 'Pepper Bell Healthy', 'Potato Early Blight',
    'Potato Late Blight', 'Potato Healthy', 'Tomato Bacterial Spot', 'Tomato Early Blight',
    'Tomato Late Blight', 'Tomato Leaf Mold', 'Tomato Septoria Leaf Spot',
    'Tomato Spider Mites Two-Spotted Spider Mite', 'Tomato Target Spot',
    'Tomato Yellow Leaf Curl Virus', 'Tomato Mosaic Virus', 'Tomato Healthy'
    ]

    result = class_labels[prediction] if prediction < len(class_labels) else "Unknown"

    return Response({
        "prediction": result,
    })



@api_view(['POST', 'GET'])
def diseaseinfo(request):
    if request.method == 'POST':
        data = request.data
        info = DiseaseInfo.objects.create(
            name=data['name'],
            description=data['description'],
            cause=data['cause'],
            symptoms=data['symptoms'],
            prevention=data['prevention'],
            solution=data['solution'],
        )
        serializer = DiseaseInfoSerializer(info, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    if request.method == 'GET':
        info = DiseaseInfo.objects.all()
        serializer = DiseaseInfoSerializer(info, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET','POST'])
def get_disease(request, name):
    info = DiseaseInfo.objects.get(name=name)
    serializer = DiseaseInfoSerializer(info, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)

    return Response(
        {
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            }
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response(
            {"error": "Username, email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response(
        {
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
def user_logout(request):
    logout(request)

    return Response(
        {"message": "Logout successful"},
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user

    return Response(
        {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            }
        },
        status=status.HTTP_200_OK
    )




# ---------------------------------------------------------------------------
# Farmer Reviews
# ---------------------------------------------------------------------------

VALID_CROPS = {
    'Wheat', 'Rice', 'Maize', 'Potato', 'Tomato',
    'Cotton', 'Sugarcane', 'Mustard', 'Pulses', 'Other',
}

VALID_SORT = {
    'helpful': '-helpful_count',
    'recent':  '-created_at',
    'oldest':  'created_at',
}


@api_view(['GET', 'POST'])
def review_list(request):
    """
    GET  /api/reviews/  — list all reviews (paginated, filterable, sortable)
    POST /api/reviews/  — submit a review (auth required; auto-published immediately)
    """
    if request.method == 'GET':
        qs = Review.objects.all()

        # Filter by crop
        crop = request.query_params.get('crop', '').strip()
        if crop and crop in VALID_CROPS:
            qs = qs.filter(crop=crop)

        # Sort
        sort_key = request.query_params.get('sort', 'recent').strip().lower()
        order_by = VALID_SORT.get(sort_key, '-created_at')
        qs = qs.order_by(order_by)

        # Pagination
        try:
            page  = max(1, int(request.query_params.get('page', 1)))
            limit = min(50, max(1, int(request.query_params.get('limit', 12))))
        except (ValueError, TypeError):
            page, limit = 1, 12

        total  = qs.count()
        offset = (page - 1) * limit
        reviews = qs[offset: offset + limit]

        serializer = ReviewSerializer(reviews, many=True, context={'request': request})
        return Response({
            'total':       total,
            'page':        page,
            'limit':       limit,
            'total_pages': max(1, (total + limit - 1) // limit),
            'results':     serializer.data,
        }, status=status.HTTP_200_OK)

    # POST — requires authentication
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required to submit a review.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    serializer = ReviewSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        name = serializer.validated_data.get('name', '').strip() or request.user.username
        # Auto-publish immediately — no moderation queue
        review = serializer.save(user=request.user, name=name)
        return Response(
            ReviewSerializer(review, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
def review_detail(request, pk):
    """
    GET    /api/reviews/<id>/  — retrieve a single review
    DELETE /api/reviews/<id>/  — delete (owner or admin only)
    """
    review = get_object_or_404(Review, pk=pk)

    if request.method == 'GET':
        serializer = ReviewSerializer(review, context={'request': request})
        return Response(serializer.data)

    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

    is_owner = review.user_id == request.user.id
    if not (is_owner or request.user.is_staff):
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

    review.delete()
    return Response({'message': 'Review deleted.'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def review_helpful(request, pk):
    """
    POST /api/reviews/<id>/helpful/
    Toggle: marks review as helpful (or removes vote if already voted).
    Auth required.
    """
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

    review = get_object_or_404(Review, pk=pk)

    existing = ReviewHelpful.objects.filter(review=review, user=request.user).first()
    if existing:
        # Already voted — remove vote
        existing.delete()
        review.helpful_count = max(0, review.helpful_count - 1)
        review.save(update_fields=['helpful_count'])
        voted = False
    else:
        # New vote
        ReviewHelpful.objects.create(review=review, user=request.user)
        review.helpful_count += 1
        review.save(update_fields=['helpful_count'])
        voted = True

    return Response({
        'helpful_count': review.helpful_count,
        'has_voted': voted,
    }, status=status.HTTP_200_OK)

