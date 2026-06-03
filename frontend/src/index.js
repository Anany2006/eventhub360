import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux'; // Handles data injection mapping
import store from './store';             // Connects the store configuration

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Injecting global Redux data stream context across your full React interface tree */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);