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

  let FacebookLoginRefButton=React.useRef();
  const responseFacebook = (response) => {
    console.log(response)
    setIsLoggedIn(true);
    variables.FacebookUser.LoggedFacebookUserInfo=response
fetch(`https://graph.facebook.com/v16.0/me/accounts?fields=id,name,instagram_business_account,access_token&access_token=${response.accessToken}`)
.then(response => response.json())
.then(data =>
{
  variables.Pages.FBSelectPagesList=data
  console.log(data)
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
      console.log(props)
      props.SetSelectFBPageModalFlag(false)
    };
  

    const handleAddPage=()=>
    {
       var JsonObject={
  "groupID": "",
  "ownerFBid": "",
  "OwnerFB_shortLivedToken": "",
  "listOfPages": []
  
       }
      var listOfPages=[]
     
      //Checking which Page is selected
      variables.Pages.FBSelectPagesList.data.map((Page)=>{
       var checkbox=document.getElementById("NewPage"+Page.id)
      console.log(checkbox)
       if(checkbox.checked)
       { 
        if(Page.instagram_business_account==undefined)
        {listOfPages=[...listOfPages,{pageID:checkbox.id.replace("NewPage",""),Page_shortLivedToken:Page.access_token,listOfUsersRelatedToThePage:[]}]}
        else
        {
          listOfPages=[...listOfPages,{pageID:checkbox.id.replace("NewPage",""),Page_shortLivedToken:Page.access_token,listOfUsersRelatedToThePage:[ {platformUserID: Page.instagram_business_account.id}]}]
        }
       }
        
      })
    JsonObject.groupID=GlobalState.SelectedGroup.id
    JsonObject.ownerFBid=variables.FacebookUser.LoggedFacebookUserInfo.userID
    JsonObject.OwnerFB_shortLivedToken=variables.FacebookUser.LoggedFacebookUserInfo.accessToken
    JsonObject.listOfPages=listOfPages  
    let JsonObjectToSend=JSON.stringify(JsonObject)
      let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_ADDPAGE
      let UserToken=window.localStorage.getItem("AuthToken")
      let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
      Dispatch({type:variables.HeaderSpinnerActions.TurnOnRequestSpinner})
      
      APIResult.then((result)=>
      {
                if(result.successCode=="Page_Added")           
                toast.success(result.result, {
                  position: "bottom-left",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  });                                       
                                  
      })
      .catch((e)=>{

        console.log(e)
      })  
      
      Dispatch({type:variables.HeaderSpinnerActions.TurnOffRequestSpinner})
      handleClose()
    }
   
    return (
      <>
             <FacebookLogin  
        appId="959797981855736"
        autoLoad={true}
        fields="instagram_basic,pages_show_list,email,pages_manage_posts"
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