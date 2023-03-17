import * as React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'

import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Tree, TreeNode } from 'react-organizational-chart';
import { MDBRadio,MDBContainer, MDBRow, MDBCol,MDBCheckbox } from 'mdb-react-ui-kit';
import { Card, CardBody, CardFooter,Checkbox, CheckboxGroup } from '@chakra-ui/react'
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import AdjustSharpIcon from '@mui/icons-material/AdjustSharp';
import {hashString,hashRandom } from 'react-hash-string'
import Editor from "../../components/AddPostComps/Editor"
import "./ManagePageContent.css"
import PageManagementTable from "../../components/Table/PageManagementTable"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {HeaderSpinnerActions,HeaderSpinner}  from '../../variables/variables'
import { MDBBtn } from 'mdb-react-ui-kit';
import Paper from '@mui/material/Paper';
import SelectPageModal from "../../components/FacebookComps/SelectPageModal"
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useEffect } from 'react';
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)
    const [ListOfViewsToShow,SetListOfViewsToShow]=React.useState([]);
    const [ListOfPermToShow,SetListOfPermToShow]=React.useState([]);
    const [SelectPageModalFlag,SetSelectPageModalFlag]=React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [DataLoaded,SetDataLoaded]=React.useState(false);
    let FacebookLoginRefButton=React.useRef();



    const responseFacebook = (response) => {
      console.log(response)
      setIsLoggedIn(true);
      
      variables.FacebookUser.LoggedFacebookUserInfo=response

  fetch(`https://graph.facebook.com/v16.0/me/accounts?access_token=${response.accessToken}`)
  .then(response => response.json())
  .then(data =>
  {
    variables.Pages.SelectPagesList=data
    console.log(data)
    SetSelectPageModalFlag(true)
  }
  )
  .catch(error => console.error(error));

    }
  
    const onFailure = () => {
  
     
      console.log("Failed to connect to Facebook");
    };

   useEffect (()=>{
    var JsonObject={
      "groupID": variables.UserInformations.info.joinedGroups[0].id
    }
    let JsonObjectToSend=JSON.stringify(JsonObject)  
    let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETGROUPPAGES
    let UserToken=window.localStorage.getItem("AuthToken")
    let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
    Dispatch({type:variables.HeaderSpinnerActions.TurnOnRequestSpinner})
    
    APIResult.then((result)=>
    {
      console.log(result)
                  variables.Pages.CurrentGroupPages=[]
                     
                    result.result.map((Page)=>{

                      variables.Pages.CurrentGroupPages=[...variables.Pages.CurrentGroupPages,Page.value]
                    })
                              
                                  
                                  
                    SetDataLoaded(true)                                    
    })
    .catch((e)=>{

      console.log(e)
    })
    
    Dispatch({type:variables.HeaderSpinnerActions.TurnOffRequestSpinner})
   },[])

  
  return (
    <>
      
      <Paper sx={{ width: '100%', mb: 2 ,textAlign: "right" }}>
        <div style={{ textAlign: "right" }}>
       <MDBBtn outline className='mx-2 m-2' color='secondary' onClick={()=>{
        FacebookLoginRefButton.current.click()
        
       }}>
        Add New Page
      </MDBBtn>

      <MDBBtn outline className='mx-2 m-2' color='secondary' >
        Modifty Page
      </MDBBtn>
      <MDBBtn outline className='mx-2 m-2' color='secondary' >
       Delete Page
      </MDBBtn>
       </div>
       </Paper>

      <Row>
      <Paper sx={{ width: '100%', m: 1,p:2 ,textAlign: "right" }}>
       {DataLoaded&&<PageManagementTable  data={variables.Pages.CurrentGroupPages}/>} 
        
        </Paper>
       
      </Row>
      <div>
      {/*isLoggedIn &(
        <div>
          <p>Welcome {name}!</p>
          <img src={picture} alt={name} />
        </div>
      ) */} </div>

        
      
<FacebookLogin  
        appId="959797981855736"
        autoLoad={false}
        
        fields="birthday,first_name,last_name,id,email,picture"
        callback={responseFacebook} 
        onFailure={onFailure}
        render={renderProps => (
          <button onClick={renderProps.onClick} ref={FacebookLoginRefButton}> 
          </button>
        )}
        
      />

{SelectPageModalFlag&&<SelectPageModal SetSelectPageModalFlag={SetSelectPageModalFlag} data={variables.Pages.SelectPagesList}/>}
</>
  );
}