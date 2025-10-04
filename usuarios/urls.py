from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/alumno/', views.login_alumno, name='login_alumno'),
    path('login/profesor_admin/', views.login_profesor, name='login_profesor_admin'),
]
