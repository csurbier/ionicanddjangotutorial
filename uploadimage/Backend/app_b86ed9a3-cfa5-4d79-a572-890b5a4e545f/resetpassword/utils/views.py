# -*-coding:utf-8 -*-
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.template import loader
from bikebackend.settings import SENDGRID_API_KEY
from backoffice.models import User
from django.http import HttpResponse
import sendgrid
from django.views.decorators.csrf import csrf_exempt
from sendgrid.helpers.mail import Mail,Email,Content
from .forms import SetPasswordForm
from django.views.generic import *
import hashlib
from django.contrib import messages

def reset_password(user, request):
    c = {
        'email': user.email,
        'domain': request.META['HTTP_HOST'],
        'site_name': 'bikebackend',
        'uid': urlsafe_base64_encode(force_bytes(user.pk)).decode('utf-8'),
        'user': user,
        'token': default_token_generator.make_token(user),
        'protocol': 'http',
    }
    subject_template_name = 'registration/password_reset_subject.txt'
    email_template_name = 'registration/password_reset_email.html'
    subject = loader.render_to_string(subject_template_name, c)
    # Email subject *must not* contain newlines
    subject = ''.join(subject.splitlines())
    email = loader.render_to_string(email_template_name, c)
    try:
        to_email = Email(user.email)
        from_email = Email("contact@bikebackend.fr")
        content = Content('text/html', email)
        message = Mail(from_email, subject, to_email, content)
        sg = sendgrid.SendGridAPIClient(apikey=SENDGRID_API_KEY)
        sg.client.mail.send.post(request_body=message.get())
    except Exception as e:
        print(e.message)

@csrf_exempt
def sendPasswordLink(request):
    if request.method == "POST":
        data = request.POST['email_or_username']
        associated_users = User.objects.filter(email=data)
        try:
         if associated_users.exists():
                for user in associated_users:
                    reset_password(user, request)
                return HttpResponse(status=200)
        except Exception as e:
                print(e)
        return HttpResponse(status=404)
    else:
        return HttpResponse(status=404)


class PasswordResetConfirmView(FormView):
    template_name = "account/pwdoublie.html"
    success_url = '/account/pwdenvoye'
    form_class = SetPasswordForm

    def post(self, request, uidb64=None, token=None, *arg, **kwargs):
        """
        View that checks the hash in a password reset link and presents a
        form for entering a new password.
        """
        form = self.form_class(request.POST)
        assert uidb64 is not None and token is not None  # checked by URLconf
        try:
            uid = urlsafe_base64_decode(uidb64)
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            if form.is_valid():
                new_password = form.cleaned_data['confirmation']

                user.password = hashlib.sha256(new_password.encode('utf8')).hexdigest()
                user.save()
                messages.success(request, 'Your password has been modified')
                return self.form_valid(form)
            else:
                print(form.errors)
                messages.error(request, form.errors)
                return self.form_invalid(form)
        else:
            messages.error(
                request, 'This link has expired.')
            return self.form_invalid(form)

def pwdenvoye(request):
    return render(request,'account/pwdmodifie.html',{})