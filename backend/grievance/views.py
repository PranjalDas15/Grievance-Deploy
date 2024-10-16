from django.shortcuts import render
from db import grievance_collection, user_collection
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response
import jwt
from rest_framework.views import APIView
from datetime import datetime
from bson import ObjectId

class CreateGrievanceView(APIView):
    def generate_grievance_id(self):
        now = datetime.now()
        date_str = now.strftime('%d%m') 
        time_str = now.strftime('%H%M')  
        custom_grievance_id = f"TOK-{date_str}{time_str}"
        return custom_grievance_id
    
    def post(self, request):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        user_id = payload['id']
        
        user = user_collection.find_one({"_id":ObjectId(user_id)})
        if not user:
            raise AuthenticationFailed("User not found.")
        
        phone = request.data.get('phone')
        consumer_no = request.data.get('consumer_no')
        pincode = request.data.get('pincode')
        address = request.data.get('address')
        category = request.data.get('category')
        detail = request.data.get('detail')

        if not phone or len(str(phone)) != 10:
            raise ValidationError("Phone number must be exactly 10 digits.")

        if not consumer_no or len(str(consumer_no)) != 16:
            raise ValidationError("Consumer number must be exactly 16 digits.")

        if not pincode or len(str(pincode)) != 6:
            raise ValidationError("Pincode must be exactly 6 digits.")

        if not address or address.strip() == "":
            raise ValidationError("Please fill the form first")

        if not category or category.strip() == "":
            raise ValidationError("Please fill the form first")

        if not detail or detail.strip() == "":
            raise ValidationError("Please fill the form first")

        custom_grievance_id = self.generate_grievance_id()

        grievance_data = {
            'grievance_id': custom_grievance_id,
            'user_id': user_id,
            'user_name': user['name'],
            'user_email': user['email'],
            'phone': phone,
            'consumer_no': consumer_no,
            'pincode': pincode,
            'address': address,
            'category': category,
            'detail': detail,
            'status': 'Pending',
            'created_at': datetime.now().isoformat()
        }

        try:
            grievance_collection.insert_one(grievance_data)
        except Exception as e:
            raise Exception(f"Failed to create grievance: {str(e)}")
        
        
        return Response({
            'message': 'You have created a ticket successfully.',
            'grievance': {
                'grievance_id': custom_grievance_id,
                'user_id': str(user['_id']),
                'user_name': user['name'],
                'user_email': user['email'],
                'phone': request.data['phone'],
                'consumer_no': request.data['consumer_no'],
                'pincode': request.data['pincode'],
                'address': request.data['address'],
                'category': request.data['category'],
                'detail': request.data['detail'],
                'status': 'Pending',
                'created_at': datetime.now().isoformat()
            }
        })

class GetGrievanceView(APIView):
    def get(self, request):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        user_id = payload['id']
        grievances = list(grievance_collection.find({"user_id": user_id}))
        
        formatted_grievances = []
        for grievance in grievances:
            formatted_grievance = {
                'grievance_id': grievance['grievance_id'],
                'user_id': str(grievance['user_id']),
                'user_name': grievance['user_name'],
                'user_email': grievance['user_email'],
                'phone': grievance['phone'],
                'consumer_no': grievance['consumer_no'],
                'pincode': grievance['pincode'],
                'address': grievance['address'],
                'category': grievance['category'],
                'detail': grievance['detail'],
                'status': grievance['status'],
                'created_at': grievance['created_at']
            }
            formatted_grievances.append(formatted_grievance)

        return Response({
            'message': 'Grievances retrieved successfully.',
            'grievances': formatted_grievances
        })

class GetGrievanceByIdView(APIView):
    def get(self, request, grievance_id):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        user_id = payload['id']
        grievances = list(grievance_collection.find({"grievance_id": grievance_id,"user_id": user_id}))
        
        formatted_grievances = []
        for grievance in grievances:
            formatted_grievance = {
                'grievance_id': grievance['grievance_id'],
                'user_id': str(grievance['user_id']),
                'user_name': grievance['user_name'],
                'user_email': grievance['user_email'],
                'phone': grievance['phone'],
                'consumer_no': grievance['consumer_no'],
                'pincode': grievance['pincode'],
                'address': grievance['address'],
                'category': grievance['category'],
                'detail': grievance['detail'],
                'status': grievance['status'],
                'created_at': grievance['created_at']
            }
            formatted_grievances.append(formatted_grievance)

        return Response({
            'message': 'Grievances retrieved successfully.',
            'grievances': formatted_grievances
        })
    
    def put(self, request, grievance_id):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        user_id = payload['id']
        grievance = grievance_collection.find_one({"grievance_id": grievance_id,"user_id": user_id})
        
        if not grievance:
            raise ValidationError("Grievance not found or you are not authorized to update it.")
        
        phone = request.data.get('phone', grievance['phone'])
        consumer_no = request.data.get('consumer_no', grievance['consumer_no'])
        pincode = request.data.get('pincode', grievance['pincode'])
        address = request.data.get('address', grievance['address'])
        category = request.data.get('category', grievance['category'])
        detail = request.data.get('detail', grievance['detail'])
        status = request.data.get('status', grievance['status'])
        
        if not phone or len(str(phone)) != 10:
            raise ValidationError("Phone number must be exactly 10 digits.")

        if not consumer_no or len(str(consumer_no)) != 16:
            raise ValidationError("Consumer number must be exactly 16 digits.")

        if not pincode or len(str(pincode)) != 6:
            raise ValidationError("Pincode must be exactly 6 digits.")

        if not address or address.strip() == "":
            raise ValidationError("Please fill the form first")

        if not category or category.strip() == "":
            raise ValidationError("Please fill the form first")

        if not detail or detail.strip() == "":
            raise ValidationError("Please fill the form first")

        update_data = {
            'phone': phone,
            'consumer_no': consumer_no,
            'pincode': pincode,
            'address': address,
            'category': category,
            'detail': detail,
            'status': status,
            'updated_at': datetime.now().isoformat()  
        }

        try:
            grievance_collection.update_one({"grievance_id": grievance_id, "user_id": user_id}, {"$set": update_data})
        except Exception as e:
            raise Exception(f"Failed to update grievance: {str(e)}")

        return Response({
            'message': 'Grievance updated successfully.',
            'grievance': {
                'grievance_id': grievance_id,
                'user_id': str(user_id),
                'phone': phone,
                'consumer_no': consumer_no,
                'pincode': pincode,
                'address': address,
                'category': category,
                'detail': detail,
                'status': status, 
                'created_at': grievance['created_at'],  
                'updated_at': datetime.now().isoformat()  
            }
        })
        
    def delete(self, request, grievance_id):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        user_id = payload['id']
        grievance = grievance_collection.find_one({"grievance_id": grievance_id,"user_id": user_id})
        
        if not grievance:
            raise ValidationError("Grievance not found or you are not authorized to update it.")
        
        try:
            grievance_collection.delete_one({"grievance_id": grievance_id, "user_id": user_id})
        except Exception as e:
            raise Exception(f"Failed to delete grievance: {str(e)}")

        return Response({
            'message': 'Grievance deleted successfully.'
        })
        
