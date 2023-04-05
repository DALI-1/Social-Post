
import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import LoginPage from './Views/Authentification/Sign_In';
import RegisterPage from './Views/Authentification/Sign_up';
import IndexPage from './Views/PageLayout/PageLayout';
import ChangePW from './Views/Authentification/ChangePassword';
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
