// Setup file para configurar el ambiente de testing
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills para Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock de fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  })
);

// Configurar timeouts para tests
jest.setTimeout(10000);

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
