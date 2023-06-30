import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import "antd/dist/reset.css";
import "./tailwind.css";
import "./global.css";
import { inject } from '@vercel/analytics';
 
inject();

// eslint-disable-next-line 
import i18n from './locales/i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

