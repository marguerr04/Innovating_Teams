/**
 * @jest-environment jsdom
 * Pruebas unitarias para TeamCodesDisplay
 * Prueba la visualización de códigos de equipo y funcionalidad de copiar
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamCodesDisplay from '../../modules/profesor/components/TeamCodesDisplay';

// Mock del clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe('TeamCodesDisplay - Visualización de Códigos de Equipo', () => {
  
  const mockGrupos = [
    {
      id: 151,
      nombre_equipo: 'Equipo Innovadores',
      codigo_equipo: '9773211',
      usuarios: ['Juan', 'María']
    },
    {
      id: 152,
      nombre_equipo: 'Equipo Emprendedores',
      codigo_equipo: '9773212',
      usuarios: ['Pedro', 'Ana', 'Luis']
    },
    {
      id: 153,
      nombre_equipo: 'Equipo Creativos',
      codigo_equipo: '9773213',
      usuarios: []
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST 1: Renderizado básico
   */
  describe('Renderizado inicial', () => {
    it('debe renderizar el título de códigos de equipo', () => {
      render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      expect(screen.getByText(/Códigos de Equipo/i)).toBeInTheDocument();
    });

    it('debe renderizar todos los equipos proporcionados', () => {
      render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      expect(screen.getByText('Equipo Innovadores')).toBeInTheDocument();
      expect(screen.getByText('Equipo Emprendedores')).toBeInTheDocument();
      expect(screen.getByText('Equipo Creativos')).toBeInTheDocument();
    });

    it('debe mostrar los códigos de equipo correctamente', () => {
      render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      expect(screen.getByText('9773211')).toBeInTheDocument();
      expect(screen.getByText('9773212')).toBeInTheDocument();
      expect(screen.getByText('9773213')).toBeInTheDocument();
    });

    it('debe mostrar mensaje cuando no hay equipos', () => {
      render(<TeamCodesDisplay grupos={[]} />);
      
      expect(screen.getByText(/No hay equipos creados aún/i)).toBeInTheDocument();
    });
  });

  /**
   * TEST 2: Visualización de información de equipos
   */
  describe('Información de equipos', () => {
    it('debe mostrar el número de usuarios en cada equipo', () => {
      render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      expect(screen.getByText(/2 estudiantes/i)).toBeInTheDocument();
      expect(screen.getByText(/3 estudiantes/i)).toBeInTheDocument();
    });

    it('debe mostrar "0 estudiantes" para equipos vacíos', () => {
      render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      expect(screen.getByText(/0 estudiantes/i)).toBeInTheDocument();
    });

    it('debe aplicar clases CSS para layout en grid', () => {
      const { container } = render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });

  /**
   * TEST 3: Funcionalidad de copiar código
   */
  describe('Copiar código al portapapeles', () => {
    it('debe tener botón de copiar para cada equipo', () => {
      render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      const copyButtons = screen.getAllByText(/Copiar/i);
      expect(copyButtons).toHaveLength(3);
    });

    it('debe copiar código al portapapeles al hacer click', async () => {
      render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      const copyButtons = screen.getAllByText(/Copiar/i);
      
      // Click en primer botón de copiar
      fireEvent.click(copyButtons[0]);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('9773211');
    });

    it('debe mostrar feedback visual después de copiar', async () => {
      render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      const copyButtons = screen.getAllByText(/Copiar/i);
      
      fireEvent.click(copyButtons[0]);
      
      // Debe cambiar el texto del botón
      expect(await screen.findByText(/¡Copiado!/i)).toBeInTheDocument();
    });

    it('debe copiar diferentes códigos para diferentes equipos', async () => {
      render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      const copyButtons = screen.getAllByText(/Copiar/i);
      
      // Copiar primer código
      fireEvent.click(copyButtons[0]);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('9773211');
      
      // Copiar segundo código
      fireEvent.click(copyButtons[1]);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('9773212');
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * TEST 4: Manejo de props inválidas
   */
  describe('Manejo de casos especiales', () => {
    it('debe manejar prop grupos undefined', () => {
      render(<TeamCodesDisplay grupos={undefined} />);
      
      expect(screen.getByText(/No hay equipos creados aún/i)).toBeInTheDocument();
    });

    it('debe manejar prop grupos null', () => {
      render(<TeamCodesDisplay grupos={null} />);
      
      expect(screen.getByText(/No hay equipos creados aún/i)).toBeInTheDocument();
    });

    it('debe manejar equipos sin nombre', () => {
      const gruposSinNombre = [{
        id: 154,
        codigo_equipo: '9773214',
        usuarios: []
      }];
      
      render(<TeamCodesDisplay grupos={gruposSinNombre} />);
      
      expect(screen.getByText('9773214')).toBeInTheDocument();
    });

    it('debe manejar error al copiar', async () => {
      // Mock de error en clipboard
      navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      const copyButtons = screen.getAllByText(/Copiar/i);
      fireEvent.click(copyButtons[0]);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  /**
   * TEST 5: Estilos y apariencia
   */
  describe('Estilos visuales', () => {
    it('debe tener clases de Tailwind para el código', () => {
      const { container } = render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      const codigoElement = container.querySelector('.text-3xl');
      expect(codigoElement).toBeInTheDocument();
    });

    it('debe tener diseño responsive (grid-cols)', () => {
      const { container } = render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      const gridContainer = container.querySelector('.grid-cols-1');
      expect(gridContainer).toBeInTheDocument();
    });

    it('debe aplicar colores de emprendimiento', () => {
      const { container } = render(<TeamCodesDisplay grupos={mockGrupos} />);
      
      // Verificar que existen elementos con colores del tema
      const bgElements = container.querySelectorAll('[class*="bg-"]');
      expect(bgElements.length).toBeGreaterThan(0);
    });
  });
});
