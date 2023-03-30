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
import { Pages } from '@mui/icons-material';

export default function PagesDialog(props) {
   
 let [PagesLoadedFlag,SetPagesLoadedFlag]=React.useState(false)
 const [isLoggedIn, setIsLoggedIn] = React.useState(false);
 const [ isSdkLoaded, SetisSdkLoaded] = React.useState(false);

  let FacebookLoginRefButton=React.useRef();
  const responseFacebook = (response) => {
    setIsLoggedIn(true);
    variables.FacebookUser.LoggedFacebookUserInfo=response
    console.log(response)
fetch(`https://graph.facebook.com/v16.0/me/accounts?fields=name,id,instagram_business_account{name,id},access_token&&access_token=${response.accessToken}`)
.then(response => response.json())
.then(data =>
{
  variables.Pages.FBSelectPagesList=data

  SetPagesLoadedFlag(true)
 
}
)
.catch(error => console.error(error));

  }

  const onFailure = () => {

   
    console.log("Failed to connect to Facebook");
  };

  useEffect(()=>{ 
    //if the FB SDK IS LOADED AND RENDERED, LAUNCH THE PAGES FETCH
    if(isSdkLoaded==true)
    FacebookLoginRefButton.current.click()
  },[isSdkLoaded])
    const {GlobalState,Dispatch}=React.useContext(AppContext)
    let ListOfPages=props.data
    const handleClose = () => {
  
      props.SetSelectFBPageModalFlag(false)
    };
  

    const handleAddPage=()=>
    {
      var List_Of_FacebookPages_With_Possible_BusinessAccounts=[]
      var Selected_FB_Pages=[]
      //Checking which Page is selected
      
      variables.Pages.FBSelectPagesList.data.map((Page)=>{
       var checkbox=document.getElementById("NewPage"+Page.id)

       if(checkbox.checked)
       { 
        //Creating the list of potentional pages to add
        Selected_FB_Pages=[...Selected_FB_Pages,Page]

        if(Page.instagram_business_account!=undefined)
        {
          List_Of_FacebookPages_With_Possible_BusinessAccounts=[...List_Of_FacebookPages_With_Possible_BusinessAccounts,Page]
        }
       }
       
      })
      //Just updating the selected pages
      variables.Pages.FBSelectedPagesList=Selected_FB_Pages
      //Here I'm updating the value with facebook pages with a possible business accounts so that the optional pop up knows if it should show or not based on the length
      props.SetFBINPages(List_Of_FacebookPages_With_Possible_BusinessAccounts)
      
  if(Selected_FB_Pages.length>0)
  {
    if(List_Of_FacebookPages_With_Possible_BusinessAccounts.length==0)
    {
      handleClose()
      props.handleAddINPages()
    }
    else
    {
      props.SetShowFBINChoiceModal(true)
    }

    
  }
  else
  {
    toast.info('You need to select at least one page', {
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
      <>
             <FacebookLogin  
        appId="959797981855736"
        autoLoad={true}
        fields="birthday,first_name,last_name,id,email,picture"
        scope="email,
        pages_manage_cta,
        pages_show_list,
        instagram_basic,
        instagram_manage_comments,
        instagram_manage_insights,
        instagram_content_publish,
        instagram_manage_messages,
        pages_read_engagement,
        pages_manage_metadata,
        pages_manage_posts,
        public_profile"
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
        <Dialog
          open={true}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
           
          PaperProps={{
            style: { 
              margin: '80px auto', // adjust margin to change vertical position

             top:"-10rem"
            }}}
        >
          <DialogTitle id="alert-dialog-title">
           Facebook Pages Selection
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">
                Welcome 
               Please Select the facebook pages you want to add to the group
            </DialogContentText>
     {!PagesLoadedFlag&&<p>Loading your facebook pages...</p>}
     {PagesLoadedFlag&&
      variables.Pages.FBSelectPagesList.data.map((Page,index)=>{
        return (
          <Form.Check  id={"NewPage"+Page.id}  key={"NewPage"+Page.id} type="switch" defaultChecked={false}  autoComplete="off" autoSave="off" label={Page.name}/> )})}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button  variant="outlined" color="error" onClick={handleAddPage} autoFocus>
              Add Pages
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }