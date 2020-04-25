# coding=utf-8
from django.conf.urls import  url
from backoffice.views import *

urlpatterns = [
    url(r'^backoffice/checkPrice/$', checkPrice, name='checkPrice'),
    url(r'^backoffice/new_product_per_month/$', NewProductMonthChartJSONView.as_view(), name='new_product_per_month'),
]
