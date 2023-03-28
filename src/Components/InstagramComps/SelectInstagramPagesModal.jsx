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
        const response = await fetch(`https://graph.facebook.com/v11.0/me/accounts?fields=name,id,instagram_business_account{name,id},access_token&access_token=${access_token}`);
        const data = await response.json();
        let ListOfPagesWithInstaBusinessAcounts=[]
        data.data.map((page)=>{
           if(page.instagram_business_account!=undefined)
           ListOfPagesWithInstaBusinessAcounts=[...ListOfPagesWithInstaBusinessAcounts,page]
        })    
        variables.Pages.INGSelectPagesList=ListOfPagesWithInstaBusinessAcounts
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
  if(INFBPAGES.length>0)
  {
    props.SetShowINFBChoiceModal(true)
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
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          
          PaperProps={{
            style: { 
              margin: '80px auto', // adjust margin to change vertical position

             top:"-10rem"
            }}}
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
        autoLoad={true}
        fields="birthday,first_name,last_name,id,email,picture"
        callback={responseFacebook} 
        onFailure={onFailure}
        render={renderProps => {
          if(renderProps.isSdkLoaded==false)
          {SetisSdkLoaded(true)}
          return (<button ref={FacebookLoginRefButton} onClick={renderProps.onClick}> </button> )}} /> 
      {!PagesLoadedFlag&&<p> Loading your Instagram pages...</p>}
      {PagesLoadedFlag&&
      pages.map((Page,index)=>{
       
        return (
          <Form.Check  id={"NEWINSTAPage"+Page.instagram_business_account.id}  key={"FBPage"+Page.instagram_business_account.id} type="switch" defaultChecked={false}  autoComplete="off" autoSave="off" label={Page.instagram_business_account.name   }/> )})}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button  variant="outlined" color="error"  onClick={handleAddPage} autoFocus>
              Add Pages
            </Button>
          </DialogActions>
              {/*This gonna show and ask the user to add the related FB pages if he want */}
          
        </Dialog>
      </>
    );
  }