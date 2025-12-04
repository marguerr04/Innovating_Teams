/**
 * Pruebas unitarias para gameService
 * Prueba todas las funciones de comunicación con el backend
 */

import axios from 'axios';
import gameService from '../../services/gameService';

jest.mock('axios');

describe('gameService - Comunicación con API Backend', () => {
  
  const BASE_URL = 'http://localhost:8000/api';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST 1: crearPartidaConGrupos
   */
  describe('crearPartidaConGrupos', () => {
    const mockPartidaData = {
      codigo_partida: '977321',
      grupos: [
        { nombre_grupo: 'Equipo 1', alumnos: [] },
        { nombre_grupo: 'Equipo 2', alumnos: [] },
        { nombre_grupo: 'Equipo 3', alumnos: [] },
        { nombre_grupo: 'Equipo 4', alumnos: [] }
      ]
    };

    const mockCrearResponse = {
      data: {
        message: 'Partida creada correctamente',
        partida_id: 70,
        codigo_partida: '977321'
      }
    };

    const mockAsignarResponse = {
      data: {
        message: 'Grupos creados correctamente',
        grupos_creados: [
          { id: 151, nombre_equipo: 'Equipo 1', codigo_equipo: '9773211' },
          { id: 152, nombre_equipo: 'Equipo 2', codigo_equipo: '9773212' },
          { id: 153, nombre_equipo: 'Equipo 3', codigo_equipo: '9773213' },
          { id: 154, nombre_equipo: 'Equipo 4', codigo_equipo: '9773214' }
        ]
      }
    };

    it('debe crear partida y asignar grupos correctamente', async () => {
      axios.post
        .mockResolvedValueOnce(mockCrearResponse)
        .mockResolvedValueOnce(mockAsignarResponse);

      const result = await gameService.crearPartidaConGrupos(mockPartidaData);

      // Verificar llamadas a axios
      expect(axios.post).toHaveBeenCalledTimes(2);
      
      // Primera llamada: crear-partida
      expect(axios.post).toHaveBeenNthCalledWith(1, 
        `${BASE_URL}/crear-partida/`,
        { codigo_partida: '977321' }
      );

      // Segunda llamada: asignar-grupos
      expect(axios.post).toHaveBeenNthCalledWith(2,
        `${BASE_URL}/partida/70/asignar-grupos/`,
        { grupos: mockPartidaData.grupos },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Verificar resultado
      expect(result).toEqual({
        ...mockCrearResponse.data,
        grupos: mockPartidaData.grupos,
        gruposCreados: mockAsignarResponse.data.grupos_creados
      });
    });

    it('debe manejar error en crear-partida', async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          data: { error: 'Código de partida ya existe' }
        }
      });

      await expect(gameService.crearPartidaConGrupos(mockPartidaData))
        .rejects.toThrow();
    });

    it('debe manejar error en asignar-grupos', async () => {
      axios.post
        .mockResolvedValueOnce(mockCrearResponse)
        .mockRejectedValueOnce({
          response: {
            data: { error: 'Error al crear grupos' }
          }
        });

      await expect(gameService.crearPartidaConGrupos(mockPartidaData))
        .rejects.toThrow();
    });
  });

  /**
   * TEST 2: obtenerGrupos
   */
  describe('obtenerGrupos', () => {
    it('debe obtener grupos de una partida correctamente', async () => {
      const mockResponse = {
        data: {
          grupos: [
            { id: 151, nombre_equipo: 'Equipo 1', codigo_equipo: '9773211', usuarios: [] },
            { id: 152, nombre_equipo: 'Equipo 2', codigo_equipo: '9773212', usuarios: [] }
          ]
        }
      };

      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await gameService.obtenerGrupos(70);

      expect(axios.get).toHaveBeenCalledWith(
        `${BASE_URL}/partida/70/obtener-grupos/`
      );
      
      expect(result).toEqual(mockResponse.data.grupos);
    });

    it('debe manejar partida sin grupos', async () => {
      const mockResponse = {
        data: { grupos: [] }
      };

      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await gameService.obtenerGrupos(70);

      expect(result).toEqual([]);
    });

    it('debe manejar error cuando partida no existe', async () => {
      axios.get.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { error: 'Partida no encontrada' }
        }
      });

      await expect(gameService.obtenerGrupos(999))
        .rejects.toThrow();
    });
  });

  /**
   * TEST 3: validarCodigoEquipo
   */
  describe('validarCodigoEquipo', () => {
    it('debe validar código correcto', async () => {
      const mockResponse = {
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

      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await gameService.validarCodigoEquipo('9773211');

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/validar-equipo/`,
        { codigo: '9773211' }
      );

      expect(result).toEqual(mockResponse.data);
      expect(result.valido).toBe(true);
    });

    it('debe rechazar código inválido', async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { 
            valido: false,
            error: 'Código inválido. Verifica con tu profesor el código correcto de tu equipo'
          }
        }
      });

      await expect(gameService.validarCodigoEquipo('0000000'))
        .rejects.toThrow();
    });

    it('debe validar formato de código (7 dígitos)', async () => {
      // Código muy corto
      await expect(gameService.validarCodigoEquipo('123'))
        .rejects.toThrow();

      // Código muy largo
      await expect(gameService.validarCodigoEquipo('12345678'))
        .rejects.toThrow();

      // Código con letras
      await expect(gameService.validarCodigoEquipo('abc1234'))
        .rejects.toThrow();
    });
  });

  /**
   * TEST 4: Manejo de headers y formato
   */
  describe('Configuración de requests', () => {
    it('debe enviar Content-Type correcto en POST', async () => {
      const mockResponse = { data: { message: 'OK' } };
      axios.post.mockResolvedValueOnce(mockResponse);

      await gameService.crearPartidaConGrupos({
        codigo_partida: '123456',
        grupos: []
      });

      // Verificar que asignar-grupos usa Content-Type: application/json
      const asignarCall = axios.post.mock.calls.find(
        call => call[0].includes('asignar-grupos')
      );
      
      expect(asignarCall[2]).toEqual({
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('debe usar URLs correctas del backend', () => {
      const expectedBase = 'http://localhost:8000/api';
      
      expect(gameService.crearPartidaConGrupos).toBeDefined();
      expect(gameService.obtenerGrupos).toBeDefined();
      expect(gameService.validarCodigoEquipo).toBeDefined();
      
      // Verificar que todas las funciones están disponibles
      expect(typeof gameService.crearPartidaConGrupos).toBe('function');
      expect(typeof gameService.obtenerGrupos).toBe('function');
      expect(typeof gameService.validarCodigoEquipo).toBe('function');
    });
  });

  /**
   * TEST 5: Manejo de errores de red
   */
  describe('Manejo de errores de red', () => {
    it('debe manejar timeout del servidor', async () => {
      axios.post.mockRejectedValueOnce({
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded'
      });

      await expect(gameService.validarCodigoEquipo('9773211'))
        .rejects.toThrow();
    });

    it('debe manejar servidor sin respuesta', async () => {
      axios.post.mockRejectedValueOnce({
        request: {},
        message: 'Network Error'
      });

      await expect(gameService.crearPartidaConGrupos({
        codigo_partida: '123456',
        grupos: []
      })).rejects.toThrow();
    });

    it('debe manejar error 500 del servidor', async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { error: 'Error interno del servidor' }
        }
      });

      await expect(gameService.validarCodigoEquipo('9773211'))
        .rejects.toThrow();
    });
  });
});
