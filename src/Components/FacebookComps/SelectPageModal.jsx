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

export default function PagesDialog(props) {
   
    const {GlobalState,Dispatch}=React.useContext(AppContext)

    let ListOfPages=props.data

    
   
    
    const handleClose = () => {
      props.SetSelectPageModalFlag(false)
    };
  

    const handleAddPage=()=>
    {
       var JsonObject={
  "groupID": "",
  "ownerFBid": "",
  "ownerFBfirst_name": "",
  "ownerFBlast_name": "",
  "ownerFBemail": "",
  "ownerFBImageUrl": "",
  "OwnerFB_shortLivedToken": "",
  "listOfPages": []
  
       }
      var listOfPages=[]
     
      //Checking which Page is selected
      props.data.data.map((Page)=>{
       var checkbox=document.getElementById(Page.id)
       if(checkbox.checked)
       { 
        listOfPages=[...listOfPages,{pageID:checkbox.id,Page_shortLivedToken:Page.access_token}]
       }
        
      })
    JsonObject.groupID=GlobalState.SelectedGroup.id
    JsonObject.ownerFBfirst_name=variables.FacebookUser.LoggedFacebookUserInfo.first_name
    JsonObject.ownerFBlast_name=variables.FacebookUser.LoggedFacebookUserInfo.last_name
    JsonObject.ownerFBemail=variables.FacebookUser.LoggedFacebookUserInfo.email
    JsonObject.ownerFBid=variables.FacebookUser.LoggedFacebookUserInfo.id
    JsonObject.ownerFBImageUrl=variables.FacebookUser.LoggedFacebookUserInfo.picture.data.url
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
        
        <Dialog
          open={true}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Select Page
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">


                Welcome

               Please Select the facebook pages you want to add to the group
            </DialogContentText>
   
     {
      props.data.data.map((Page,index)=>{

            

        return (
          <Form.Check
          id={Page.id}           
          key={Page.id}     
          type="switch"
          defaultChecked={false}
          autoComplete="off"
          autoSave="off"
          label={Page.name}
         
          />
        )
      })
     }
            
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" color="error" onClick={handleAddPage} autoFocus>
              Add Pages
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }