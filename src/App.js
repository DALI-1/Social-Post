
import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import LoginPage from './views/Authentification/Sign_In';
import RegisterPage from './views/Authentification/Sign_up';
import IndexPage from './views/PageLayout/PageLayout';
import ChangePW from './views/Authentification/ChangePassword';
import React from 'react';


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
