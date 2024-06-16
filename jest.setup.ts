import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mocking ResizeObserver
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
