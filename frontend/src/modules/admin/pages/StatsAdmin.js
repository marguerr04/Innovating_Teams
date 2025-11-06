import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const StatsAdmin = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    students: [120, 135, 148, 162, 175, 189],
    projects: [45, 52, 48, 61, 55, 67],
    completion: [78, 82, 79, 85, 88, 92]
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Estadísticas</h2>
            <p className="text-gray-600">Análisis detallado del rendimiento del sistema</p>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-green-600">+12.5%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Proyectos Completados</p>
                <p className="text-2xl font-bold text-gray-900">2,567</p>
                <p className="text-sm text-green-600">+8.2%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-gray-900">92%</p>
                <p className="text-sm text-green-600">+3.1%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                <p className="text-2xl font-bold text-gray-900">4.2h</p>
                <p className="text-sm text-red-600">-0.3h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mock Chart 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crecimiento de Estudiantes</h3>
            <div className="h-64 bg-gradient-to-t from-blue-50 to-white rounded-lg flex items-end justify-between px-4 pb-4">
              {chartData.students.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-blue-500 w-8 rounded-t"
                    style={{ height: `${(value / Math.max(...chartData.students)) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{chartData.labels[index]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Chart 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyectos por Mes</h3>
            <div className="h-64 bg-gradient-to-t from-green-50 to-white rounded-lg flex items-end justify-between px-4 pb-4">
              {chartData.projects.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-green-500 w-8 rounded-t"
                    style={{ height: `${(value / Math.max(...chartData.projects)) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{chartData.labels[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance by Phase */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Fase</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fase</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participantes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completados</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasa de Éxito</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promedio</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { phase: 'Fase 1: Rompehielos', participants: 234, completed: 228, success: 97.4, average: 8.7 },
                  { phase: 'Fase 2: Empatía', participants: 228, completed: 215, success: 94.3, average: 8.2 },
                  { phase: 'Fase 3: Definición', participants: 215, completed: 198, success: 92.1, average: 7.9 },
                  { phase: 'Fase 4: Ideación', participants: 198, completed: 186, success: 93.9, average: 8.4 },
                  { phase: 'Fase 5: Prototipado', participants: 186, completed: 172, success: 92.5, average: 8.1 },
                  { phase: 'Fase 6: Testeo', participants: 172, completed: 165, success: 95.9, average: 8.6 },
                  { phase: 'Fase 7: Implementación', participants: 165, completed: 152, success: 92.1, average: 8.3 }
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.phase}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.participants}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.completed}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row.success >= 95 ? 'bg-green-100 text-green-800' :
                        row.success >= 90 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.success}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.average}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StatsAdmin;