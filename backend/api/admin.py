from django.contrib import admin
from .models import DiseaseInfo, Review, ReviewHelpful

admin.site.register(DiseaseInfo)
admin.site.register(ReviewHelpful)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'crop', 'helpful_count', 'location', 'created_at')
    list_filter = ('crop',)
    search_fields = ('name', 'location', 'review')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'user', 'helpful_count')
