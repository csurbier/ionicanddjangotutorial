from rest_framework.serializers import ModelSerializer
from bo.models import *

#created by ionic django crud generator

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'
