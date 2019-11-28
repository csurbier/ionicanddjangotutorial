from backoffice.models import *
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'


class BikeSerializer(serializers.ModelSerializer):
    distance = serializers.SerializerMethodField()
    class Meta:
        model = Bike
        fields = '__all__'

    def get_distance(self, obj):
        return obj.distance_to_user.km