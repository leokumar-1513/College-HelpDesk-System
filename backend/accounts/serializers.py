from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.CharField()
    mobile = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'mobile', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        mobile = validated_data.pop('mobile')
        role = validated_data.pop('role')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            password=password
        )

        UserProfile.objects.create(
            user=user,
            mobile=mobile,
            role=role
        )

        return user