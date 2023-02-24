import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast } from 'react-toastify';
import FooterComp from './Headers/Footer'
import NavComp from './Headers/Navigation'
import {GlobalContext} from "./context/Context"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <> 
    
    
    <header>
    </header>
    <GlobalContext>
    <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
    <App/>
    </GlobalContext>
    
    
    
    <footer>
  <FooterComp/>
</footer>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
