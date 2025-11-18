        # OPCIÓN ALTERNATIVA: Actualizar la solución más reciente
        # (Reemplaza el código anterior si prefieres esta opción)
        
        # Buscar la solución más reciente del equipo
        solucion = SolucionLego.objects.filter(equipo=equipo).order_by('-fechacreacion').first()
        
        if solucion:
            # Actualizar la más reciente
            solucion.fotoprototipurl = image_url
            solucion.descripsoluc = descripcion
            solucion.save()
            created = False
            print(f"DEBUG: Solución actualizada - ID: {solucion.id}")
        else:
            # Crear nueva si no existe ninguna
            solucion = SolucionLego.objects.create(
                equipo=equipo,
                fechacreacion=timezone.now(),
                descripsoluc=descripcion,
                fotoprototipurl=image_url
            )
            created = True
            print(f"DEBUG: Nueva solución creada - ID: {solucion.id}")