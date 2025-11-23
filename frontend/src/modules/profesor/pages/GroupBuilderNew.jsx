import React from 'react';
import ConfiguracionSesion from '../components/ConfiguracionSesion';
import VistaPreviaSala from '../components/VistaPreviaSala';
import useGroupBuilder from '../hooks/useGroupBuilder';

const GroupBuilderNew = () => {
  const {
    // State
    students,
    groups,
    groupSettings,
    isGenerating,
    csvFile,
    parsedCsv,
    csvError,
    uploading,
    uploadResult,
    roomCode,
    
    // Setters
    setGroupSettings,
    
    // Functions
    handleCsvFileChange,
    sendCsvToBackend,
    generatePreview,
    
    // Drag & Drop Functions
    handleDragStart,
    handleDrop,
    handleDragOver,
    canDropInGroup
  } = useGroupBuilder();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white mb-1">Constructor de Grupos - Optimizado</h1>
            <p className="text-blue-100">Organiza a los estudiantes en grupos para las actividades</p>
          </div>

          <div className="flex">
            {/* Panel de Configuración */}
            <ConfiguracionSesion 
              groupSettings={groupSettings}
              setGroupSettings={setGroupSettings}
              students={students}
              csvFile={csvFile}
              csvError={csvError}
              parsedCsv={parsedCsv}
              uploading={uploading}
              isGenerating={isGenerating}
              onCsvFileChange={handleCsvFileChange}
              onSendCsvToBackend={sendCsvToBackend}
              onGeneratePreview={generatePreview}
              uploadResult={uploadResult}
            />

            {/* Vista Previa de Sala */}
            <VistaPreviaSala 
              groups={groups}
              groupSettings={groupSettings}
              students={students}
              roomCode={roomCode}
              isGenerating={isGenerating}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              canDropInGroup={canDropInGroup}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupBuilderNew;