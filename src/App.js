
import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import LoginPage from './Views/Authentification/Sign_In';
import RegisterPage from './Views/Authentification/Sign_up';
import IndexPage from './Views/PageLayout/PageLayout';
import ChangePW from './Views/Authentification/ChangePassword';

//scheduler styles
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";

function App() {
  return (
    <Router>
       

    <Routes>
    <Route exact path="/Login" element={<LoginPage/>}/>
    <Route exact path="/Register" element={<RegisterPage/>}/>
    <Route exact path="/index" element={<IndexPage/>}/>
    <Route exact path="/ChangePassword" element={<ChangePW/>}/>
    
    <Route exact path="/" element={<LoginPage/>}/>
     </Routes>
   
 </Router>
  );
}

export default App;
