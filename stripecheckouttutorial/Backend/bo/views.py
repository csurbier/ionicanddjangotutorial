from bo.models import *
import logging
import os
import stripe
# Get an instance of a logger
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from rest_framework.decorators import api_view
logger = logging.getLogger('django')

def index(request):
    return render(request, 'bo/templates/bo/index.html', {})

def checkoutSessionSuccess(request):
    session_id = request.GET['session_id']
    stripe.api_key = settings.STRIPE_API_KEY
    if session_id:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            customer = stripe.Customer.retrieve(session.customer)
            payment = Payment()
            payment.sessionId = session.id
            payment.customerId = customer.id
            payment.success=True
            payment.save()
            return render(request,'bo/templates/bo/success.html', {})
        except Exception as e:
            logger.error(e)
            return render(request,'bo/templates/bo/error.html', {})


def checkoutSessionFailure(request):
    session_id = request.GET['session_id']
    stripe.api_key = settings.STRIPE_API_KEY
    if session_id:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            customer = stripe.Customer.retrieve(session.customer)
            payment = Payment()
            payment.sessionId = session.id
            payment.customerId = customer.id
            payment.success = False
            payment.save()
            return render(request,'bo/templates/bo/error.html', {})
        except Exception as e:
            logger.error(e)
            return render(request,'bo/templates/bo/error.html', {})

@csrf_exempt
@api_view(['POST'])
def createCheckoutSession(request):
    import stripe
    stripe.api_key = settings.STRIPE_API_KEY
    if request.method == 'POST':
        currency = request.data["currency"]
        quantity = request.data["quantity"]
        price = request.data["price"]
        productName = request.data["productName"]
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': currency,
                    'product_data': {
                        'name': productName,
                    },
                    'unit_amount': price,
                },
                'quantity': quantity,
            }],
            mode='payment',
            success_url='https://app-e06ec9e7-b121-44fa-a383-54bbda3f9706.cleverapps.io/checkout-session-success/?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://app-e06ec9e7-b121-44fa-a383-54bbda3f9706.cleverapps.io/checkout-session-failure/?session_id={CHECKOUT_SESSION_ID}',
        )
        newdict = {'status': 'OK', 'session': session.id}
        return JsonResponse(newdict)
    else:
        return HttpResponse(status=404)

@csrf_exempt
@api_view(['POST'])
def paymentCheckStatus(request):
    if request.method == 'POST':
        status ="KO"
        sessionId = request.data["sessionId"]
        try:
            payment = Payment.objects.get(sessionId=sessionId)
            if payment.success:
                status="OK"
            else:
                status = "KO"
        except Exception as e:
            logger.error(e)
            status = "KO"
        newdict = {'status': status}
        return JsonResponse(newdict)
    else:
        return HttpResponse(status=404)