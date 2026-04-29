import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            'redux-retro': new URL('../../packages/redux-retro/src/index.ts', import.meta.url).pathname,
            'react-redux-retro': new URL('../../packages/react-redux-retro/src/index.ts', import.meta.url).pathname
        }
    }
});
