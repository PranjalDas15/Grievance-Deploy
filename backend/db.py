# import os
from pymongo import MongoClient
# from dotenv import load_dotenv

# load_dotenv()

connection_uri = "mongodb+srv://pranjal080015:F4hlysFvW2W7Om9x@grievancedb.oh7pt.mongodb.net/?retryWrites=true&w=majority&appName=GrievanceDb"
try:
    client = MongoClient(connection_uri)
    db = client['GrievanceDb']
    print("Connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

user_collection = db['Users']
grievance_collection = db['Grievance']
