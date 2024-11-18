from rest_framework import serializers


class EmailSerializer(serializers.Serializer):
    message = serializers.CharField()
