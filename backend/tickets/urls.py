
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)

urlpatterns = router.urls
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, TicketReplyViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'replies', TicketReplyViewSet)

urlpatterns = router.urls