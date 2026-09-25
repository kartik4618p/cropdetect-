from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import DiseaseInfo, Review


class DiseaseInfoSerializer(ModelSerializer):
    class Meta:
        model = DiseaseInfo
        fields = '__all__'


class ReviewSerializer(ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    helpful_count = serializers.IntegerField(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    # Whether the currently authenticated user has already voted this helpful
    has_voted = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'name', 'location', 'crop',
            'review', 'image', 'helpful_count', 'has_voted',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'helpful_count', 'has_voted', 'created_at', 'updated_at']

    def get_has_voted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.helpful_votes.filter(user=request.user).exists()
        return False

    def validate_review(self, value):
        if len(value.strip()) < 20:
            raise serializers.ValidationError(
                "Review must be at least 20 characters long."
            )
        if len(value) > 500:
            raise serializers.ValidationError(
                "Review must not exceed 500 characters."
            )
        return value
