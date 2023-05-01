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
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
export default function PagesDialog(props) {
  
   //this flag indicates if the Instagram Pages are loaded or not, False: not loaded, true: loaded
 let [PagesLoadedFlag,SetPagesLoadedFlag]=React.useState(false)
 //this flag indicates if the User is connected to Facebook Account or not, false: not connected, true: connected
 const [isLoggedIn, setIsLoggedIn] = React.useState(false);
 //This flag indicate if the Facebook SDK is loaded or not, true:loaded, false: not loaded
 const [ isSdkLoaded, SetisSdkLoaded] = React.useState(false);
 
 const {GlobalState,Dispatch}=React.useContext(AppContext)
  let FacebookLoginRefButton=React.useRef();
  // this variable contains the list of pages that the user can accesss
   //DATA FORMAT:[{name: 'RestaurantA', id: '100272216328499', instagram_business_account: {name: 'Mohamed Ali Gargouri', id: '17841458690186189'}}]
    // name here indicate the Facebook page name and ID (this is useful for the optional choice later on)

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

    //This function fetches the instagram business accounts from the current loggedin Facebook user
    const getInstagramPages = async (access_token) => {

      variables.Pages.INGSelectPagesList=[]
      try { 
        // call to the Facebook Graph API to retrieve user's Pages with fields `instagram_business_account'
        const response = await fetch(`https://graph.facebook.com/v11.0/me/accounts?fields=name,id,instagram_business_account{username,id},access_token&access_token=${access_token}`);
        const data = await response.json();
        let ListOfPagesWithInstaBusinessAcounts=[]

        let TempData=data.data
        data.data.map((page)=>{
           if(page.instagram_business_account!=undefined)
           {
             //this flag tell us that the page exist already
          let Page_Exist_Flag=false
          //This flag tell us that the business account of this page already exist
          let Page_Insta_Exist_Flag=false
      
          //Here we will be checking if the page exist or not
          variables.Pages.CurrentGroupPages.map((Existing_Page)=>{
      
            if(Existing_Page.platformPageID==page.id)
            {
              Page_Exist_Flag=true
            }
            //here we test if the page has an IN Business acc
            
              if(Existing_Page.platformPageID==page.instagram_business_account.id)
              {
               Page_Insta_Exist_Flag=true
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
            }
            //the case where only the fb page is found
            if(Page_Exist_Flag==true && Page_Insta_Exist_Flag==false)
            {
               //Do Nothing
            }

           }
           else
           {
            //filtering the pages without a business account
            TempData=TempData.filter(item=>item.id!=page.id)  
           }



           
        })  
        variables.Pages.INGSelectPagesList=TempData
        console.log(TempData)
        setPages(TempData); 
      } catch (error) {
        console.log(error.message);
      }
    };


    useEffect(()=>{ 
      //if the FB SDK IS LOADED AND RENDERED, LAUNCH THE PAGES FETCH
      if(isSdkLoaded==true)
      FacebookLoginRefButton.current.click()
    },[isSdkLoaded])


    const handleAddPage=(()=>{ 
      var INFBPAGES=[]
      //Checking which Page is selected
      variables.Pages.INGSelectPagesList.map((Page)=>{
       var checkbox=document.getElementById("NEWINSTAPage"+Page.instagram_business_account.id)

       if(checkbox.checked)
       { 
        //Creating the list of potentional pages to add
        INFBPAGES=[...INFBPAGES,Page]
       }
       
      })
      variables.Pages.INGSelectedPagesList=INFBPAGES     
  props.SetINFBPages(INFBPAGES)
let OptionsForINSTAEXIST=false

INFBPAGES.map((page)=>{

  //check if any of the pages's facebook acc is not added already

  let Page_fb_Exist_Flag=false
  variables.Pages.CurrentGroupPages.map((Existing_Page)=>{
    //here we test if the page has an IN Business acc 
      if(Existing_Page.platformPageID==page.id)
      {
       Page_fb_Exist_Flag=true
      }
  })

  //Here, if we found a INSTA page that has an optional FCBK page that's not added yet we set options flag to be true yhid way the optional modal shows
  if(Page_fb_Exist_Flag==false)
  {
    OptionsForINSTAEXIST=true
  }

})


//here we handle the case where there is pages selected and at least one of them has an optional FB page
  if(INFBPAGES.length>0&&OptionsForINSTAEXIST)
  {
    props.SetShowINFBChoiceModal(true)
  }
  //This is the case where there is pages selected but no options
  if(INFBPAGES.length>0&&!OptionsForINSTAEXIST)
  {
    props.handleAddINPages()
    props.SelectINSTAPageModalFlag(false)
  }
  //this is the case where there is no pages selected
  if(INFBPAGES.length==0)
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
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          
          PaperProps={{
            style: { 
              margin: '80px auto', // adjust margin to change vertical position

             top:"-10rem"
            }}}
        >
          <DialogTitle id="alert-dialog-title">
          Instagram Pages Add
          </DialogTitle>
          <DialogContent>
            <DialogContentText className='m-2' id="alert-dialog-description">      
               Please Select the instagram accounts you would like to add within your current group.
               <br></br>
               <br></br>
               <strong>Note: Only instagram businesss accounts allowed</strong>, if you have a personal account please link it to a Facebook Page and change it from personal to Business.
            </DialogContentText>
            <FacebookLogin  
        appId={process.env.REACT_APP_METAAPPKEY}
        autoLoad={false}
        fields={process.env.REACT_APP_METAAPP_APPFIELDS}
        scope={process.env.REACT_APP_METAAPP_APPSCOPES}
        callback={responseFacebook} 
        onFailure={onFailure}
        render={renderProps => {
          if(renderProps.isSdkLoaded==false)
          {SetisSdkLoaded(true)}
          return (<button style={{display:"none"}} ref={FacebookLoginRefButton} onClick={renderProps.onClick}> </button> )}} /> 
      {!PagesLoadedFlag&&<p> Loading your Instagram pages...</p>}
      {PagesLoadedFlag&&pages.length==0&&<strong> No Pages found or the pages you own already added within the group you currently in.</strong>}
      {PagesLoadedFlag&&
      pages.map((Page,index)=>{
       
        return (
          <Form.Check  id={"NEWINSTAPage"+Page.instagram_business_account.id}  key={"FBPage"+Page.instagram_business_account.id} type="switch" defaultChecked={false}  autoComplete="off" autoSave="off" label={Page.instagram_business_account.username   }/> )})}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" startIcon={<HighlightOffIcon/>} color="info" onClick={handleClose}>Cancel.</Button>
            {PagesLoadedFlag&&<Button  variant="outlined" startIcon={<NoteAddIcon/>} color="warning"  onClick={handleAddPage}>
              Add the selected pages.
            </Button>}
          </DialogActions>
              {/*This gonna show and ask the user to add the related FB pages if he want */}
          
        </Dialog>
      </>
    );
  }