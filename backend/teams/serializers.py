from rest_framework import serializers
from .models import Team
from users.serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class TeamSerializer(serializers.ModelSerializer):
    creator_details = UserSerializer(source='creator', read_only=True)
    members_details = UserSerializer(source='members', read_only=True, many=True)

    class Meta:
        model = Team
        fields = ('id', 'name', 'creator', 'creator_details', 'members', 'members_details', 'created_at')
        read_only_fields = ('creator', 'created_at')

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Team name must be at least 2 characters.")
        if len(value) > 100:
            raise serializers.ValidationError("Team name cannot exceed 100 characters.")
        return value
