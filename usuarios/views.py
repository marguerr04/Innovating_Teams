from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def login_alumno(request):
    return render(request, 'login_alumno.html')

def login_profesor(request):
    return render(request, 'login_profesor_admin.html')






from rest_framework import viewsets
from .models import VistaDetalleEquipo
from .serializers import DetalleEquipoSerializer

class DetalleEquipoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint que permite ver los detalles de los equipos.
    """
    queryset = VistaDetalleEquipo.objects.all()
    serializer_class = DetalleEquipoSerializer