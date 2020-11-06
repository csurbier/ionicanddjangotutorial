from django import forms

class PasswordResetRequestForm(forms.Form):
    email_or_username = forms.CharField(label=("Email Or Username"), max_length=254)

class SetPasswordForm(forms.Form):
    """
    A form that lets a user change set their password without entering the old
    password
    """
    error_messages = {
        'password_mismatch': ("Les mots de passe ne correspondent pas."),
        'password_length': ("Ton mot de passe doit contenir au moins 8 caractères."),
        }
    new_password1 = forms.CharField(label=("Nouveau mot de passe"),
                                    widget=forms.PasswordInput)
    confirmation = forms.CharField(label=("Nouveau mot de passe confirmation"),
                                    widget=forms.PasswordInput)

    def clean_confirmation(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('confirmation')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    self.error_messages['password_mismatch'],
                    code='password_mismatch',
                    )
            if len(password1)<8:
                raise forms.ValidationError(
                    self.error_messages['password_length'],
                    code='password_length',
                )
        return password2