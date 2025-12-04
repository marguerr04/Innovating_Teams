import os
import time  # 1. IMPORT AGREGADO
import django
from django.contrib.auth import get_user_model
from django.conf import settings
from django.db import IntegrityError, transaction, connections # 1. IMPORT AGREGADO (connections)
from django.db.utils import OperationalError # 1. IMPORT AGREGADO

# --- Configuración del Entorno Django (CLAVE) ---
# Se asegura de que Django pueda usar los settings del proyecto
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'misionemprende.settings') 
django.setup()

# --- Usuarios de Prueba y Contraseña Fija ---
USERS_TO_RESET = [
    # Profesor de prueba (ID 15 en el dump SQL)
    {'email': 'usuario2@innovate.com', 'role': 'PROFESOR'},
    
    # Administrador de prueba (ID 18 en el dump SQL)
    {'email': 'usuario5@innovate.com', 'role': 'ADMINISTRADOR'}
]
NEW_PASSWORD = 'contraseña123' 

User = get_user_model()

# 2. NUEVA FUNCIÓN DE ESPERA
def wait_for_db():
    """
    Intenta conectar a la base de datos en un bucle.
    Espera si la BD está en proceso de inicio ('starting up').
    """
    print("⏳ Verificando disponibilidad de la Base de Datos...")
    max_retries = 30
    
    for i in range(max_retries):
        try:
            # Intenta obtener un cursor para ver si la conexión está viva
            connections['default'].cursor()
            print("✅ Base de datos lista y conectada.")
            return True
        except OperationalError as e:
            # Si el error sugiere que está iniciando o hay problemas de conexión
            if "starting up" in str(e) or "connection" in str(e):
                print(f"🔄 La BD se está iniciando... esperando 1s (Intento {i+1}/{max_retries})")
                time.sleep(1)
            else:
                # Si es otro error operativo, lo lanzamos
                raise e
    
    return False

def wait_for_table(table_name, max_retries=30, delay=2):
    """Verifica repetidamente si una tabla específica existe en la BD."""
    print(f"⏳ Verificando disponibilidad de la tabla '{table_name}'...")
    for attempt in range(max_retries):
        try:
            with connections['default'].cursor() as cursor:
                cursor.execute("SELECT to_regclass(%s);", [table_name])
                result = cursor.fetchone()
                if result and result[0]:
                    print(f"✅ Tabla '{table_name}' lista.")
                    return True
        except OperationalError as e:
            if "does not exist" not in str(e):
                print(f"⚠️ Esperando tabla '{table_name}': {e}")
        time.sleep(delay)
        print(f"🔄 Intento {attempt + 1}/{max_retries}: tabla aún no disponible, reintentando en {delay}s...")
    return False

def reset_user_passwords(user_list, password):
    """Fuerza la contraseña a los usuarios existentes en la BD."""
    print("--- INICIANDO RESTABLECIMIENTO DE CONTRASEÑAS ---")
    
    for user_data in user_list:
        email = user_data['email']
        
        try:
            # 1. Buscar el usuario por email
            with transaction.atomic():
                user = User.objects.get(email=email)
            
            # 2. Establecer la nueva contraseña (Django la hashea automáticamente)
            user.set_password(password)
            user.save()
            
            print(f"✅ ÉXITO: Contraseña de '{email}' ({user_data['role']}) forzada a '{password}'.")
            
        except User.DoesNotExist:
            print(f"⚠️ AVISO: El usuario '{email}' NO fue encontrado en la base de datos (VERIFIQUE el .sql).")
        except Exception as e:
            print(f"❌ ERROR inesperado al actualizar la contraseña de '{email}': {e}")

# 3. MODIFICACIÓN DEL BLOQUE PRINCIPAL
if __name__ == "__main__":
    db_ready = wait_for_db()
    table_ready = wait_for_table('public.api_usuario') if db_ready else False

    if db_ready and table_ready:
        reset_user_passwords(USERS_TO_RESET, NEW_PASSWORD)
        print("--- PROCESO DE CONTRASEÑAS TERMINADO ---")
    else:
        if not db_ready:
            print("❌ ERROR CRÍTICO: La base de datos no estuvo disponible a tiempo.")
        elif not table_ready:
            print("❌ ERROR: La tabla 'api_usuario' no estuvo disponible dentro del tiempo de espera.")
        exit(1)