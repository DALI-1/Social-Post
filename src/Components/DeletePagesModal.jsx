import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Form from 'react-bootstrap/Form';
import {AppContext} from "../context/Context"
import {CALL_API_With_JWTToken} from "../libs/APIAccessAndVerification"
import * as variables from "../variables/variables"
import { ToastContainer, toast } from 'react-toastify';
import { Avatar } from "@nextui-org/react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import SelectFacebookPagesModal from "./FacebookComps/SelectFacebookPagesModal"
export default function PagesDialog(props) {
   
    const {GlobalState,Dispatch}=React.useContext(AppContext)
    const handleClose = () => {
      //Setting the list of selected pages to empty
      variables.Pages.ListOfSelectedPages=[]
      props.SetShowDeleteModal(false)
    };

    const handleDelete=()=>
    {
      if(GlobalState.SelectedGroup.group_Name!="Loading...") 
      {
      let JsonObject={"listOfPagesToDelete":[],"groupID": GlobalState.SelectedGroup.id}
      variables.Pages.ListOfSelectedPages.map((page)=>{
       
        JsonObject.listOfPagesToDelete=[...JsonObject.listOfPagesToDelete,{"pageID":page.ID}]
      })
      
      let JsonObjectToSend=JSON.stringify(JsonObject)    
      let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_DELETEPAGES
      let UserToken=window.localStorage.getItem("AuthToken")
      let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
      Dispatch({type:variables.HeaderSpinnerActions.TurnOnRequestSpinner})
      
      APIResult.then((result)=>
      {
              
               
               variables.Pages.ListOfSelectedPages=[]
               if(result.successCode=='Pages_Deleted')
               {
                toast.success('The Selected Pages Deleted Successfully', {
                  position: "bottom-left",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  });


                  Dispatch({type:variables.HeaderSpinnerActions.TurnOffRequestSpinner})  
                  Dispatch({type:variables.PageTabActions.SelectManagePage}) 
                  Dispatch({type:variables.RerenderActions.ReRenderPage}) 
                  //Setting the list of selected pages to null after the delete
                  variables.Pages.ListOfSelectedPages=[]
                  handleClose()
               }
               
                
                                     
      })
      .catch((e)=>{

        console.log(e)
      })
    }
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
          Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">
             Are you sure you want to delete the selected Pages?
            </DialogContentText>
   <div sx={{ display: "flex",justifyContent: "center", alignItems: "center",}}>
   <Container className="d-flex justify-content-center align-items-center" > 
   <Row><ol>{variables.Pages.ListOfSelectedPages.map((page)=>{return(<li>{page.name}</li>)})} </ol></Row>
   </Container></div>           
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose} autoFocus>Cancel</Button>  
            <Button  variant="outlined" color="error"  onClick={handleDelete} >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }