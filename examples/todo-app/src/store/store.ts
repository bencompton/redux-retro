import { createAppStore } from './createAppStore';

/**
 * The Redux store for the real app.
 * For the mock-persistence variant, see main.mock.tsx.
 * In tests, use createAppStore() directly.
 */
export const store = createAppStore();

