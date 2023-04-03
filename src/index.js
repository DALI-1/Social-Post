import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer} from 'react-toastify';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
import {GlobalContext} from "./context/Context"
import chakraTheme from '@chakra-ui/theme'

const { Button } = chakraTheme.components
const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = extendBaseTheme({
  components: {
    Button,
  },
})


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
    <ChakraBaseProvider theme={theme}>
    <App/>
    </ChakraBaseProvider>
   
  
    </GlobalContext>
    
    
    
    <footer>
  {/*<FooterComp/>*/}
</footer>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
