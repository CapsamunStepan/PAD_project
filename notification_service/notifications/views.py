from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import EmailSerializer


class SendEmailView(APIView):
    def post(self, request):
        serializer = EmailSerializer(data=request.data)
        if serializer.is_valid():
            recipient = 'stevescreaby@gmail.com'
            subject = 'order'
            message = serializer.validated_data['message']

            try:
                send_mail(
                    subject,
                    message,
                    'popilchmo@gmail.com',  # Отправитель
                    [recipient],  # Получатель
                    fail_silently=False,
                )
                return Response({"success": "Email sent successfully."}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
