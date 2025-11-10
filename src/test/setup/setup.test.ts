import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('Test Environment Setup', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to DOM matchers', () => {
    const element = document.createElement('div');
    element.textContent = 'Hello Test';
    expect(element).toHaveTextContent('Hello Test');
  });
});