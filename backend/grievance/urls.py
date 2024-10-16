from django.urls import path
from .views import CreateGrievanceView, GetGrievanceView, GetGrievanceByIdView

urlpatterns = [
    path('create', CreateGrievanceView.as_view()),
    path('get', GetGrievanceView.as_view()),
    path('get/<str:grievance_id>', GetGrievanceByIdView.as_view()),
    path('update/<str:grievance_id>', GetGrievanceByIdView.as_view()),
    path('delete/<str:grievance_id>', GetGrievanceByIdView.as_view()),
]