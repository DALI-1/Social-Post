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
import { useToast } from '@chakra-ui/react'
import './SubProfileContent.css';
import {CALL_API_With_JWTToken} from '../../libs/APIAccessAndVerification'
export default function Content() {

    let APIError = React.useRef(false);
    const toast = useToast()
    const UpdateAPIError=(error)=>
  {
    
    if(error==true)
    APIError.current=true
    else
    APIError.current=false
  }
    const handlesubmit=(props)=>
    {
      props.preventDefault()
      
     
      //Converting Form Data to a Json object
      let JsonObject
      let JsonString="{"
      for(let i=0;i<6;i++)
        {
          
          if(i!=5)
          JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\","
          else
          JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\"}"
  
        }
  
        
     JsonObject=JSON.parse(JSON.stringify(JsonString))
     //Sending a POST HTTP To the API with the Json Object
     let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CHANGEPERSONALINFO
     let UserToken=window.localStorage.getItem("AuthToken")
     let APIResult=CALL_API_With_JWTToken(url,JsonObject,UserToken,UpdateAPIError)
    
     APIResult.then(result=>{
        for( var property in result)
        {
          if( property=="UserInfoUpdated")
          {
            
            toast({
                title: 'Account created.',
                description: "We've created your account for you.",
                status: 'success',
                duration: 9000,
                isClosable: true,
              })
          }

        }  
    })
}
  return (
    
      <div className="container-xl px-4 mt-4">
   
    
    
    <div className="row">
        <div className="col-xl-4">
            
            <div className="card mb-4 mb-xl-0">
                <div className="card-header">Profile Picture</div>
                <div className="card-body text-center">
                    
                    <img className="img-account-profile rounded-circle mb-2" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt=""/>
                    
                    <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                    
                    <button className="btn btn-primary" type="button">Upload new image</button>
                </div>
            </div>
        </div>
        <div className="col-xl-8">
           
            <div className="card mb-4">
                <div className="card-header">Account Details</div>
                <div className="card-body">
                    <form onSubmit={handlesubmit}>
                      
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="inputUsername">Username (how your name will appear to other users on the site)</label>
                            <input className="form-control" name="userName" id="inputUsername" type="text" placeholder="Enter your username" />
                        </div>
                       
                        <div className="row gx-3 mb-3">
                        
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputFirstName">First name</label>
                                <input className="form-control" name="firstName" id="inputFirstName" type="text" placeholder="Enter your first name" />
                            </div>
                           
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputLastName">Last name</label>
                                <input className="form-control" name="lastName" id="inputLastName" type="text" placeholder="Enter your last name" />
                            </div>
                        </div>
                       
                        {/*<div className="row gx-3 mb-3">
                           
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputOrgName">Organization name</label>
                                <input className="form-control" id="inputOrgName" type="text" placeholder="Enter your organization name" />
                            </div>
                            
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputLocation">Location</label>
                                <input className="form-control" id="inputLocation" type="text" placeholder="Enter your location" />
                            </div>
                        </div>*/ }
                        
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="inputEmailAddress">Email address</label>
                            <input className="form-control" name="email" id="inputEmailAddress" type="email" placeholder="Enter your email address" />
                        </div>
                        
                        <div className="row gx-3 mb-3">
                            
                        <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                                <input className="form-control" name="phoneNumber" id="inputPhone" type="tel" placeholder="Enter your phone number" />
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputPhone">Age</label>
                                <input className="form-control" name="age" id="inputPhone" type="number" placeholder="Enter your age" />
                            </div>
                            
                        </div>
                        
                        <input type="submit" value="Save Changes" className="btn btn-primary"/>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
      
  );
}