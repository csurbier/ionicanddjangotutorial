# -*-coding:utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import reverse
import uuid
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import AbstractUser
import datetime
from pytz import timezone, utc
from django.conf import settings
import uuid

class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sessionId = models.CharField(max_length=255)
    customerId = models.CharField(max_length=255)
    success = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    
    def __str__(self):
        return self.sessionId
