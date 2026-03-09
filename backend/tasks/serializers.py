from rest_framework import serializers
from .models import Task
from teams.serializers import TeamSerializer
from users.serializers import UserSerializer

class TaskSerializer(serializers.ModelSerializer):
    team_details = TeamSerializer(source='team', read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = Task
        fields = '__all__'
