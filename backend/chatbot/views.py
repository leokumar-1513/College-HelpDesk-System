import google.generativeai as genai
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response

genai.configure(api_key=settings.GEMINI_API_KEY)

class ChatbotView(APIView):
    def post(self, request):
        question = request.data.get("question")

        model = genai.GenerativeModel("models/gemini-2.5-flash")

        response = model.generate_content(question)

        return Response({
            "answer": response.text
        })