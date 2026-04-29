import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './components/App';

const setup = import.meta.env.MODE === 'mock'
    ? import('./setup-mocks')
    : import('./setup-full');

setup.then(({ store, actions }) => {
    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(React.createElement(App, { store, actions }));
});
