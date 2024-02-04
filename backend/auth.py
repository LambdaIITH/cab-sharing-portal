import os

from google.auth import exceptions
from google.auth.transport import requests
from google.oauth2 import id_token


def authn_user(token):
    CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        email = idinfo["email"]
        name = idinfo["name"]

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        # userid = idinfo["sub"]  # noqa: F841

        return email, name
    except exceptions.InvalidValue:
        raise exceptions.InvalidValue("Token is invalid")
    except ValueError:
        # Invalid token
        return None
