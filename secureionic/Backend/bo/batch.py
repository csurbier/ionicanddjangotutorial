# *coding: utf-8*
from bo.models import *
from datetime import datetime,timedelta
from django.utils import timezone
from django.db.models import F,Q
import logging
import sendgrid
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from PIL import Image
import os, sys
from urllib.request import urlopen
from requests.utils import requote_uri
import json
# Get an instance of a logger
logger = logging.getLogger('django')

