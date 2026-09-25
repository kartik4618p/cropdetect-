from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('diseaseinfo/', views.diseaseinfo, name='diseaseinfo'),
    path('diseaseinfo/<str:name>', views.get_disease, name='get-disease'),
    path('detect/', views.detect_disease, name='detect'),

    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.user_login, name='login'),
    path('auth/logout/', views.user_logout, name='logout'),
    path('auth/me/', views.current_user, name='current-user'),

    # Farmer Reviews
    path('reviews/', views.review_list, name='review-list'),
    path('reviews/<int:pk>/', views.review_detail, name='review-detail'),
    path('reviews/<int:pk>/helpful/', views.review_helpful, name='review-helpful'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
