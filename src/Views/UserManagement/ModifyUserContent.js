import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ModifyUserContent.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import { MDBFile } from 'mdb-react-ui-kit';
import {storage} from '../../libs/FireBase'
import {getDownloadURL,ref, uploadBytesResumable,deleteObject} from 'firebase/storage'
import {hashString,hashRandom } from 'react-hash-string'
import ProgressBar from 'react-bootstrap/ProgressBar';
import {AppContext} from "../../context/Context"
import {UserSelectedTabActions,UserTabs,HeaderSpinnerActions,HeaderSpinner,User}from "../../variables/variables"
import * as variables from "../../variables/variables"
import {APIStatus,APIStatuses}  from '../../variables/variables';
import { Avatar } from "@nextui-org/react";
import MainCard from "../../components/UI/cards/MainCard"
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Fade from '@mui/material/Fade'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'; 
import Accordion from 'react-bootstrap/Accordion';
import SaveIcon from '@mui/icons-material/Save';
import ModifyUserIcon from "../../assets/settings_Icon.png"
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)
    let OriginalUserinfo=React.useRef()
    let Username=React.useRef()
    let FirstName=React.useRef()
    let LastName=React.useRef()
    let Age=React.useRef()
    let PhoneNumber=React.useRef()
    let Email=React.useRef()
    let UserProfilePicture= React.useRef();
    let uploadTask=React.useRef(null)
    const [UploadProgress,setUploadProgress]=React.useState(0)


    React.useEffect(() => {
                        

        var JsonObject=
        {
            "userID": variables.User.SelectedUserToModify
          }

 JsonObject=JSON.stringify(JsonObject)
 
  let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETUSERINFOBYID
  let UserToken=window.localStorage.getItem("AuthToken")
  let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
  Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})

  APIResult.then((result)=>
  {
    

    Email.current.value=result.email   
    FirstName.current.value=result.firstName
     LastName.current.value=result.lastName
    PhoneNumber.current.value=result.phoneNumber             
    Username.current.value=result.userName
     Age.current.value=result.birthdayDate
    Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})
  })

     

},[]);
   
  
    const handlesubmit=(props)=>
    {
        props.preventDefault()
      
     
        //Converting Form Data to a Json object
        let JsonObject
        let JsonString="{\"userID\": \""+variables.User.SelectedUserToModify+"\","
        for(let i=0;i<6;i++)
          {
            
            if(i!=5)
            JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\","
            else
            JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\"}"
    
          }
    
          
       JsonObject=JSON.parse(JSON.stringify(JsonString))
       //Sending a POST HTTP To the API with the Json Object
       let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_EDITSLAVEUSERINFO
       let UserToken=window.localStorage.getItem("AuthToken")
       let APIResult=CALL_API_With_JWTToken(url,JsonObject,UserToken)
      
       APIResult.then(result=>{
              
                      for( var property in result)
                      {
                      if( property=="UserInfoUpdated")
                      {
                            
                          toast.success('Personal Informations updated successfully!', {
                              position: "bottom-left",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                              });
                                //Updating our SubGroups info
                                let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETPERSONALINFO
                                let UserToken=window.localStorage.getItem("AuthToken")
                                let APIResult=CALL_API_With_JWTToken_GET(url,UserToken)
                                Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})
                                APIResult.then(result=>{ 
                                         variables.UserInformations.info=result
                                         variables.UserInformations.info.passwordHash=null
                                         variables.UserInformations.info.passwordSalt=null
                                        
                                         Dispatch({type:variables.UserSelectedTabActions.SelectManageUser})
                                  })
                          break
                      }
                      if( property=="PhoneNumberUsed")
                      {
                          toast.error('The Phone Number you choose already exist, please pick an other one!', {
                              position: "bottom-left",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                              });
                          break
                      }
                      if( property=="UserNameUsed")
                      {
                          toast.error('The Username you choosed already exist, please pick an other one!', {
                              position: "bottom-left",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                              });
                          break
                      }
                      if( property=="EmailUsed")
                      {
                          toast.error('The Email you choosed already exist, please pick an other one!', {
                              position: "bottom-left",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                              });
                              break
                      }
                      if( property=="UserDoesntExist")
                      {
                          toast.error('Your account doesnt exist, your account must be deleted recently while you re on', {
                              position: "bottom-left",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                              });
                              break
                      }
  
                      }
              }
   
      )
      
     
      
 
    
}
  return (
    
     
       
        
           
            <MainCard >
                 <Accordion className='m-2' defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col md={4}>
              <Avatar size="xl" style={{marginRight:"0.5rem"}} src={ModifyUserIcon} color="primary" zoomed/>
              </Col>              
            </Row>
            
            <Row>
            <Col md={10}>
               <p style={{marginTop:"1rem"}}> Edit User</p>
              </Col>
              <Col md={2}>
              <Tooltip style={{marginTop:"0.5rem"}} title="Here you can edit a user's information" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
          </Accordion.Header>
        <Accordion.Body>
        
        <form onSubmit={handlesubmit}>
                      
                      <div className="mb-3">
                          <label className="small mb-1" htmlFor="inputUsername">Username</label>
                          <input ref={Username} className="form-control" name="userName" id="inputUsername" type="text" placeholder="Enter your username" />
                      </div>
                     
                      <div className="row gx-3 mb-3">
                      
                          <div className="col-md-6">
                              <label className="small mb-1" htmlFor="inputFirstName">First name</label>
                              <input ref={FirstName} className="form-control" name="firstName" id="inputFirstName" type="text" placeholder="Enter your first name" />
                          </div>
                         
                          <div className="col-md-6">
                              <label className="small mb-1" htmlFor="inputLastName">Last name</label>
                              <input ref={LastName} className="form-control" name="lastName" id="inputLastName" type="text" placeholder="Enter your last name" />
                          </div>
                      </div>

                      
                      <div className="mb-3">
                          <label className="small mb-1" htmlFor="inputEmailAddress">Email address</label>
                          <input ref={Email} className="form-control" name="email" id="inputEmailAddress" type="email" placeholder="Enter your email address" />
                      </div>
                      
                      <div className="row gx-3 mb-3">
                          
                      <div className="col-md-6 ">
                              <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                              <input ref={PhoneNumber} className="form-control" name="phoneNumber" id="inputPhone" type="tel" placeholder="Enter your phone number" />
                          </div>
                          <div className="col-md-6">
                              <label className="small mb-1" htmlFor="BirthdayDate">Birthday Date</label>
                              <input ref={Age} className="form-control" name="BirthdayDate" id="BirthdayDate" type="date" placeholder="Enter your Birthday date" />
                          </div>
                          
                      </div>
                      <div className="d-flex justify-content-center">
                        <Button variant="outlined" color='primary' type="submit" startIcon={<SaveIcon />}> Save User Informations</Button>
                        </div>
                        
                     
                  </form>
           
              
        
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
                
            </MainCard>
        
   
      
  );
}