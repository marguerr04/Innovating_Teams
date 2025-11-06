import React from 'react';
import AdminLayout from '../components/AdminLayout';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Dr. María Elena García',
      role: 'Directora Ejecutiva',
      image: null,
      description: 'Especialista en emprendimiento e innovación con más de 15 años de experiencia.'
    },
    {
      name: 'Ing. Carlos Rodríguez',
      role: 'Director Tecnológico',
      image: null,
      description: 'Experto en desarrollo de plataformas educativas y tecnologías emergentes.'
    },
    {
      name: 'Dra. Ana Sofía López',
      role: 'Coordinadora Académica',
      image: null,
      description: 'Pedagoga especializada en metodologías activas de aprendizaje.'
    },
    {
      name: 'Prof. Juan Manuel Torres',
      role: 'Coordinador de Innovación',
      image: null,
      description: 'Consultor en Design Thinking y metodologías ágiles de innovación.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Fundación de Misión Emprende', description: 'Inicio del proyecto con apoyo institucional' },
    { year: '2021', event: 'Primera cohorte de estudiantes', description: '100 estudiantes completaron el programa' },
    { year: '2022', event: 'Expansión nacional', description: 'Llegamos a 5 ciudades principales' },
    { year: '2023', event: 'Reconocimiento internacional', description: 'Premio a la mejor plataforma educativa de emprendimiento' },
    { year: '2024', event: 'Más de 10,000 graduados', description: 'Alcanzamos la meta de impacto social' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Acerca de Misión Emprende</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transformando el futuro a través de la educación emprendedora y la innovación
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-4">
              <div className="bg-blue-500 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Misión</h3>
            </div>
            <p className="text-gray-600 text-center">
              Formar emprendedores innovadores a través de metodologías activas que desarrollen 
              habilidades para crear soluciones que transformen positivamente la sociedad.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-4">
              <div className="bg-green-500 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Visión</h3>
            </div>
            <p className="text-gray-600 text-center">
              Ser la plataforma líder en Latinoamérica para la formación de emprendedores 
              innovadores, contribuyendo al desarrollo económico y social de la región.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-4">
              <div className="bg-purple-500 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Valores</h3>
            </div>
            <ul className="text-gray-600 text-sm space-y-2">
              <li>• Innovación constante</li>
              <li>• Colaboración activa</li>
              <li>• Impacto social positivo</li>
              <li>• Excelencia académica</li>
              <li>• Diversidad e inclusión</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nuestro Equipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-xs">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nuestra Historia</h3>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{milestone.year}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{milestone.event}</h4>
                  <p className="text-gray-600 text-sm">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Impacto en Números</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">10,000+</p>
              <p className="text-gray-600">Estudiantes Graduados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">2,500+</p>
              <p className="text-gray-600">Proyectos Creados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">150+</p>
              <p className="text-gray-600">Profesores Certificados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">25</p>
              <p className="text-gray-600">Ciudades Alcanzadas</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Email</h4>
              <p className="text-gray-600">info@misionemprende.com</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Teléfono</h4>
              <p className="text-gray-600">+57 (1) 234-5678</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Ubicación</h4>
              <p className="text-gray-600">Bogotá, Colombia</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutPage;