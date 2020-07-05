# *coding: utf-8*
from backoffice.models import User
from api.serializers import *
from rest_framework import generics
from rest_framework import permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view
import stripe
from django.http import JsonResponse
from django.shortcuts import HttpResponse
from rest_framework_gis.filters import DistanceToPointFilter

from django.contrib.gis.measure import Distance
from django.contrib.gis.db.models.functions import Distance as DistanceModel


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
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('email', 'username','password')

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
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(['POST'])
def createpaymentintent(request):
    if request.method == "POST":
        amount =  request.data["amount"]
        stripe.api_key = "yourapikey"
        intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency='eur',
        )
        return JsonResponse(intent, safe=False)
    else:
        return HttpResponse(status=501)

class BikeListView(generics.ListAPIView):
    """
            get:
                Get list of bikes

    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer
    """
    distance_filter_field = 'location'
    filter_backends = (DistanceToPointFilter,)
    distance_filter_convert_meters = True
    """

    def get_queryset(self):
        latitude = self.request.query_params.get('latitude', None)
        longitude = self.request.query_params.get('longitude', None)
        max_distance = self.request.query_params.get('max_distance', None)

        if latitude and longitude:
            point_of_user = Point(float(longitude), float(latitude), srid=4326)


            # Here we're actually doing the query, notice we're using the Distance class fom gis.measure
            queryset = Bike.objects.filter(
                location__distance_lte=(
                    point_of_user,
                    Distance(km=float(max_distance))
                )
            ).annotate(distance_to_user = DistanceModel("location",point_of_user)).order_by('distance_to_user')
        else:
            queryset = Bike.objects.all()
        return queryset