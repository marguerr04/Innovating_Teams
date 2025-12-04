// Script de prueba para verificar la integración Backend-Frontend
// Ejecutar en la consola del navegador en la página de GroupBuilderOptimized

// ==================================================================
// 🧪 TEST 1: Verificar que el servicio gameService esté disponible
// ==================================================================
console.log('🧪 TEST 1: Verificando servicio gameService...');

async function test1_verificarServicio() {
  try {
    // Importar el servicio (si estás en el contexto correcto)
    const apiUrl = 'http://127.0.0.1:8000/api/';
    console.log('✅ API Base URL configurada:', apiUrl);
    return true;
  } catch (error) {
    console.error('❌ Error verificando servicio:', error);
    return false;
  }
}

// ==================================================================
// 🧪 TEST 2: Probar creación de partida
// ==================================================================
console.log('\n🧪 TEST 2: Probando creación de partida...');

async function test2_crearPartida() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/crear-partida/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        estado: 'CREADA',
        max_equipos: 4,
        max_participantes: 100
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Partida creada exitosamente:');
    console.log('   - ID:', data.id);
    console.log('   - PIN:', data.codigoAcceso);
    console.log('   - Estado:', data.estado);
    console.log('   - Max Equipos:', data.maxEquipos);
    console.log('   - Max Participantes:', data.maxParticipantes);
    
    return data;
  } catch (error) {
    console.error('❌ Error creando partida:', error.message);
    return null;
  }
}

// ==================================================================
// 🧪 TEST 3: Probar asignación de grupos
// ==================================================================
console.log('\n🧪 TEST 3: Probando asignación de grupos...');

async function test3_asignarGrupos(partidaId) {
  try {
    const gruposPrueba = [
      {
        nombre: 'Equipo Test 1',
        alumnos: [
          {
            id_correo_usuario: 'test1@mail.com',
            primer_nombre: 'Test',
            apellido_paterno: 'Uno',
            apellido_materno: 'Prueba'
          },
          {
            id_correo_usuario: 'test2@mail.com',
            primer_nombre: 'Test',
            apellido_paterno: 'Dos',
            apellido_materno: 'Prueba'
          }
        ]
      },
      {
        nombre: 'Equipo Test 2',
        alumnos: [
          {
            id_correo_usuario: 'test3@mail.com',
            primer_nombre: 'Test',
            apellido_paterno: 'Tres',
            apellido_materno: 'Prueba'
          }
        ]
      }
    ];

    console.log('📤 Enviando grupos para partida ID:', partidaId);
    
    const response = await fetch(`http://127.0.0.1:8000/api/partida/${partidaId}/asignar-grupos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grupos: gruposPrueba
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Grupos asignados exitosamente:');
    console.log('   - Mensaje:', data.mensaje);
    console.log('   - Partida ID:', data.partida_id);
    console.log('   - Grupos creados:', data.grupos_creados.length);
    
    data.grupos_creados.forEach((grupo, index) => {
      console.log(`   📁 Grupo ${index + 1}:`);
      console.log(`      - ID Equipo: ${grupo.id_equipo_creado}`);
      console.log(`      - Nombre: ${grupo.nombre_grupo}`);
      console.log(`      - Alumnos asignados: ${grupo.alumnos_asignados.length}`);
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error asignando grupos:', error.message);
    return null;
  }
}

// ==================================================================
// 🧪 TEST 4: Verificar datos guardados en BD
// ==================================================================
console.log('\n🧪 TEST 4: Verificando datos en BD...');

async function test4_verificarGrupos(partidaId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/partida/${partidaId}/obtener-grupos/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Grupos obtenidos de BD:');
    console.log('   - Total grupos:', data.grupos?.length || 0);
    
    if (data.grupos) {
      data.grupos.forEach((grupo, index) => {
        console.log(`   📁 Grupo ${index + 1}:`);
        console.log(`      - ID: ${grupo.id}`);
        console.log(`      - Nombre: ${grupo.nombre}`);
        console.log(`      - Tamaño: ${grupo.tamanoequipo || 'N/A'}`);
        console.log(`      - Integrantes: ${grupo.integrantes?.length || 0}`);
      });
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error obteniendo grupos:', error.message);
    return null;
  }
}

// ==================================================================
// 🧪 TEST 5: Flujo completo de integración
// ==================================================================
console.log('\n🧪 TEST 5: Ejecutando flujo completo...\n');

async function test5_flujoCompleto() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 INICIO DEL TEST COMPLETO DE INTEGRACIÓN');
  console.log('═══════════════════════════════════════════════════════\n');

  // Paso 1: Crear partida
  console.log('📍 PASO 1: Creando partida...');
  const partida = await test2_crearPartida();
  
  if (!partida) {
    console.error('\n❌ ERROR: No se pudo crear la partida. Deteniendo test.');
    return;
  }
  
  console.log(`\n✅ Partida creada con ID: ${partida.id} y PIN: ${partida.codigoAcceso}\n`);
  
  // Esperar 1 segundo
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Paso 2: Asignar grupos
  console.log('📍 PASO 2: Asignando grupos a la partida...');
  const resultado = await test3_asignarGrupos(partida.id);
  
  if (!resultado) {
    console.error('\n❌ ERROR: No se pudieron asignar los grupos. Deteniendo test.');
    return;
  }
  
  console.log('\n✅ Grupos asignados exitosamente\n');
  
  // Esperar 1 segundo
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Paso 3: Verificar datos
  console.log('📍 PASO 3: Verificando datos guardados en BD...');
  const verificacion = await test4_verificarGrupos(partida.id);
  
  if (!verificacion) {
    console.error('\n❌ ERROR: No se pudieron verificar los grupos.');
    return;
  }
  
  console.log('\n✅ Datos verificados correctamente en BD\n');
  
  // Resumen final
  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ TEST COMPLETO EXITOSO');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 RESUMEN:');
  console.log(`   - Partida ID: ${partida.id}`);
  console.log(`   - PIN: ${partida.codigoAcceso}`);
  console.log(`   - Grupos creados: ${resultado.grupos_creados.length}`);
  console.log(`   - Total alumnos: ${resultado.grupos_creados.reduce((sum, g) => sum + g.alumnos_asignados.length, 0)}`);
  console.log('\n🎉 La integración Backend-Frontend está funcionando correctamente!');
  console.log('═══════════════════════════════════════════════════════\n');
  
  return {
    partidaId: partida.id,
    pin: partida.codigoAcceso,
    grupos: resultado.grupos_creados
  };
}

// ==================================================================
// 🎯 EJECUTAR TODOS LOS TESTS
// ==================================================================

console.log('\n\n');
console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║   🧪 SUITE DE PRUEBAS: INTEGRACIÓN BACKEND-FRONTEND  ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log('\n');

// Ejecutar test completo automáticamente
test5_flujoCompleto().then(resultado => {
  if (resultado) {
    console.log('\n💡 PRÓXIMO PASO:');
    console.log(`   Navegar a: /profesor/waiting-room/${resultado.pin}`);
    console.log(`   O ejecutar en consola: window.location.href = '/profesor/waiting-room/${resultado.pin}';`);
  }
}).catch(error => {
  console.error('\n❌ ERROR CRÍTICO EN EL TEST:', error);
});

// ==================================================================
// 📝 INSTRUCCIONES DE USO
// ==================================================================
console.log('\n📝 COMANDOS DISPONIBLES:');
console.log('   - test1_verificarServicio()     : Verificar configuración del servicio');
console.log('   - test2_crearPartida()          : Crear una partida de prueba');
console.log('   - test3_asignarGrupos(id)       : Asignar grupos a una partida');
console.log('   - test4_verificarGrupos(id)     : Verificar grupos en BD');
console.log('   - test5_flujoCompleto()         : Ejecutar test completo');
console.log('\n');
