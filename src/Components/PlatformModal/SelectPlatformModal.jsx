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
import { Avatar } from "@nextui-org/react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
export default function PagesDialog(props) {
   
    const {GlobalState,Dispatch}=React.useContext(AppContext)
   const [PlatformsLoadFlag,SetPlatformsLoadedFlag]=React.useState(false)
   const [ListOfPlatforms,SetListOfPlatforms]=React.useState([])
    const handleClose = () => {
      props.SetSelectPageModalFlag(false)
    };

    React.useEffect(()=>
    {

      let JsonObjectToSend=JSON.stringify({})
      let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETAPPPLATFORMS
      let UserToken=window.localStorage.getItem("AuthToken")
      let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
      Dispatch({type:variables.HeaderSpinnerActions.TurnOnRequestSpinner})
      
      APIResult.then((result)=>
      {
               SetListOfPlatforms(result.result)
                
               SetPlatformsLoadedFlag(true)   
               console.log(result)
               Dispatch({type:variables.HeaderSpinnerActions.TurnOffRequestSpinner})                          
      })
      .catch((e)=>{

        console.log(e)
      })  
    },[])

    return (
      <>
        
        <Dialog
          open={true}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Platform Select
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">
                Welcome
               Please Select the platform you want to load your pages from
            </DialogContentText>
   <div sx={{
  display: "flex",
 
  justifyContent: "center",
  alignItems: "center",

   }}>
   {PlatformsLoadFlag?<Container><Row>{

      
ListOfPlatforms.map((platform)=>
{
  
  return(<Col>
     <Avatar
                 size="xl"
                 src={platform.platformLogoImageUrl
                 }
                 color="primary"
                 bordered
                
                  zoomed
                  
               />
               {platform.platformName}
  </Col>)
})
}</Row></Container>:<></>}
      
   </div>
     
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            
          </DialogActions>
        </Dialog>
      </>
    );
  }