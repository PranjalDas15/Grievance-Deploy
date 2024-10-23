from django.urls import path
from .views import CreateGrievanceView, GetGrievanceView, GetPendingGrievances, GetResolvedGrievances, GetRejectedGrievances, GetGrievanceByIdView, GetGrievanceForAdmin, GetUpdatedGrievanceForAdmin, GetGrievanceByIdAdminView

urlpatterns = [
    path('create', CreateGrievanceView.as_view()),
    path('get', GetGrievanceView.as_view()),
    path('get/pending', GetPendingGrievances.as_view()),
    path('get/resolved', GetResolvedGrievances.as_view()),
    path('get/rejected', GetRejectedGrievances.as_view()),
    path('get/<str:grievance_id>', GetGrievanceByIdView.as_view()),
    path('update/<str:grievance_id>', GetGrievanceByIdView.as_view()),
    path('delete/<str:grievance_id>', GetGrievanceByIdView.as_view()),
    path('admin/getall', GetGrievanceForAdmin.as_view()),
    path('admin/get/<str:grievance_id>', GetGrievanceByIdAdminView.as_view()),
    path('admin/update/<str:grievance_id>', GetGrievanceForAdmin.as_view()),
    path('admin/getupdated', GetUpdatedGrievanceForAdmin.as_view()),
]