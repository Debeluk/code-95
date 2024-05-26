import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import './main.css';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Raleway:300,400,500,700']
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
