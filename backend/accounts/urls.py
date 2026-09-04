from django.urls import path

from .views import (
    ChangePasswordView,
    NewsletterSubscribeView,
)

urlpatterns = [
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('newsletter/subscribe/', NewsletterSubscribeView.as_view(), name='newsletter_subscribe'),
]
