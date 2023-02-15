import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import LoginPage from './Views/Authentification/Sign_In';
import RegisterPage from './Views/Authentification/Sign_up';
import Dashboard from './Views/DashboardPage/Dashboard';
function App() {
  return (
    <Router>
       
    <Routes>
    <Route exact path="/Login" element={<LoginPage/>}/>
    <Route exact path="/Register" element={<RegisterPage/>}/>
    <Route exact path="/index" element={<Dashboard/>}/>
     </Routes>
   
 </Router>
  );
}

export default App;
