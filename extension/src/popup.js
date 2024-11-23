import React from 'react';
import { createRoot } from 'react-dom/client';
import PopupView from './components/PopupView';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<PopupView />);