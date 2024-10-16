from django.urls import path
from .views import RegisterView, LoginView, ConsumerView, LogoutView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('consumer', ConsumerView.as_view()),
    path('logout', LogoutView.as_view()),
]