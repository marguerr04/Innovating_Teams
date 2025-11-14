# backend/config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 👇 Esta línea conecta todas tus rutas del backend (la API completa)
    path('api/', include('misionemprende.api.urls')),
]
