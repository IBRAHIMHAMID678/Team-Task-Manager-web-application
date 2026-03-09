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

    @action(detail=True, methods=['post'], url_path='add_member')
    def add_member(self, request, pk=None):
        """Add an existing user to the team by user_id (creator only)."""
        team = self.get_object()
        if team.creator != request.user:
            raise PermissionDenied("Only the team creator can add members.")
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=user_id)
            team.members.add(user)
            return Response({'status': 'member added', 'user': user.username})
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='invite')
    def invite_member(self, request, pk=None):
        """
        STUBBED: Invite a user to the team via email.
        In production this would send an email via SendGrid / AWS SES.
        For now it validates the email and returns a confirmation response.
        """
        team = self.get_object()
        if team.creator != request.user:
            raise PermissionDenied("Only the team creator can invite members.")

        email = request.data.get('email', '').strip()
        if not email:
            return Response({'error': 'email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user already exists
        existing = User.objects.filter(email__iexact=email).first()
        if existing:
            team.members.add(existing)
            return Response({
                'status': 'existing_user_added',
                'message': f'{existing.username} was already registered and has been added to the team.',
            })

        # STUB: would send an invitation email here
        # e.g. send_invitation_email(email, team, inviter=request.user)
        return Response({
            'status': 'invitation_sent',
            'message': f'An invitation email would be sent to {email} (stubbed – no SMTP configured).',
        }, status=status.HTTP_200_OK)
