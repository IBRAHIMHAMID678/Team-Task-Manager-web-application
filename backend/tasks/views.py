from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Task
from .serializers import TaskSerializer


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
        if team_id:
            queryset = queryset.filter(team_id=team_id)

        assigned_to = self.request.query_params.get('assigned_to', None)
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)

        return queryset

    def perform_create(self, serializer):
        team = serializer.validated_data.get('team')
        user = self.request.user
        if team.creator != user and user not in team.members.all():
            raise PermissionDenied("You are not a member of this team.")
        serializer.save()
