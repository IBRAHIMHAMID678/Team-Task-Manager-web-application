from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from datetime import date, timedelta
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    CRUD for tasks with role-based access control.
    Filters by team or assignee via query params.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = (
            Task.objects.filter(team__members=user) |
            Task.objects.filter(team__creator=user)
        ).distinct()

        team_id = self.request.query_params.get('team')
        if team_id:
            queryset = queryset.filter(team_id=team_id)

        assigned_to = self.request.query_params.get('assigned_to')
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)

        return queryset

    def perform_create(self, serializer):
        team = serializer.validated_data.get('team')
        user = self.request.user
        if team.creator != user and user not in team.members.all():
            raise PermissionDenied("You are not a member of this team.")
        serializer.save()

    def perform_update(self, serializer):
        task = self.get_object()
        user = self.request.user
        # Allow only team creator or the assigned user to update task status/details
        if task.team.creator != user and task.assigned_to != user:
            raise PermissionDenied("Only the team creator or the assignee can modify this task.")
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        # Only team creator can delete a task
        if task.team.creator != request.user:
            raise PermissionDenied("Only the team creator can delete tasks.")
        return super().destroy(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def due_date_reminders(request):
    """
    Returns tasks assigned to the current user that are due within
    the next 3 days (inclusive of today). Used for login-time reminders.
    """
    user = request.user
    today = date.today()
    upcoming = today + timedelta(days=3)

    tasks = Task.objects.filter(
        assigned_to=user,
        due_date__gte=today,
        due_date__lte=upcoming,
        status__in=['Pending', 'In Progress'],
    ).order_by('due_date')

    serializer = TaskSerializer(tasks, many=True)
    return Response({
        'count': tasks.count(),
        'reminders': serializer.data,
    })
