from django.db import models
from django.contrib.auth.models import User
import bleach

# Create your models here.

CROP_CHOICES = [
    ('Wheat', 'Wheat'),
    ('Rice', 'Rice'),
    ('Maize', 'Maize'),
    ('Potato', 'Potato'),
    ('Tomato', 'Tomato'),
    ('Cotton', 'Cotton'),
    ('Sugarcane', 'Sugarcane'),
    ('Mustard', 'Mustard'),
    ('Pulses', 'Pulses'),
    ('Other', 'Other'),
]


class Review(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews'
    )
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=150)
    crop = models.CharField(max_length=50, choices=CROP_CHOICES)
    review = models.TextField(max_length=500)
    image = models.ImageField(blank=True, null=True, upload_to='reviews/')
    # helpful_count: total users who found this review helpful
    helpful_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.crop}"

    def save(self, *args, **kwargs):
        # Sanitize free-text fields to prevent XSS before storing
        self.review = bleach.clean(self.review, tags=[], strip=True)
        self.name = bleach.clean(self.name, tags=[], strip=True)
        self.location = bleach.clean(self.location, tags=[], strip=True)
        super().save(*args, **kwargs)


class ReviewHelpful(models.Model):
    """Tracks which user marked which review as helpful — one vote per user per review."""
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='helpful_votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='helpful_votes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('review', 'user')


class DiseaseInfo(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    cause = models.TextField()
    symptoms = models.JSONField(default=list)
    prevention = models.JSONField(default=list)
    solution = models.CharField(max_length=1000)
    link = models.CharField(max_length=1000)
    image = models.ImageField(blank=True, null=True, upload_to='disease-info/')

    def __str__(self):
        return self.name
