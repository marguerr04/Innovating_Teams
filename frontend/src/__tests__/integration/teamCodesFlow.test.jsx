/**
 * @jest-environment jsdom
 * Prueba de integración: Flujo completo de creación y validación de códigos de equipo
 * Simula: Profesor crea partida → genera códigos → estudiante valida código
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import gameService from '../../services/gameService';
import TeamCodesDisplay from '../../modules/profesor/components/TeamCodesDisplay';
import PhaseSalaCodigo from '../../modules/student/features/Phase-2/index';

jest.mock('axios');

describe('Integración: Flujo Completo de Códigos de Equipo', () => {
  
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  /**
   * TEST 1: Flujo completo exitoso
   */
  it('debe completar el flujo: crear partida → mostrar códigos → validar código', async () => {
    // ===================
    // PASO 1: Profesor crea partida con equipos
    // ===================
    const partidaData = {
      codigo_partida: '977321',
      grupos: [
        { nombre_grupo: 'Equipo Innovadores', alumnos: [] },
        { nombre_grupo: 'Equipo Emprendedores', alumnos: [] },
        { nombre_grupo: 'Equipo Creativos', alumnos: [] },
        { nombre_grupo: 'Equipo Líderes', alumnos: [] }
      ]
    };

    // Mock de respuestas del backend
    const mockCrearPartida = {
      data: {
        message: 'Partida creada correctamente',
        partida_id: 70,
        codigo_partida: '977321'
      }
    };

    const mockAsignarGrupos = {
      data: {
        message: 'Grupos creados correctamente',
        grupos_creados: [
          { id: 151, nombre_equipo: 'Equipo Innovadores', codigo_equipo: '9773211', usuarios: [] },
          { id: 152, nombre_equipo: 'Equipo Emprendedores', codigo_equipo: '9773212', usuarios: [] },
          { id: 153, nombre_equipo: 'Equipo Creativos', codigo_equipo: '9773213', usuarios: [] },
          { id: 154, nombre_equipo: 'Equipo Líderes', codigo_equipo: '9773214', usuarios: [] }
        ]
      }
    };

    axios.post
      .mockResolvedValueOnce(mockCrearPartida)
      .mockResolvedValueOnce(mockAsignarGrupos);

    // Crear partida mediante el servicio
    const resultCreacion = await gameService.crearPartidaConGrupos(partidaData);

    // Verificar que se creó correctamente
    expect(resultCreacion.partida_id).toBe(70);
    expect(resultCreacion.gruposCreados).toHaveLength(4);
    expect(resultCreacion.gruposCreados[0].codigo_equipo).toBe('9773211');

    // ===================
    // PASO 2: Profesor visualiza códigos
    // ===================
    const { container } = render(
      <TeamCodesDisplay grupos={resultCreacion.gruposCreados} />
    );

    // Verificar que se muestran todos los códigos
    expect(screen.getByText('9773211')).toBeInTheDocument();
    expect(screen.getByText('9773212')).toBeInTheDocument();
    expect(screen.getByText('9773213')).toBeInTheDocument();
    expect(screen.getByText('9773214')).toBeInTheDocument();

    // Verificar que se pueden copiar
    const copyButtons = screen.getAllByText(/Copiar/i);
    expect(copyButtons).toHaveLength(4);

    // ===================
    // PASO 3: Estudiante valida código
    // ===================
    const mockValidacion = {
      data: {
        valido: true,
        partida_id: 70,
        partida_codigo: '977321',
        equipo_id: 151,
        equipo_nombre: 'Equipo Innovadores',
        equipo_numero: 1,
        codigo_equipo: '9773211'
      }
    };

    // Nueva llamada para validación
    axios.post.mockResolvedValueOnce(mockValidacion);

    const mockOnJoin = jest.fn();
    render(<PhaseSalaCodigo onJoin={mockOnJoin} />);

    const input = screen.getByPlaceholderText('1234567');
    const button = screen.getByRole('button', { name: /Unirse al Juego/i });

    // Estudiante ingresa código
    fireEvent.change(input, { target: { value: '9773211' } });
    fireEvent.click(button);

    // Esperar validación
    await waitFor(() => {
      expect(mockOnJoin).toHaveBeenCalledWith('9773211');
    });

    // Verificar datos en localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('partida_id', '70');
    expect(localStorage.setItem).toHaveBeenCalledWith('equipo_id', '151');
    expect(localStorage.setItem).toHaveBeenCalledWith('equipo_nombre', 'Equipo Innovadores');
    expect(localStorage.setItem).toHaveBeenCalledWith('codigo_equipo', '9773211');
  });

  /**
   * TEST 2: Múltiples estudiantes validando códigos diferentes
   */
  it('debe permitir que múltiples estudiantes se unan a diferentes equipos', async () => {
    // Crear partida primero
    const mockCrearPartida = {
      data: {
        partida_id: 70,
        codigo_partida: '977321'
      }
    };

    const mockAsignarGrupos = {
      data: {
        grupos_creados: [
          { id: 151, nombre_equipo: 'Equipo 1', codigo_equipo: '9773211', usuarios: [] },
          { id: 152, nombre_equipo: 'Equipo 2', codigo_equipo: '9773212', usuarios: [] }
        ]
      }
    };

    axios.post
      .mockResolvedValueOnce(mockCrearPartida)
      .mockResolvedValueOnce(mockAsignarGrupos);

    await gameService.crearPartidaConGrupos({
      codigo_partida: '977321',
      grupos: [
        { nombre_grupo: 'Equipo 1', alumnos: [] },
        { nombre_grupo: 'Equipo 2', alumnos: [] }
      ]
    });

    // Estudiante 1 valida código del Equipo 1
    const mockValidacion1 = {
      data: {
        valido: true,
        partida_id: 70,
        equipo_id: 151,
        equipo_nombre: 'Equipo 1',
        codigo_equipo: '9773211'
      }
    };

    axios.post.mockResolvedValueOnce(mockValidacion1);

    const mockOnJoin1 = jest.fn();
    const { unmount } = render(<PhaseSalaCodigo onJoin={mockOnJoin1} />);

    fireEvent.change(screen.getByPlaceholderText('1234567'), { target: { value: '9773211' } });
    fireEvent.click(screen.getByRole('button', { name: /Unirse al Juego/i }));

    await waitFor(() => {
      expect(mockOnJoin1).toHaveBeenCalledWith('9773211');
    });

    unmount();
    localStorage.clear();

    // Estudiante 2 valida código del Equipo 2
    const mockValidacion2 = {
      data: {
        valido: true,
        partida_id: 70,
        equipo_id: 152,
        equipo_nombre: 'Equipo 2',
        codigo_equipo: '9773212'
      }
    };

    axios.post.mockResolvedValueOnce(mockValidacion2);

    const mockOnJoin2 = jest.fn();
    render(<PhaseSalaCodigo onJoin={mockOnJoin2} />);

    fireEvent.change(screen.getByPlaceholderText('1234567'), { target: { value: '9773212' } });
    fireEvent.click(screen.getByRole('button', { name: /Unirse al Juego/i }));

    await waitFor(() => {
      expect(mockOnJoin2).toHaveBeenCalledWith('9773212');
    });

    // Verificar que ambos equipos están diferentes
    expect(mockValidacion1.data.equipo_id).not.toBe(mockValidacion2.data.equipo_id);
  });

  /**
   * TEST 3: Error en validación con código incorrecto
   */
  it('debe rechazar código que no existe', async () => {
    // Crear partida con códigos válidos
    const mockCrearPartida = {
      data: { partida_id: 70, codigo_partida: '977321' }
    };

    const mockAsignarGrupos = {
      data: {
        grupos_creados: [
          { id: 151, nombre_equipo: 'Equipo 1', codigo_equipo: '9773211', usuarios: [] }
        ]
      }
    };

    axios.post
      .mockResolvedValueOnce(mockCrearPartida)
      .mockResolvedValueOnce(mockAsignarGrupos);

    await gameService.crearPartidaConGrupos({
      codigo_partida: '977321',
      grupos: [{ nombre_grupo: 'Equipo 1', alumnos: [] }]
    });

    // Estudiante intenta código inválido
    const mockValidacionError = {
      response: {
        data: {
          valido: false,
          error: 'Código inválido. Verifica con tu profesor el código correcto de tu equipo'
        }
      }
    };

    axios.post.mockRejectedValueOnce(mockValidacionError);

    const mockOnJoin = jest.fn();
    render(<PhaseSalaCodigo onJoin={mockOnJoin} />);

    fireEvent.change(screen.getByPlaceholderText('1234567'), { target: { value: '0000000' } });
    fireEvent.click(screen.getByRole('button', { name: /Unirse al Juego/i }));

    await waitFor(() => {
      expect(screen.getByText(/Código inválido/i)).toBeInTheDocument();
    });

    // No debe llamar onJoin
    expect(mockOnJoin).not.toHaveBeenCalled();

    // No debe guardar en localStorage
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  /**
   * TEST 4: Obtener grupos después de crear partida
   */
  it('debe poder obtener grupos creados mediante GET', async () => {
    // Crear partida
    const mockCrearPartida = {
      data: { partida_id: 70, codigo_partida: '977321' }
    };

    const mockAsignarGrupos = {
      data: {
        grupos_creados: [
          { id: 151, nombre_equipo: 'Equipo 1', codigo_equipo: '9773211', usuarios: [] },
          { id: 152, nombre_equipo: 'Equipo 2', codigo_equipo: '9773212', usuarios: [] }
        ]
      }
    };

    axios.post
      .mockResolvedValueOnce(mockCrearPartida)
      .mockResolvedValueOnce(mockAsignarGrupos);

    const resultCreacion = await gameService.crearPartidaConGrupos({
      codigo_partida: '977321',
      grupos: [
        { nombre_grupo: 'Equipo 1', alumnos: [] },
        { nombre_grupo: 'Equipo 2', alumnos: [] }
      ]
    });

    // Obtener grupos mediante GET
    const mockObtenerGrupos = {
      data: {
        grupos: mockAsignarGrupos.data.grupos_creados
      }
    };

    axios.get.mockResolvedValueOnce(mockObtenerGrupos);

    const gruposObtenidos = await gameService.obtenerGrupos(70);

    // Verificar que los datos coinciden
    expect(gruposObtenidos).toHaveLength(2);
    expect(gruposObtenidos[0].codigo_equipo).toBe('9773211');
    expect(gruposObtenidos[1].codigo_equipo).toBe('9773212');

    // Renderizar los códigos obtenidos
    render(<TeamCodesDisplay grupos={gruposObtenidos} />);

    expect(screen.getByText('9773211')).toBeInTheDocument();
    expect(screen.getByText('9773212')).toBeInTheDocument();
  });

  /**
   * TEST 5: Persistencia de datos tras validación exitosa
   */
  it('debe persistir datos de equipo en localStorage tras validación', async () => {
    const mockValidacion = {
      data: {
        valido: true,
        partida_id: 70,
        partida_codigo: '977321',
        equipo_id: 151,
        equipo_nombre: 'Equipo Test',
        equipo_numero: 1,
        codigo_equipo: '9773211'
      }
    };

    axios.post.mockResolvedValueOnce(mockValidacion);

    const mockOnJoin = jest.fn();
    render(<PhaseSalaCodigo onJoin={mockOnJoin} />);

    fireEvent.change(screen.getByPlaceholderText('1234567'), { target: { value: '9773211' } });
    fireEvent.click(screen.getByRole('button', { name: /Unirse al Juego/i }));

    await waitFor(() => {
      expect(mockOnJoin).toHaveBeenCalled();
    });

    // Verificar todos los datos en localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('partida_id', '70');
    expect(localStorage.setItem).toHaveBeenCalledWith('partida_codigo', '977321');
    expect(localStorage.setItem).toHaveBeenCalledWith('equipo_id', '151');
    expect(localStorage.setItem).toHaveBeenCalledWith('equipo_nombre', 'Equipo Test');
    expect(localStorage.setItem).toHaveBeenCalledWith('equipo_numero', '1');
    expect(localStorage.setItem).toHaveBeenCalledWith('codigo_equipo', '9773211');

    // Verificar que se pueden recuperar
    expect(localStorage.getItem('partida_id')).toBe('70');
    expect(localStorage.getItem('codigo_equipo')).toBe('9773211');
  });
});
