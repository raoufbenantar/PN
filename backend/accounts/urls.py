from django.urls import path

from .views import (
    ChangePasswordView,
    NewsletterSubscribeView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    SendVerificationView,
    VerifyEmailView,
)

urlpatterns = [
    path('send-verification/', SendVerificationView.as_view(), name='send_verification'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('newsletter/subscribe/', NewsletterSubscribeView.as_view(), name='newsletter_subscribe'),
]
