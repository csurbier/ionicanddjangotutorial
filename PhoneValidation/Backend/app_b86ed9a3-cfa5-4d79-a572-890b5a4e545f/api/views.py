# *coding: utf-8*
from rest_framework import permissions, routers, serializers, viewsets
from rest_framework import generics
from rest_framework.decorators import api_view
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
import json
from rest_framework.response import Response
from rest_framework import status
from smsapi.client import SmsApiComClient


def generateSmsCode():
    # select a random sample without replacement
    codeSms = ''.join(random.choice(string.digits) for _ in range(4))
    return codeSms

@api_view(['GET'])
def sendSmsCode(request):
    from phonevalidation.settings import SMSAPI_API_KEY
    client = SmsApiComClient(access_token=SMSAPI_API_KEY)
    phone = request.GET.get('phone', None)
    code = generateSmsCode()
    message="SMS code:"+code
    try:
      client.sms.send(to=phone, message=message)
      smsSent = SMSSent()
      smsSent.phoneNumber = phone
      smsSent.codeEnvoye = code
      smsSent.save()
      json = {"status":"OK","code": code}
    except Exception as e:
        print(e)
        json = {"status": "KO"}

    return JsonResponse(json)

