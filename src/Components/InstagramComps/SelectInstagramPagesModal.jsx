import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Form from 'react-bootstrap/Form';
import {AppContext} from "../../context/Context"
import {CALL_API_With_JWTToken} from "../../libs/APIAccessAndVerification"
import * as variables from "../../variables/variables"
import { ToastContainer, toast } from 'react-toastify';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useEffect } from 'react';

export default function PagesDialog(props) {
   
 let [PagesLoadedFlag,SetPagesLoadedFlag]=React.useState(false)
 const [isLoggedIn, setIsLoggedIn] = React.useState(false);
 const [ isSdkLoaded, SetisSdkLoaded] = React.useState(false);
 const {GlobalState,Dispatch}=React.useContext(AppContext)
  let FacebookLoginRefButton=React.useRef();
  const [pages, setPages] = useState([]);

    const handleClose = () => {
      props.SelectINSTAPageModalFlag(false)
    };
    const responseFacebook = (response) => {
      setIsLoggedIn(true);
      variables.FacebookUser.LoggedFacebookUserInfo=response
      getInstagramPages(response.accessToken).then(()=>{
        SetPagesLoadedFlag(true)
      })
    }
  
    const onFailure = () => {
      console.log("Failed to connect to Facebook");
    };

    const getInstagramPages = async (access_token) => {
      try {
        console.log(access_token)
        // call to the Facebook Graph API to retrieve user's Pages with fields `instagram_business_account'
        const response = await fetch(`https://graph.facebook.com/v11.0/me/accounts?fields=name,id,instagram_business_account&access_token=${access_token}`);
        const data = await response.json();
        console.log(data.data)
        let ListOfPagesWithInstaBusinessAcounts=[]
        
        data.data.map((page)=>{
           if(page.instagram_business_account!=undefined)
           ListOfPagesWithInstaBusinessAcounts=[...ListOfPagesWithInstaBusinessAcounts,page]
        })

        setPages(ListOfPagesWithInstaBusinessAcounts);
      } catch (error) {
        console.log(error.message);
      }
    };


    useEffect(()=>{ 
      //if the FB SDK IS LOADED AND RENDERED, LAUNCH THE PAGES FETCH
      if(isSdkLoaded==true)
      FacebookLoginRefButton.current.click()
    },[isSdkLoaded])

    return (
      <>
            
        <Dialog
          open={true}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
           Business Instagram Pages Selection
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">      
                Welcome 
               Please Select the business Instagram  pages you want to add to the group
            </DialogContentText>

            <FacebookLogin  
        appId="959797981855736"
        autoLoad={false}
        fields="birthday,first_name,last_name,id,email,picture"
        callback={responseFacebook} 
        onFailure={onFailure}
        render={renderProps => {
          if(renderProps.isSdkLoaded==false)
          {
           SetisSdkLoaded(true)
          }
          return (
            <button ref={FacebookLoginRefButton} onClick={renderProps.onClick}> </button> 
          )
      }}
      /> 

{!PagesLoadedFlag&&<p> Loading your facebook pages instagram business accounts...</p>}
{PagesLoadedFlag&&
      pages.map((Page,index)=>{
        return (
          <Form.Check  id={"FBPage"+Page.id}  key={"FBPage"+Page.id} type="switch" defaultChecked={false}  autoComplete="off" autoSave="off" label={"FB PAGE"+Page.name+"Connected to the instagram account ID"+Page.instagram_business_account.id
        }/> )})}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button  variant="outlined" color="error"  autoFocus>
              Add Pages
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }