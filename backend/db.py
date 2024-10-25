from pymongo import MongoClient
from backend.settings import MONGO_URI

try:
    client = MongoClient(MONGO_URI)
    db = client['GrievanceDb']
    print("Connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

user_collection = db['Users']
grievance_collection = db['Grievance']
notification_collection = db['Notifications']
