from rest_framework import serializers
from db import user_collection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.contrib.auth.hashers import make_password

class UserRegistrationError(Exception):
    pass

class UserSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[("Admin", "Admin"), ("Consumer", "Consumer")], default="Consumer", required=False)
    
    def create(self, validated_data):
        
        if not validated_data.get('name') or not validated_data.get('email') or not validated_data.get('password'):
            return Response({"detail": "Please fill all the fields."}, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data["password"] = make_password(validated_data['password'])
        
        if 'role' not in validated_data:
            validated_data['role'] = "Consumer"
        
        user = {
            "name": validated_data['name'],
            "email": validated_data['email'],
            "role": validated_data['role'],  
            "password": validated_data['password'] 
        }
        
        existing_user = user_collection.find_one({"email": validated_data['email']})
        if existing_user:
            raise ValidationError({"detail":"User Already Exists."})
        
        user_id = user_collection.insert_one(user).inserted_id
        return {**user, "_id": str(user_id)}
