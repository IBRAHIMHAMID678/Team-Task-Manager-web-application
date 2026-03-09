from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Task
from .serializers import TaskSerializer
from teams.models import Team


@method_decorator(csrf_exempt, name='dispatch')
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = (
            Task.objects.filter(team__members=user) |
            Task.objects.filter(team__creator=user)
        ).distinct()

        team_id = self.request.query_params.get('team', None)
        if team_id is not None:
            queryset = queryset.filter(team_id=team_id)

        assigned_to = self.request.query_params.get('assigned_to', None)
        if assigned_to is not None:
            queryset = queryset.filter(assigned_to_id=assigned_to)

        return queryset

    def perform_create(self, serializer):
        team = serializer.validated_data.get('team')
        user = self.request.user
        # Only team members or creator can add tasks
        if team.creator != user and user not in team.members.all():
            raise PermissionDenied("You are not a member of this team.")
        serializer.save()
