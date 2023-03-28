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
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});




export default function PagesDialog(props) { 
 const {GlobalState,Dispatch}=React.useContext(AppContext)
  const [pages, setPages] = useState(props.INFBPages);
  const handlePreviousClose = () => {
    props.SelectINSTAPageModalFlag(false)
  };

    const handleClose = () => {
      variables.Pages.INGFBSelectedOptionalPagesList=[]
      props.handleAddINPages() 
      props.SetShowINFBChoiceModal(false)
      handlePreviousClose()
    };
    const handleAddPage=(()=>{
      //This function make a call to add the IN and FB page in case there is optional FB, otherwise the previous modal does.
      //Here we prepare the list of selected optional FB pages
      variables.Pages.INGFBSelectedOptionalPagesList=[]
      pages.map((Page)=>{
        
       var checkbox=document.getElementById("INGFBOptionalPage"+Page.id)
      
       if(checkbox.checked)
       { 
        variables.Pages.INGFBSelectedOptionalPagesList=[...variables.Pages.INGFBSelectedOptionalPagesList,Page] 
       }
        
      })
      if(variables.Pages.INGFBSelectedOptionalPagesList.length>0)
      {
        props.handleAddINPages()
        props.SetShowINFBChoiceModal(false)
        handlePreviousClose()
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
     
    })
    
    return (
      <>
            
        <Dialog
        
          open={true}
          onClose={handleClose}
          TransitionComponent={Transition}
          keepMounted
          disableBackdropClick
          disableEscapeKeyDown
          PaperProps={{
            style: { 
              position: 'absolute',
              margin: '80px auto', // adjust margin to change vertical position
             maxWidth:"300px",
             top:"20rem"
           
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">
            Optional Facebook Pages
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">      
            We found that these Facebook pages are related to your instagram page
            do you wanna add them?
            </DialogContentText>
           
    {pages.map((Page,index)=>{
        
        return (
          <Form.Check  id={"INGFBOptionalPage"+Page.id}  key={"INGFBOptionalPage"+Page.id} type="switch" defaultChecked={false}  autoComplete="off" autoSave="off" label={Page.name }/> )})}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>No</Button>
            <Button  variant="outlined" color="error"  onClick={handleAddPage} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }