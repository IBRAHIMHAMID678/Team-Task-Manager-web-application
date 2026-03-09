from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Team
from .serializers import TeamSerializer

User = get_user_model()


class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (
            Team.objects.filter(members=user) |
            Team.objects.filter(creator=user)
        ).distinct()

    def perform_create(self, serializer):
        team = serializer.save(creator=self.request.user)
        team.members.add(self.request.user)

    def destroy(self, request, *args, **kwargs):
        team = self.get_object()
        if team.creator != request.user:
            raise PermissionDenied("Only the team creator can delete this team.")
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        team = self.get_object()
        if team.creator != request.user:
            raise PermissionDenied("Only the team creator can add members.")
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            team.members.add(user)
            return Response({'status': 'member added'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
