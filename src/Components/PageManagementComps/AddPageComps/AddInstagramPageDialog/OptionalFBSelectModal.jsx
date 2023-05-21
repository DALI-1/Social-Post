import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Form from 'react-bootstrap/Form';
import {AppContext} from "../../../../context/Context"
import * as variables from "../../../../variables/variables"
import { ToastContainer, toast } from 'react-toastify';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CancelIcon from '@mui/icons-material/Cancel';
import Slide from '@mui/material/Slide';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function PagesDialog(props) { 
 const {GlobalState,Dispatch}=React.useContext(AppContext)
  const [pages, setPages] = useState(props.INFBPages);
  const handlePreviousClose = () => {
    props.SelectINSTAPageModalFlag(false)
  };


  React.useEffect(()=>{
   
    let TempData=props.INFBPages
    props.INFBPages.map((page)=>{
    //this flag tell us that the page exist already
    let Page_Exist_Flag=false
    //Here we will be checking if the page exist or not
    variables.Pages.CurrentGroupPages.map((Existing_Page)=>{

      if(Existing_Page.platformPageID==page.id)
      {
        Page_Exist_Flag=true
      }
    })

    //The case where the instagram and facebook page already exist
       if(Page_Exist_Flag==true)
      {
        TempData=TempData.filter(item=>item.id!=page.id)
      }

  })
  setPages(TempData)
  },[])
    const handleClose = () => {
      variables.Pages.INGFBSelectedOptionalPagesList=[]
      props.handleAddINPages() 
      props.SetShowINFBChoiceModal(false)
      handlePreviousClose()
    };

    const HandleCancel=()=>{
      variables.Pages.INGFBSelectedOptionalPagesList=[]
      variables.Pages.INGSelectedPagesList=[]
      variables.Pages.INGSelectPagesList=[]
      props.SetShowINFBChoiceModal(false)
      handlePreviousClose()
    }
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
              margin: '30px auto', // adjust margin to change vertical position
             minWidth:"300px",
             bottom:"-0.5rem",
           
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">
            Optional Facebook Pages Add
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">      
           The Selected Instagram businesss accounts are linked to these Facebook pages, would you like to add them as well and have them associated to each other?
           <br></br>
           <strong>Note: The Association between the pages is not gonna modify anything, it's just logical and for you to know which Instagram page is related to which Facebook Page.</strong>
            </DialogContentText>
           
    {pages.map((Page,index)=>{
        
        return (
          <Form.Check  id={"INGFBOptionalPage"+Page.id}  key={"INGFBOptionalPage"+Page.id} type="switch" defaultChecked={false}  autoComplete="off" autoSave="off" label={<><strong>{Page.name}</strong>{" Associated to "}<strong>{Page.instagram_business_account.username}</strong></>}/> )})}
          </DialogContent>
          <DialogActions>
          <Button variant="outlined" startIcon={<HighlightOffIcon/>} color="info" onClick={HandleCancel}>Cancel.</Button>
            <Button variant="outlined" startIcon={<CancelIcon/>}  color="warning" onClick={handleClose}>No.</Button>
            <Button  variant="outlined" startIcon={<NoteAddIcon/>} color="warning"  onClick={handleAddPage}>
              Yes.
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }