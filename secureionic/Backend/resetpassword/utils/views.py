# -*-coding:utf-8 -*-
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.db.models.query_utils import Q
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template import loader
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.views.generic import *
from .forms import SetPasswordForm
from django.contrib import messages
#from django.contrib.auth.models import User
from bo.models import User
from django.http import HttpResponse
import hashlib
from django.shortcuts import render
import sendgrid
import logging
from django.views.decorators.csrf import csrf_exempt
import os
logger = logging.getLogger('django')


def password_modified(request):
    return render(request,'account/pwdmodifie.html',{})

class PasswordResetConfirmView(FormView):
    template_name = "account/passwordforgotten.html"
    success_url = '/account/password_modified'
    form_class = SetPasswordForm

    def post(self, request, uidb64=None, token=None, *arg, **kwargs):
        """
        View that checks the hash in a password reset link and presents a
        form for entering a new password.
        """
        form = self.form_class(request.POST)
        assert uidb64 is not None and token is not None  # checked by URLconf
        try:
            import base64
            uid = base64.b64decode(uidb64).decode('utf-8')
           # import uuid
            #identifiant = uuid.UUID(bytes=uid)
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
            user = None
            print(e)

        if user is not None and default_token_generator.check_token(user, token):
            if form.is_valid():
                new_password = form.cleaned_data['confirmation']
                #'django.contrib.auth.hashers.PBKDF2PasswordHasher',
                from  django.contrib.auth.hashers import make_password
                user.password = make_password(new_password) #hashlib.sha256(new_password.encode('utf8')).hexdigest()
                user.save()
                messages.success(request, 'Password modified')
                return self.form_valid(form)
            else:
                print(form.errors)
                messages.error(request, form.errors)
                return self.form_invalid(form)
        else:
            messages.error(
                request, 'Link expired.')
            return self.form_invalid(form)

def validateAccount(request,uidb64,token):
    # get user uuid and get token in url
    assert uidb64 is not None and token is not None  # checked by URLconf

    try:
        uid = urlsafe_base64_decode(uidb64)
        user = User.objects.get(pk=uid)
        user.valid = True
        user.save()
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        return render(request, 'account/valid.html', {})
    else:
        return render(request, 'account/invalid.html', {})