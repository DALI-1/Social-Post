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
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import './SubSecurityContent.css';
import MainCard from "../../components/UI/cards/MainCard"
import LockResetIcon from '@mui/icons-material/LockReset';
export default function Content() {
  let NewPassword=React.useRef()
  let NewPasswordC=React.useRef()
  let OldPassword=React.useRef()

    const HandleSub=(props)=>{
        props.preventDefault()
     
       if(NewPassword.current.value==NewPassword.current.value)
       {
        
        if(NewPassword.current.value.toString().length>6)
        {
       
        //Converting Form Data to a Json object
        let JsonObject
        let JsonString="{"
        for(let i=0;i<3;i++)
          {
            
            if(i==0)
            JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\","
            if(i==1)
            JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\"}"
    
          }
    
         
       JsonObject=JSON.parse(JSON.stringify(JsonString))
       //Sending a POST HTTP To the API with the Json Object
       let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CHANGEPW
       let UserToken=window.localStorage.getItem("AuthToken")
       let APIResult=CALL_API_With_JWTToken(url,JsonObject,UserToken)
       APIResult.then((result)=>{
        for( var property in result)
                {
                    if( property=="PasswordChanged")
                    {
                        toast.success('The Password Changed Successfully!', {
                            position: "bottom-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            }); 
                    }
                    if( property=="OldPasswordIsWrong")
                    {
                        toast.error('The Password you entered is wrong, please try again', {
                            position: "bottom-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            }); 
                    }
                }

       })
      }
      else
      {
        toast.info('The password should be at least 6 characters!', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        
      }
     }
    else
    {
        toast.info('The Confirm password and Password dont match', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        
    }
    }
  return (
    
      
        <div className="row">
            <div className="col-lg-8">
            
                <MainCard class="card mb-4">
                    <div className='m-2'>Change Password</div>
                    <div className="card-body">
                        <form onSubmit={HandleSub}>
                            
                            <div className="mb-3">
                                <label className="small mb-1" htmlFor="currentPassword">Current Password</label>
                                <input ref={OldPassword} className="form-control" id="currentPassword" type="password" name="cPassword" placeholder="Enter current password" required/>
                            </div>
                            
                            <div className="mb-3">
                                <label className="small mb-1" htmlFor="newPassword">New Password</label>
                                <input ref={NewPassword} className="form-control" id="newPassword" name="nPassword" type="password" placeholder="Enter new password"/>
                            </div>
                            
                            <div className="mb-3">
                                <label className="small mb-1" htmlFor="confirmPassword">Confirm Password</label>
                                <input ref={NewPasswordC} className="form-control" id="confirmPassword" name="nPasswordC" type="password" placeholder="Confirm new password"/>
                            </div>
                            <div className="d-flex justify-content-center">
<Button variant="outlined" color='primary' type="submit" startIcon={<LockResetIcon />}>Change Password </Button>
</div>
                        </form>
                    </div>
                </MainCard>
                
                <MainCard class="card mb-4">
                    <div className='m-2'>Security Preferences</div>
                    <div className="card-body">
                       
                        <h5 className="mb-1">Account Privacy</h5>
                        <p className="small text-muted">By setting your account to private, your profile information and posts will not be visible to users outside of your user groups.</p>
                        <form>
                            <div className="form-check">
                                <input className="form-check-input" id="radioPrivacy1" type="radio" name="radioPrivacy" />
                                <label className="form-check-label" htmlFor="radioPrivacy1">Public (posts are available to all users)</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" id="radioPrivacy2" type="radio" name="radioPrivacy"/>
                                <label className="form-check-label" htmlFor="radioPrivacy2">Private (posts are available to only users in your groups)</label>
                            </div>
                        </form>
                        <hr className="my-4"/>
                       
                        <h5 className="mb-1">Data Sharing</h5>
                        <p className="small text-muted">Sharing usage data can help us to improve our products and better serve our users as they navigation through our application. When you agree to share usage data with us, crash reports and usage analytics will be automatically sent to our development team for investigation.</p>
                        <form>
                            <div className="form-check">
                                <input className="form-check-input" id="radioUsage1" type="radio" name="radioUsage" />
                                <label className="form-check-label" htmlFor="radioUsage1">Yes, share data and crash reports with app developers</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" id="radioUsage2" type="radio" name="radioUsage"/>
                                <label className="form-check-label" htmlFor="radioUsage2">No, limit my data sharing with app developers</label>
                            </div>
                        </form>
                    </div>
                </MainCard>
            </div>
            <div className="col-lg-4">
                
                <MainCard class="card mb-4">
                    <div className='m-2'>Two-Factor Authentication</div>
                    <div className="card-body">
                        <p>Add another level of security to your account by enabling two-factor authentication. We will send you a text message to verify your login attempts on unrecognized devices and browsers.</p>
                        <form>
                            <div className="form-check">
                                <input className="form-check-input" id="twoFactorOn" type="radio" name="twoFactor" />
                                <label className="form-check-label" htmlFor="twoFactorOn">On</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" id="twoFactorOff" type="radio" name="twoFactor"/>
                                <label className="form-check-label" htmlFor="twoFactorOff">Off</label>
                            </div>
                            <div className="mt-3">
                                <label className="small mb-1" htmlFor="twoFactorSMS">SMS Number</label>
                                <input className="form-control" id="twoFactorSMS" type="tel" placeholder="Enter a phone number" />
                            </div>
                        </form>
                    </div>
                </MainCard>
              
                <MainCard class="card mb-4">
                    <div className='m-2'>Delete Account</div>
                    <div className="card-body">
                        <p>Deleting your account is a permanent action and cannot be undone. If you are sure you want to delete your account, select the button below.</p>
                        <button className="btn btn-danger-soft text-danger" type="button">I understand, delete my account</button>
                    </div>
                </MainCard>
            </div>
        </div>
    
    
  );
}