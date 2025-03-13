import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store_slices/store.js'; // Ensure this path is correct
import AppRoutes from './App.jsx'; // Rename to AppRoutes if that's the component name
import Footer from './components/Footer';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="891546227503-ufun2k9ddi6qjpm5kkslm2pvlqs32eqb.apps.googleusercontent.com">
        <AppRoutes />
        <Footer />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);