from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from .models import UserProfile


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "User registered successfully"
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "").strip()

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                "mobile": "",
                "role": "admin" if user.is_superuser else "student"
            }
        )

        return Response({
            "message": "Login successful",
            "id": user.id,
            "username": user.username,
            "role": profile.role
        })