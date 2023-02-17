import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import LoginPage from './Views/Authentification/Sign_In';
import RegisterPage from './Views/Authentification/Sign_up';
import Dashboard from './Views/DashboardPage/Dashboard';
import ChangePW from './Views/Authentification/ChangePassword';
import PasswordRecovery from './Views/Authentification/PasswordRecovery.jsx';
function App() {
  return (
    <Router>
       
    <Routes>
    <Route exact path="/Login" element={<LoginPage/>}/>
    <Route exact path="/Register" element={<RegisterPage/>}/>
    <Route exact path="/index" element={<Dashboard/>}/>
    <Route exact path="/ChangePassword" element={<ChangePW/>}/>
     </Routes>
   
 </Router>
  );
}

export default App;
