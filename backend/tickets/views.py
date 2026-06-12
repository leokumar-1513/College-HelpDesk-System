from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Ticket
from .serializers import TicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    from rest_framework import viewsets
from .models import Ticket, TicketReply
from .serializers import TicketSerializer, TicketReplySerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer


class TicketReplyViewSet(viewsets.ModelViewSet):
    queryset = TicketReply.objects.all()
    serializer_class = TicketReplySerializer