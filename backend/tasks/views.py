from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
from teams.models import Team

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(team__members=user) | Task.objects.filter(team__creator=user)
        
        team_id = self.request.query_params.get('team', None)
        if team_id is not None:
            queryset = queryset.filter(team_id=team_id)
            
        assigned_to = self.request.query_params.get('assigned_to', None)
        if assigned_to is not None:
            queryset = queryset.filter(assigned_to_id=assigned_to)
            
        return queryset.distinct()
