import hashlib
from django.utils.translation import ugettext_noop as _
from django.contrib.auth.hashers import BasePasswordHasher, mask_hash
from django.utils.datastructures import OrderedDict
import logging
logger = logging.getLogger('django')


class SHA256PasswordHasher(BasePasswordHasher):
    algorithm = "sha256"

    def encode(self, password, salt, iterations=None):
        assert password is not None
        return hashlib.sha256(password.encode('utf-8')).hexdigest()

    def verify(self, password, encoded):
        logger.info("Password %s et %s" % (password, password.encode('utf-8')))
        encodeValue = hashlib.sha256(password.encode('utf-8')).hexdigest()
        logger.info("ON VERIFIE %s et %s"%(encodeValue,encoded))
        return encodeValue == encoded

    def safe_summary(self, encoded):
        algorithm, iterations, salt, hash = encoded.split('$', 3)
        return OrderedDict([
            (_('algorithm'), 'md5'),
            (_('hash'), mask_hash(hash)),
        ])