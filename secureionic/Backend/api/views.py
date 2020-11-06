from django.contrib.auth.models import User
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import generics, permissions, serializers
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from api.serializers import *
from bo.models import *
import json
import logging
from django.http import JsonResponse, HttpResponse

# Get an instance of a logger
logger = logging.getLogger('django')


class UserListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_fields = ['password','last_login','is_superuser','id','email','first_name','last_name','date_joined','is_active','is_staff']
    filter_backends = [DjangoFilterBackend,filters.SearchFilter,filters.OrderingFilter]
    
    swagger_schema = None
         # Filter for connected user
    def get_queryset(self):
            user = self.request.user
            queryset = User.objects.filter(pk=user.id)
            return queryset
    
    
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    swagger_schema = None
         # Filter for connected user
    def get_queryset(self):
            user = self.request.user
            queryset = User.objects.filter(pk=user.id)
            return queryset
    
    
