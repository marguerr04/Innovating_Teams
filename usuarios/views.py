from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def login_alumno(request):
    return render(request, 'login_alumno.html')

def login_profesor(request):
    return render(request, 'login_profesor_admin.html')
