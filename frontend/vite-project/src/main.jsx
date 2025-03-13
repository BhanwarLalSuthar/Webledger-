import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "react-redux";
import { store } from "./store_slices/store.js"; 
import App from './App.jsx'
import Footer from './components/Footer';
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <GoogleOAuthProvider clientId="891546227503-ufun2k9ddi6qjpm5kkslm2pvlqs32eqb.apps.googleusercontent.com">
        <App />
        <Footer />
      </GoogleOAuthProvider>
    </Provider>
  
)
