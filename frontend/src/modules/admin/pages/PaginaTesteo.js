import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const PaginaTesteo = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const testSuites = [
    {
      id: 'authentication',
      name: 'Autenticación de Usuarios',
      description: 'Pruebas de login, logout y gestión de sesiones',
      tests: [
        'Inicio de sesión con credenciales válidas',
        'Rechazo de credenciales inválidas',
        'Cierre de sesión correcto',
        'Validación de tokens de sesión'
      ]
    },
    {
      id: 'student-flow',
      name: 'Flujo de Estudiantes',
      description: 'Pruebas del recorrido completo de las fases estudiantiles',
      tests: [
        'Navegación entre fases',
        'Guardado de progreso',
        'Validación de actividades completadas',
        'Generación de reportes de progreso'
      ]
    },
    {
      id: 'admin-functions',
      name: 'Funciones Administrativas',
      description: 'Pruebas de las características del panel de administración',
      tests: [
        'Acceso a estadísticas',
        'Gestión de usuarios',
        'Generación de reportes',
        'Configuración del sistema'
      ]
    },
    {
      id: 'database',
      name: 'Conexión a Base de Datos',
      description: 'Pruebas de conectividad y operaciones de la base de datos',
      tests: [
        'Conexión exitosa a la base de datos',
        'Operaciones CRUD básicas',
        'Integridad de los datos',
        'Respaldo y recuperación'
      ]
    },
    {
      id: 'performance',
      name: 'Rendimiento del Sistema',
      description: 'Pruebas de carga y rendimiento de la aplicación',
      tests: [
        'Tiempo de carga de páginas',
        'Respuesta bajo carga múltiple',
        'Optimización de recursos',
        'Escalabilidad del sistema'
      ]
    }
  ];

  const runTest = async (suiteId) => {
    setIsRunning(true);
    setActiveTest(suiteId);
    
    // Simulación de ejecución de pruebas
    for (let i = 0; i < testSuites.find(s => s.id === suiteId).tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestResults(prev => ({
        ...prev,
        [suiteId]: {
          ...prev[suiteId],
          [i]: Math.random() > 0.1 ? 'success' : 'failed' // 90% de éxito
        }
      }));
    }
    
    setIsRunning(false);
    setActiveTest(null);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});
    
    for (const suite of testSuites) {
      setActiveTest(suite.id);
      
      for (let i = 0; i < suite.tests.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTestResults(prev => ({
          ...prev,
          [suite.id]: {
            ...prev[suite.id],
            [i]: Math.random() > 0.1 ? 'success' : 'failed'
          }
        }));
      }
    }
    
    setIsRunning(false);
    setActiveTest(null);
  };

  const getTestStatus = (suiteId, testIndex) => {
    return testResults[suiteId]?.[testIndex] || 'pending';
  };

  const getSuiteStats = (suiteId) => {
    const suite = testSuites.find(s => s.id === suiteId);
    const results = testResults[suiteId] || {};
    const total = suite.tests.length;
    const completed = Object.keys(results).length;
    const passed = Object.values(results).filter(r => r === 'success').length;
    const failed = Object.values(results).filter(r => r === 'failed').length;
    
    return { total, completed, passed, failed };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Página de Testeo</h2>
            <p className="text-gray-600">Ejecuta y monitorea las pruebas del sistema</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setTestResults({});
                setActiveTest(null);
              }}
              disabled={isRunning}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Limpiar Resultados
            </button>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isRunning ? 'Ejecutando...' : 'Ejecutar Todas las Pruebas'}
            </button>
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado General del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {testSuites.reduce((acc, suite) => acc + getSuiteStats(suite.id).total, 0)}
              </p>
              <p className="text-sm text-gray-600">Total de Pruebas</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {testSuites.reduce((acc, suite) => acc + getSuiteStats(suite.id).passed, 0)}
              </p>
              <p className="text-sm text-gray-600">Pruebas Exitosas</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {testSuites.reduce((acc, suite) => acc + getSuiteStats(suite.id).failed, 0)}
              </p>
              <p className="text-sm text-gray-600">Pruebas Fallidas</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {testSuites.reduce((acc, suite) => {
                  const stats = getSuiteStats(suite.id);
                  return acc + (stats.total - stats.completed);
                }, 0)}
              </p>
              <p className="text-sm text-gray-600">Pruebas Pendientes</p>
            </div>
          </div>
        </div>

        {/* Test Suites */}
        <div className="space-y-4">
          {testSuites.map((suite) => {
            const stats = getSuiteStats(suite.id);
            const isActive = activeTest === suite.id;
            
            return (
              <div key={suite.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      {suite.name}
                      {isActive && (
                        <div className="ml-3 flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-sm text-blue-600">Ejecutando...</span>
                        </div>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm">{suite.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {stats.completed}/{stats.total} completadas
                      </p>
                      {stats.completed > 0 && (
                        <p className="text-xs">
                          <span className="text-green-600">{stats.passed} exitosas</span>
                          {stats.failed > 0 && (
                            <span className="text-red-600 ml-2">{stats.failed} fallidas</span>
                          )}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => runTest(suite.id)}
                      disabled={isRunning}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      Ejecutar
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {suite.tests.map((test, index) => {
                    const status = getTestStatus(suite.id, index);
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">{test}</span>
                        <div className="flex items-center">
                          {status === 'pending' && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                              Pendiente
                            </span>
                          )}
                          {status === 'success' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Exitosa
                            </span>
                          )}
                          {status === 'failed' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Fallida
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Configuración</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Entorno:</span>
                  <span className="text-gray-900">Desarrollo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Versión:</span>
                  <span className="text-gray-900">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Node.js:</span>
                  <span className="text-gray-900">v18.17.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">React:</span>
                  <span className="text-gray-900">v18.2.0</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Estado de Servicios</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base de Datos:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Conectada</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">API Backend:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Activa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Autenticación:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operacional</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cache:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Limitado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaginaTesteo;