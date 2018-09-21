# -*-coding:utf-8 -*-
from django.contrib.auth.models import User
from .libs.hashers import *
from .models import User
import logging
logger = logging.getLogger('django')
class customAuthentification(object):
    """
    Use the login name and a hash of the password. For example:

    """
    def authenticate(self, username=None, password=None):
        logger.info("Authenticate Username %s"%username)
        if username:
            try:
                user = User.objects.get(username=username)
                encoder = SHA256PasswordHasher()
                logger.info("ON COMPARE %s avec %s"%(password,user.password))
                if SHA256PasswordHasher.verify(encoder,password,user.password):
                    logger.info("OK password")
                    return user
                else:
                    logger.info("Mauvais password")
                    return  None
            except User.DoesNotExist:
                return None
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None