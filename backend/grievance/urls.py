from django.urls import path
from .views import CreateGrievanceView, GetGrievanceView, GetPendingGrievances, GetResolvedGrievances, GetRejectedGrievances, GetGrievanceNotification, GetGrievanceByIdView, GetGrievanceForAdmin, GetUpdatedGrievanceForAdmin, GetGrievanceByIdAdminView

urlpatterns = [
    # Grievance for user
    path('create', CreateGrievanceView.as_view()),
    path('get', GetGrievanceView.as_view()),
    path('get/pending', GetPendingGrievances.as_view()),
    path('get/resolved', GetResolvedGrievances.as_view()),
    path('get/rejected', GetRejectedGrievances.as_view()),
    path('get/<str:grievance_id>', GetGrievanceByIdView.as_view()),
    path('update/<str:grievance_id>', GetGrievanceByIdView.as_view()),
    path('delete/<str:grievance_id>', GetGrievanceByIdView.as_view()),
    
    path('notification/update/<str:grievance_id>', GetGrievanceNotification.as_view()),
    path('notification', GetGrievanceNotification.as_view(), name='get_notifications'),
    
    
    # Grievance for admin
    path('admin/getall', GetGrievanceForAdmin.as_view()),
    path('admin/get/<str:grievance_id>', GetGrievanceByIdAdminView.as_view()),
    path('admin/update/<str:grievance_id>', GetGrievanceForAdmin.as_view()),
    path('admin/getupdated', GetUpdatedGrievanceForAdmin.as_view()),
]