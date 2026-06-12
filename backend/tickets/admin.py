from django.contrib import admin
from .models import Department, Ticket, TicketReply

admin.site.register(Department)
admin.site.register(Ticket)
admin.site.register(TicketReply)