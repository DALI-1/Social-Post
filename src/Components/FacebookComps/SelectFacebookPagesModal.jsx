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
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
export default function PagesDialog(props) {
   
 let [PagesLoadedFlag,SetPagesLoadedFlag]=React.useState(false)
 const [isLoggedIn, setIsLoggedIn] = React.useState(false);
 const [ isSdkLoaded, SetisSdkLoaded] = React.useState(false);

  let FacebookLoginRefButton=React.useRef();
  const responseFacebook = (response) => {
    setIsLoggedIn(true);
    variables.FacebookUser.LoggedFacebookUserInfo=response
    console.log(response)
fetch(`https://graph.facebook.com/v16.0/me/accounts?fields=name,id,instagram_business_account{username,id},access_token&&access_token=${response.accessToken}`)
.then(response => response.json())
.then(data =>
{
  let TempData=data.data
  data.data.map((page)=>{
    //this flag tell us that the page exist already
    let Page_Exist_Flag=false
    //This flag tell us that the business account of this page already exist
    let Page_Insta_Exist_Flag=false

    //Here we will be checking if the page exist or not
    variables.Pages.CurrentGroupPages.map((Existing_Page)=>{

      if(Existing_Page.platformPageID==page.id)
      {
        console.log("Page exist")
        Page_Exist_Flag=true
      }
      //here we test if the page has an IN Business acc
      if(page.instagram_business_account!=null)
      {
        if(Existing_Page.platformPageID==page.instagram_business_account.id)
        {
          console.log("Insta page exist")
         Page_Insta_Exist_Flag=true
        }
      }
      

    })

    //The case where the instagram and facebook page already exist
       if(Page_Exist_Flag==true && Page_Insta_Exist_Flag==true)
      {
        TempData=TempData.filter(item=>item.id!=page.id)
      }
      //The case where only the instagram page exist
      if(Page_Exist_Flag==false && Page_Insta_Exist_Flag==true)
      { 
        TempData=TempData.filter(item=>item.id!=page.id)
        let Page_WithoutBA={name:page.name,id:page.id,access_token:page.access_token}
        TempData=[...TempData,Page_WithoutBA]
      }
      //the case where only the fb page is found
      if(Page_Exist_Flag==true && Page_Insta_Exist_Flag==false)
      {
       
        TempData=TempData.filter(item=>item.id!=page.id)
        
      }

  })
  variables.Pages.FBSelectPagesList={data:TempData}
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
        appId={process.env.REACT_APP_METAAPPKEY}
        autoLoad={true}
        fields={process.env.REACT_APP_METAAPP_APPFIELDS}
        scope={process.env.REACT_APP_METAAPP_APPSCOPES}
        callback={responseFacebook} 
        onFailure={onFailure}
        render={renderProps => {
          if(renderProps.isSdkLoaded==false)
          {
           SetisSdkLoaded(true)
          }
          return (
            <button style={{display:"none"}} ref={FacebookLoginRefButton} onClick={renderProps.onClick}> </button> 
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
           Facebook Pages Add
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">
            Please Select the Facebook pages you would like to add within your current group.
            <br></br>
               <strong>Note: Only Facebook pages allowed, your account will not be shown here.</strong>
            </DialogContentText>
     {!PagesLoadedFlag&&<p>Loading your facebook pages...</p>}

     {PagesLoadedFlag&&variables.Pages.FBSelectPagesList.data.length==0&&<p>No Pages found or the pages you own are all already added.</p>}

     {PagesLoadedFlag&&
      variables.Pages.FBSelectPagesList.data.map((Page,index)=>{ return (<Form.Check  id={"NewPage"+Page.id}  key={"NewPage"+Page.id} type="switch" defaultChecked={false}  autoComplete="off" autoSave="off" label={Page.name}/> )})}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" startIcon={<HighlightOffIcon/>} color="info" onClick={handleClose}>Cancel.</Button>
          {PagesLoadedFlag&&<Button  variant="outlined" startIcon={<NoteAddIcon/>} color="warning" onClick={handleAddPage}>
            Add the selected pages.
            </Button>}
          </DialogActions>
        </Dialog>
      </>
    );
        }
