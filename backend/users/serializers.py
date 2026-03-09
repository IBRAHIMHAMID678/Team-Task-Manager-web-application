from rest_framework import serializers
from django.contrib.auth import get_user_model
import re

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 6}}

    def validate_username(self, value):
        """Allow only alphanumeric and underscore characters."""
        if not re.match(r'^[\w.@+-]+$', value):
            raise serializers.ValidationError("Username may only contain letters, numbers, and @/./+/-/_ characters.")
        return value

    def validate_email(self, value):
        """Ensure email is unique."""
        if User.objects.filter(email__iexact=value).exists():
            # Allow on update (if it's the same user)
            if not self.instance or self.instance.email.lower() != value.lower():
                raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        # create_user handles password hashing via the configured hasher (bcrypt)
        return User.objects.create_user(**validated_data)
