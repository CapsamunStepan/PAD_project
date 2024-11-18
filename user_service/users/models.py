# users/models.py
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class User(AbstractUser):
    # Задаем уникальные related_name для конфликтующих полей
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',  # Это уникальное имя для связи
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions_set',  # Это уникальное имя для связи
        blank=True
    )
