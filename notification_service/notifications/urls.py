from django.urls import path, include
from .views import SendEmailView

urlpatterns = [
    path('send-email/', SendEmailView.as_view(), name='send_email'),
]
