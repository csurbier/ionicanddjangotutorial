# *coding: utf-8*
import sys
import os
sys.path.append(os.getenv('APP_HOME'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'bikebackend.settings'
os.environ['PYTHON_EGG_CACHE'] = '/tmp/.python-egg'
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
