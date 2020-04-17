# *coding: utf-8*
from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User


class Shop(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    name = models.TextField()
    email = models.CharField(max_length=200)
    address = models.CharField(max_length=1024,null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'%s' % (self.name)


WEEKDAYS = [
    (1, ("Monday")),
    (2, ("Tuesday")),
    (3, ("Wednesday")),
    (4, ("Thursday")),
    (5, ("Friday")),
    (6, ("Saturday")),
    (0, ("Sunday")),
]

class ShopPlanning(models.Model):
    class Meta:
        ordering = ['refShop', 'day', 'startHour']
    refShop = models.ForeignKey(Shop,on_delete=models.CASCADE,related_name='shopplanning')
    day = models.IntegerField(choices=WEEKDAYS)
    startHour = models.TimeField()
    endHour = models.TimeField()

    def get_dayName(self):
        if self.day==0:
            return "Sunday"
        elif self.day==1:
            return "Monday"
        elif self.day==2:
            return "Tuesday"
        elif self.day==3:
            return "Wednesday"
        elif self.day==4:
            return "Thursday"
        elif self.day==5:
            return "Friday"
        elif self.day==6:
            return "Saturday"


    def __unicode__(self):
          return ("%(premises)s %(day)s (%(from)s - %(to)s)") % {
                'premises': self.refShop,
                'day': self.day,
                'from': self.startHour,
                'to': self.endHour
          }

class Product(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    refShop = models.ForeignKey(Shop, db_index=True,on_delete=models.CASCADE)
    title = models.TextField(max_length=65)
    price = models.FloatField(default=0)
    withEndDate = models.BooleanField(default=False)
    endDate = models.DateField(blank=True,null=True)
    description = models.CharField(max_length=65, default='', null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    available = models.BooleanField(default=True)

    def clean(self):
        from datetime import datetime, timedelta
        from django.core.exceptions import ValidationError

        today = datetime.now().date()
        if self.endDate:
            if self.endDate < today:
                raise ValidationError("You cannot set an endDate in the past")

        if self.withEndDate and self.endDate is None:
            raise ValidationError("Please select an end date !")

    def __unicode__(self):
        return u'%s - %s' % (self.refShop,self.title)

class ProductPlanning(models.Model):
    class Meta:
        ordering = ['refProduct', 'day', 'startHour']
    refProduct = models.ForeignKey(Product,on_delete=models.CASCADE,related_name='productplanning')
    day = models.IntegerField(choices=WEEKDAYS)
    startHour = models.TimeField()
    endHour = models.TimeField()

    def __unicode__(self):
          return ("%(premises)s %(day)s (%(from)s - %(to)s)") % {
                'premises': self.refProduct,
                'day': self.day,
                'from': self.startHour,
                'to': self.endHour
          }
