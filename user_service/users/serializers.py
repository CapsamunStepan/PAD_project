from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Извлекаем first_name и last_name из validated_data, чтобы передать их в create_user
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)

        # Создаем пользователя и устанавливаем дополнительные поля
        user = get_user_model().objects.create_user(**validated_data)
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        return user


class TokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = get_user_model().objects.filter(username=attrs.get('username')).first()
        if user and user.check_password(attrs.get('password')):
            return user
        raise serializers.ValidationError('Неверные данные')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'date_joined']

