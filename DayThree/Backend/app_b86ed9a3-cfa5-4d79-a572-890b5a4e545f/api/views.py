# *coding: utf-8*
from backoffice.models import User
from api.serializers import *
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend


class UserListCreateView(generics.ListCreateAPIView):
    """
            create:
                add users
            get:
                Search or get users

                You can search using:

                    :param email
                    :param username


    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('email', 'username')

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
            get:
                get a specific user

            delete:
                Remove an existing user.

            patch:
                Update one or more fields on an existing user.

            put:
                Update a user.

    """
    queryset = User.objects.all()
    serializer_class = UserSerializer