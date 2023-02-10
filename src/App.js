import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import LoginPage from './Authentification/Sign_In';
import RegisterPage from './Authentification/Sign_up';
function App() {
  return (
    <Router>
       
    <Routes>
    <Route exact path="/Login" element={<LoginPage/>}/>
    <Route exact path="/Register" element={<RegisterPage/>}/>
    <Route exact path="/" element={<LoginPage/>}/>
     </Routes>
   
 </Router>
  );
}

export default App;
