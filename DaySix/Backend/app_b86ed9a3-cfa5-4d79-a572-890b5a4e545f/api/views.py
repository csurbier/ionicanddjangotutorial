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
