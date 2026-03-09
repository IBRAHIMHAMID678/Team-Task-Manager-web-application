from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, due_date_reminders

router = DefaultRouter()
router.register(r'', TaskViewSet, basename='task')

urlpatterns = [
    path('reminders/', due_date_reminders, name='task-reminders'),
    path('', include(router.urls)),
]
