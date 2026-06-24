from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from expeditions.views import ExpeditionViewSet
from inquiries.views import InquiryViewSet
from project_nature.views import RegisterView, CurrentUserView

router = DefaultRouter()
router.register(r'expeditions', ExpeditionViewSet, basename='expedition')
router.register(r'inquiries', InquiryViewSet, basename='inquiry')

urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/me/', CurrentUserView.as_view(), name='current_user'),
    path('api/auth/', include('accounts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
