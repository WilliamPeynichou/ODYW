import jwt
import time

secret = 'tu-secreto-muy-seguro'
payload = {
    'sub': 'usuario123',
    'roles': ['user'],
    'iat': int(time.time()),
    'exp': int(time.time()) + 3600  # 1 hora de expiración
}

token = jwt.encode(payload, secret, algorithm='HS256')
print(token)