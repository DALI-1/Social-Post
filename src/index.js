import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import '@progress/kendo-theme-default/dist/all.css';
import { ToastContainer} from 'react-toastify';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
import {GlobalContext} from "./context/Context"
import chakraTheme from '@chakra-ui/theme'
import { registerLicense } from '@syncfusion/ej2-base';

//scheduler styles
import "@syncfusion/ej2-base/styles/bootstrap.css";
import "@syncfusion/ej2-buttons/styles/bootstrap.css";
import "@syncfusion/ej2-calendars/styles/bootstrap.css";
import "@syncfusion/ej2-dropdowns/styles/bootstrap.css";
import "@syncfusion/ej2-inputs/styles/bootstrap.css";
import "@syncfusion/ej2-lists/styles/bootstrap.css";
import "@syncfusion/ej2-navigations/styles/bootstrap.css";
import "@syncfusion/ej2-popups/styles/bootstrap.css";
import "@syncfusion/ej2-splitbuttons/styles/bootstrap.css";
import "@syncfusion/ej2-react-schedule/styles/bootstrap.css";
import "@syncfusion/ej2-react-grids/styles/bootstrap.css";
import 'react-toastify/dist/ReactToastify.css';

//this is for the add post splitter
import '@syncfusion/ej2-layouts/styles/bootstrap.css';

const { Button } = chakraTheme.components
const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = extendBaseTheme({
  components: {
    Button,
  },
})
// Registering Syncfusion license key
registerLicense('MTYyNTE0MUAzMjMxMmUzMTJlMzMzNWVXZGhweHVHc0JmbXhsUzA4bHNJNnVrUVh3MG90N1U5Zm43S0szMFpEa009;Mgo+DSMBaFt+QHFqVkNrWE5FdEBAXWFKblZ8R2tTflpgBShNYlxTR3ZbQlhjTHxbd0FgUHhd;Mgo+DSMBMAY9C3t2VFhhQlJBfVtdXGFWfFN0RnNcdVx4flRCcC0sT3RfQF5jTX5WdkBhUX5adHZdRQ==;Mgo+DSMBPh8sVXJ1S0d+X1RPckBDX3xLflF1VWZTfVZ6dVFWESFaRnZdQV1nSXtTc0drWHtadHJW;MTYyNTE0NUAzMjMxMmUzMTJlMzMzNWFnZ1JGZUlUZWZTSUpWQmoySG5ESVhtRlpRVXdkZnZlV0JpUk1YbVdaQUk9;NRAiBiAaIQQuGjN/V0d+XU9Hc1RGQmJLYVF2R2BJelRyfF9HZEwgOX1dQl9gSXpTc0VmW3dfdHBST2M=;ORg4AjUWIQA/Gnt2VFhhQlJBfVtdXGFWfFN0RnNcdVx4flRCcC0sT3RfQF5jTX5WdkBhUX5adH1dRQ==;MTYyNTE0OEAzMjMxMmUzMTJlMzMzNVhpbmlGZFQyajFpS3A5VUZhemVjcWE5ems0N3J5dzI2dm8wZ3NFd3ZTT1U9;MTYyNTE0OUAzMjMxMmUzMTJlMzMzNVdwZGxVejN2ZzluWk95MDl2ajhmRDBGcHJNeThQaEpDN01hWFJ2MWs4TTA9;MTYyNTE1MEAzMjMxMmUzMTJlMzMzNUloSEJZK0pYT09FVkxXQUx3Rk56VDl6VGpqOWxnU2tETDg0ZUFTWjlxRnc9;MTYyNTE1MUAzMjMxMmUzMTJlMzMzNUtnSVc2UHJSR2xMRDlPSVU4RXpIZXlWY1QzcVhzRkN1cVl0dHIxMlhRVFk9;MTYyNTE1MkAzMjMxMmUzMTJlMzMzNWVXZGhweHVHc0JmbXhsUzA4bHNJNnVrUVh3MG90N1U5Zm43S0szMFpEa009');

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
