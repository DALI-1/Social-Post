import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ModifyUserContent.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import { MDBFile } from 'mdb-react-ui-kit';
import {storage} from '../../libs/FireBase'
import {getDownloadURL,ref, uploadBytesResumable,deleteObject} from 'firebase/storage'
import {hashString,hashRandom } from 'react-hash-string'
import ProgressBar from 'react-bootstrap/ProgressBar';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import {APIStatus,APIStatuses}  from '../../variables/variables';
import { Avatar } from "@nextui-org/react";
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)
    let OriginalUserinfo=React.useRef()
    let Username=React.useRef()
    let FirstName=React.useRef()
    let LastName=React.useRef()
    let Age=React.useRef()
    let PhoneNumber=React.useRef()
    let Email=React.useRef()
    let UserProfilePicture= React.useRef();
    let uploadTask=React.useRef(null)
    const [UploadProgress,setUploadProgress]=React.useState(0)

   
  
    const handlesubmit=(props)=>
    {
      props.preventDefault()
      
     
      
 
    
}
  return (
    
     
       
        
           
            <div className="card mb-4 ">
                <div className="card-header">Account Details</div>
                <div className="card-body">
                    <form onSubmit={handlesubmit}>
                      
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="inputUsername">Username (how your name will appear to other users on the site)</label>
                            <input ref={Username} className="form-control" name="userName" id="inputUsername" type="text" placeholder="Enter your username" />
                        </div>
                       
                        <div className="row gx-3 mb-3">
                        
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputFirstName">First name</label>
                                <input ref={FirstName} className="form-control" name="firstName" id="inputFirstName" type="text" placeholder="Enter your first name" />
                            </div>
                           
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputLastName">Last name</label>
                                <input ref={LastName} className="form-control" name="lastName" id="inputLastName" type="text" placeholder="Enter your last name" />
                            </div>
                        </div>

                        
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="inputEmailAddress">Email address</label>
                            <input ref={Email} className="form-control" name="email" id="inputEmailAddress" type="email" placeholder="Enter your email address" />
                        </div>
                        
                        <div className="row gx-3 mb-3">
                            
                        <div className="col-md-6 ">
                                <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                                <input ref={PhoneNumber} className="form-control" name="phoneNumber" id="inputPhone" type="tel" placeholder="Enter your phone number" />
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputPhone">Age</label>
                                <input ref={Age} className="form-control" name="age" id="age" type="number" placeholder="Enter your age" />
                            </div>
                            
                        </div>
                        
                        <input type="submit" value="Save Changes" className="btn btn-primary"/>
                    </form>
                </div>
            </div>
        
   
      
  );
}