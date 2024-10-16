from bson import ObjectId
from django.shortcuts import render
from db import user_collection
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
import jwt
from datetime import datetime, timedelta, timezone

class RegisterView(APIView):
    def post(self, request):
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        
        if not email or not password:
            raise AuthenticationFailed('Email and password are required.')
        
        user = user_collection.find_one({"email": email})
        
        if not user:
            raise AuthenticationFailed('User not found')

        if not check_password(password, user['password']):
            raise AuthenticationFailed('Incorrect Password.')
        
        payload = {
            'id': str(user['_id']),
            'role': str(user['role']),
            'exp': datetime.now(timezone.utc) + timedelta(days=7),
            'iat': datetime.now(timezone.utc)
        }
        
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        
        response =  Response()
        
        response.set_cookie(key='token', value=token, httponly=True)
        response.data = {
            'message': "Login Successful",
            'user': {
                'name': user['name'],
                'email': user['email'],
                'token': token
            } 
        }
        
        return response
    
class ConsumerView(APIView):
    def get(self, request):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        user_id = (payload['id'])
        
        user = user_collection.find_one({"_id":ObjectId(user_id)})
        if not user:
            raise AuthenticationFailed("User not found.")
        
        return Response({
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        })
        
class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('token')
        response.data = {
            'message': "Logout Successful"
        }
        
        return response