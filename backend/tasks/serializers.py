from rest_framework import serializers
from .models import Task
from users.serializers import UserSerializer
from datetime import date


class TaskSerializer(serializers.ModelSerializer):
    team_details = serializers.SerializerMethodField(read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'status', 'priority',
            'team', 'team_details',
            'assigned_to', 'assigned_to_details',
            'due_date', 'created_at'
        )
        read_only_fields = ('created_at',)

    def get_team_details(self, obj):
        return {'id': obj.team.id, 'name': obj.team.name}

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Title cannot be blank.")
        if len(value) > 255:
            raise serializers.ValidationError("Title cannot exceed 255 characters.")
        return value

    def validate_due_date(self, value):
        if value and value < date.today():
            raise serializers.ValidationError("Due date cannot be in the past.")
        return value

    def validate(self, data):
        # Ensure assigned_to is a member of the team
        team = data.get('team') or (self.instance.team if self.instance else None)
        assigned_to = data.get('assigned_to')
        if team and assigned_to:
            if assigned_to != team.creator and assigned_to not in team.members.all():
                raise serializers.ValidationError(
                    {"assigned_to": "Assignee must be a member of the selected team."}
                )
        return data
