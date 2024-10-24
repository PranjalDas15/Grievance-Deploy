from django.shortcuts import render
from db import grievance_collection, user_collection, notification_collection
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
        time_str = now.strftime('%M%S')  
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
                'created_at': grievance['created_at'],
                'updated_at': grievance.get('updated_at', None)
                
            }
            formatted_grievances.append(formatted_grievance)

        return Response({
            'message': 'All grievances retrieved successfully.',
            'grievances': formatted_grievances
        })
        
class GetPendingGrievances(APIView):
    def get(self, request):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        user_id = payload['id']
        
        pending_grievances = list(grievance_collection.find({"user_id": user_id, "status": "Pending"}, {'_id': 0}))
        
        formatted_grievances = [
            {
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
            for grievance in pending_grievances
        ]

        return Response({
            'message': 'Pending grievances retrieved successfully.',
            'grievances': formatted_grievances
        })
        
class GetRejectedGrievances(APIView):
    def get(self, request):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        user_id = payload['id']
        
        pending_grievances = list(grievance_collection.find({"user_id": user_id, "status": "Rejected"}, {'_id': 0}))
        
        formatted_grievances = [
            {
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
                'created_at': grievance['created_at'],
                'updated_at': grievance['updated_at']
            }
            for grievance in pending_grievances
        ]

        return Response({
            'message': 'Rejected grievances retrieved successfully.',
            'grievances': formatted_grievances
        })
class GetResolvedGrievances(APIView):
    def get(self, request):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        user_id = payload['id']
        
        pending_grievances = list(grievance_collection.find({"user_id": user_id, "status": "Resolved"}, {'_id': 0}))
        
        formatted_grievances = [
            {
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
                'created_at': grievance['created_at'],
                'updated_at': grievance['updated_at']
            }
            for grievance in pending_grievances
        ]

        return Response({
            'message': 'Resolved grievances retrieved successfully.',
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
                'created_at': grievance['created_at'],
                'updated_at': grievance.get('updated_at', None)
                
            }
            formatted_grievances.append(formatted_grievance)

        return Response({
            'message': 'All my grievances retrieved successfully.',
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

class GetGrievanceNotification(APIView):
    def get(self, request):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        user_id = payload['id']
        print(f"Token user ID: {user_id}" )

        notifications = list(notification_collection.find({"user_id": user_id, "is_read": False}, {'_id': 0}))
        
        if not notifications:
            return Response({
                'message': 'No notifications found.',
                'notifications': [] 
            })
        
        formatted_notifications = [
            {
                'user_id': notification['user_id'],
                'grievance_id': notification['grievance_id'],
                'message': notification['message'],
                'is_read': notification['is_read'],
                # 'updated_at': notification['updated_at'],
                'created_at': notification['created_at']
            } 
            for notification in notifications
        ]

        return Response({
            'message': 'Notifications retrieved successfully.', 
            'notifications': formatted_notifications 
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
        
        notification = notification_collection.find_one({"grievance_id": grievance_id, "user_id": user_id})
        
        if not notification:
            raise ValidationError("Notification not found or you are not authorized to update it.")
        
        if notification['is_read']:
            raise ValidationError('Notification already read.')
    
        
        update_data = {
            'is_read': True,
        }

        try:
            notification_collection.update_one({"grievance_id": grievance_id, "user_id": user_id}, {"$set": update_data})
        except Exception as e:
            raise Exception(f"Failed to update grievance: {str(e)}")

        return Response({
            'message': 'Notification has been read.',
            'notification': {
                'user_id': notification['user_id'],  
                'grievance_id': notification['grievance_id'],  
                'is_read': True,
                'updated_at': datetime.now().isoformat(),
                'created_at':notification['created_at'] 
            }
        })
    
#Admin Views
        
class GetGrievanceForAdmin(APIView):
    def get(self, request):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        if payload['role'] != 'Admin':
            raise AuthenticationFailed("Unauthorized User")
        
        pending_grievances = list(grievance_collection.find(
            {"status": "Pending"}, {'_id': 0}
        ))
        
        formatted_grievances = [
            {
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
            for grievance in pending_grievances
        ]

        return Response({
            'message': 'All grievances retrieved successfully.',
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

        if payload['role'] != 'Admin':
            raise AuthenticationFailed("Unauthorized user.")
        
        grievance = grievance_collection.find_one({"grievance_id": grievance_id})
        
        if not grievance:
            raise ValidationError("Grievance not found or you are not authorized to update it.")
        
        if(grievance['status'] != 'Pending'):
            raise ValidationError('Grievance Already Updated')
        
        status = request.data.get('status', grievance['status'])
        
        update_data = {
            'status': status,
            'updated_at': datetime.now().isoformat()  
        }

        try:
            grievance_collection.update_one({"grievance_id": grievance_id}, {"$set": update_data})
        except Exception as e:
            raise Exception(f"Failed to update grievance: {str(e)}")
        
        notification_data = {
            'user_id': grievance['user_id'],  
            'grievance_id': grievance_id,
            'message': f"Your grievance with ID {grievance_id} has been '{status}'.",
            'is_read': False,
            'created_at': datetime.now().isoformat(),
        }

        try:
            notification_collection.insert_one(notification_data)
        except Exception as e:
            raise Exception(f"Failed to create notification: {str(e)}")

        return Response({
            'message': 'Grievance updated successfully.',
            'grievance': {
                'grievance_id': grievance_id,
                'status': status, 
                'created_at': grievance['created_at'],  
                'updated_at': datetime.now().isoformat()  
            },
            'notification': {
                'user_id': grievance['user_id'],  
                'grievance_id': notification_data['grievance_id'],
                'message': notification_data['message'],
                'is_read': notification_data['is_read'],
                'updated_at': None,
                'created_at': notification_data['created_at']
            }
            
        })
        
class GetGrievanceByIdAdminView(APIView):
    def get(self, request, grievance_id):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')
        
        if payload['role'] != 'Admin':
            raise AuthenticationFailed("Unauthorized user.")

        grievance = grievance_collection.find_one({"grievance_id": grievance_id})
        if not grievance:
            return Response({"message": "Grievance not found."}, status=404)
        
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
            'created_at': grievance['created_at'],
            'updated_at': grievance.get('updated_at', None)
        }

        return Response({
            'message': 'Grievance retrieved successfully.',
            'grievances': formatted_grievance
        })

class GetUpdatedGrievanceForAdmin(APIView):
    def get(self, request):
        token = request.COOKIES.get('token')
        
        if not token:
            raise AuthenticationFailed("Unauthenticated user.")
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated user.')

        if payload['role'] != 'Admin':
            raise AuthenticationFailed("Unauthorized User")
        
        non_pending_grievances = list(grievance_collection.find(
            {"status": {"$ne": "Pending"}}, {'_id': 0}
        ))
        
        formatted_grievances = [
            {
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
                'created_at': grievance['created_at'],
                'updated_at': grievance['updated_at'],
            }
            for grievance in non_pending_grievances
        ]

        return Response({
            'message': 'Updated grievances retrieved successfully.',
            'grievances': formatted_grievances
        })
        

