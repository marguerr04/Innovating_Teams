/**
 * @jest-environment jsdom
 * Pruebas unitarias para el componente de validación de código de equipo
 * Prueba el flujo de entrada de código de 7 dígitos y validación con backend
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import PhaseSalaCodigo from '../../../modules/student/features/Phase-2/index';

// Mock de axios
jest.mock('axios');

describe('PhaseSalaCodigo - Validación de Código de Equipo', () => {
  
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    jest.clearAllMocks();
  });

  /**
   * TEST 1: Renderizado inicial del componente
   */
  describe('Renderizado inicial', () => {
    it('debe renderizar el título correcto', () => {
      const mockOnJoin = jest.fn();
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      expect(screen.getByText(/Unirse a tu Equipo/i)).toBeInTheDocument();
    });

    it('debe mostrar placeholder de 7 dígitos', () => {
      const mockOnJoin = jest.fn();
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      const input = screen.getByPlaceholderText('1234567');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('maxLength', '7');
    });

    it('debe tener el botón deshabilitado inicialmente', () => {
      const mockOnJoin = jest.fn();
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      const button = screen.getByRole('button', { name: /Unirse al Juego/i });
      expect(button).toBeDisabled();
    });
  });

  /**
   * TEST 2: Validación de entrada de texto
   */
  describe('Validación de entrada', () => {
    it('debe aceptar solo números', () => {
      const mockOnJoin = jest.fn();
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      const input = screen.getByPlaceholderText('1234567');
      
      // Intentar ingresar letras
      fireEvent.change(input, { target: { value: 'abc123' } });
      expect(input.value).toBe('123'); // Solo números
      
      // Ingresar números válidos
      fireEvent.change(input, { target: { value: '9773211' } });
      expect(input.value).toBe('9773211');
    });

    it('debe limitar a 7 dígitos', () => {
      const mockOnJoin = jest.fn();
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      const input = screen.getByPlaceholderText('1234567');
      
      // Intentar ingresar más de 7 dígitos
      fireEvent.change(input, { target: { value: '123456789' } });
      expect(input.value.length).toBeLessThanOrEqual(7);
    });

    it('debe habilitar el botón cuando hay 7 dígitos', () => {
      const mockOnJoin = jest.fn();
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      const input = screen.getByPlaceholderText('1234567');
      const button = screen.getByRole('button', { name: /Unirse al Juego/i });
      
      // Botón deshabilitado con menos de 7 dígitos
      fireEvent.change(input, { target: { value: '123456' } });
      expect(button).toBeDisabled();
      
      // Botón habilitado con 7 dígitos
      fireEvent.change(input, { target: { value: '1234567' } });
      expect(button).not.toBeDisabled();
    });
  });

  /**
   * TEST 3: Validación con backend (código válido)
   */
  describe('Validación exitosa con backend', () => {
    it('debe validar código correcto y guardar datos en localStorage', async () => {
      const mockOnJoin = jest.fn();
      
      // Mock de respuesta exitosa del backend
      axios.post.mockResolvedValueOnce({
        data: {
          valido: true,
          partida_id: 70,
          partida_codigo: '977321',
          equipo_id: 151,
          equipo_nombre: 'Equipo Innovadores',
          equipo_numero: 1,
          codigo_equipo: '9773211'
        }
      });
      
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      const input = screen.getByPlaceholderText('1234567');
      const button = screen.getByRole('button', { name: /Unirse al Juego/i });
      
      // Ingresar código válido
      fireEvent.change(input, { target: { value: '9773211' } });
      
      // Click en botón
      fireEvent.click(button);
      
      // Esperar a que se complete la validación
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:8000/api/validar-equipo/',
          { codigo: '9773211' }
        );
      });
      
      // Verificar que se llamó onJoin
      await waitFor(() => {
        expect(mockOnJoin).toHaveBeenCalledWith('9773211');
      });
      
      // Verificar que se guardó en localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('partida_id', '70');
      expect(localStorage.setItem).toHaveBeenCalledWith('equipo_id', '151');
      expect(localStorage.setItem).toHaveBeenCalledWith('equipo_nombre', 'Equipo Innovadores');
      expect(localStorage.setItem).toHaveBeenCalledWith('codigo_equipo', '9773211');
    });
  });

  /**
   * TEST 4: Manejo de errores
   */
  describe('Manejo de errores', () => {
    it('debe mostrar error con código inválido', async () => {
      const mockOnJoin = jest.fn();
      
      // Mock de respuesta de error
      axios.post.mockRejectedValueOnce({
        response: {
          data: {
            error: 'Código inválido. Verifica con tu profesor el código correcto de tu equipo'
          }
        }
      });
      
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      const input = screen.getByPlaceholderText('1234567');
      const button = screen.getByRole('button', { name: /Unirse al Juego/i });
      
      // Ingresar código inválido
      fireEvent.change(input, { target: { value: '0000000' } });
      fireEvent.click(button);
      
      // Esperar mensaje de error
      await waitFor(() => {
        expect(screen.getByText(/Código inválido/i)).toBeInTheDocument();
      });
      
      // No debe llamar a onJoin
      expect(mockOnJoin).not.toHaveBeenCalled();
    });

    it('debe mostrar error cuando el backend no responde', async () => {
      const mockOnJoin = jest.fn();
      
      // Mock de error de conexión
      axios.post.mockRejectedValueOnce({
        request: {}
      });
      
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      const input = screen.getByPlaceholderText('1234567');
      const button = screen.getByRole('button', { name: /Unirse al Juego/i });
      
      fireEvent.change(input, { target: { value: '9773211' } });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/No se pudo conectar con el servidor/i)).toBeInTheDocument();
      });
    });

    it('debe validar formato antes de enviar al backend', () => {
      const mockOnJoin = jest.fn();
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      const input = screen.getByPlaceholderText('1234567');
      const button = screen.getByRole('button', { name: /Unirse al Juego/i });
      
      // Dejar vacío
      fireEvent.click(button);
      
      // Debe mostrar error sin llamar al backend
      expect(screen.getByText(/Por favor, ingresa un código/i)).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  /**
   * TEST 5: Estados de carga
   */
  describe('Estados de carga', () => {
    it('debe mostrar estado de validando mientras espera respuesta', async () => {
      const mockOnJoin = jest.fn();
      
      // Mock con delay para simular carga
      axios.post.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            data: { valido: true, partida_id: 70, equipo_id: 151 }
          }), 100)
        )
      );
      
      render(<PhaseSalaCodigo onJoin={mockOnJoin} />);
      
      const input = screen.getByPlaceholderText('1234567');
      const button = screen.getByRole('button', { name: /Unirse al Juego/i });
      
      fireEvent.change(input, { target: { value: '9773211' } });
      fireEvent.click(button);
      
      // Debe mostrar "Validando..."
      await waitFor(() => {
        expect(screen.getByText(/Validando/i)).toBeInTheDocument();
      });
      
      // El input debe estar deshabilitado
      expect(input).toBeDisabled();
    });
  });
});
