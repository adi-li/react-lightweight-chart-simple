import 'react-app-polyfill/ie11';
import './styles.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { App } from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLDivElement,
);
root.render(<App />);
