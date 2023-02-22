import './Sign_in.css';
import React,{ useState,useEffect,useRef } from 'react';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import LoadingSpinner from '../../components/LoadingSpinner'
import { useToast } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import { PasswordRecovery } from './PasswordRecovery';
import logo from '../../Assets/SocialPost-Logo.png';

import {CALLAPI} from '../../libs/APIAccessAndVerification'
function App() {
  let [LoadingSpinnerStatus, setLoadingSpinnerStatus] = useState(false);
  let [PasswordRecoveryStatus, setPasswordRecoveryStatus] = useState(false);
  let UserNameDontExist= useRef(false);
  let UserWrongPassStatus= useRef(false);
  let UserAuthentificated= useRef(false);
  let APIError = useRef(false);
  let RememberMe=useRef(false)
  const toast = useToast()
  

//This methode update the parent that the pop up closed
  const HandleRecoveryClosure=()=>{
setPasswordRecoveryStatus(false)
  }
  const UpdateAPIError=(error)=>
  {
    
    if(error==true)
    APIError.current=true
    else
    APIError.current=false
  }
  
 if(window.localStorage.getItem("IsRemembered")!=null)
 {
   if(window.localStorage.getItem("IsRemembered").match(true))
          {
            setTimeout(() => {
              window.location.replace('/index')
            }, 0);
          }
 }


  const handlesubmit=(props)=>
  {
    props.preventDefault()
    setLoadingSpinnerStatus(true)
    UserAuthentificated.current=false
    UserNameDontExist.current=false
    UserWrongPassStatus.current=false
    //Converting Form Data to a Json object
    let JsonObject
    let JsonString="{"
    for(let i=0;i<3;i++)
      {
        if(i==2)
        RememberMe.current=props.target[i].checked
        if(i!=1)
        JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\","
        else
        JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\"}"

      }

      
   JsonObject=JSON.parse(JSON.stringify(JsonString))
   //Sending a POST HTTP To the API with the Json Object
   let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_LOGINAPINAME
   
   let APIResult=CALLAPI(url,JsonObject,UpdateAPIError)
  
   APIResult.then(result=>{
   
    for( var property in result)
        {
          if( property=="JWT_AccessToken")
          {
                UserAuthentificated.current=true
                toast({
                  title: 'Login',
                  description: "You logged in successfully!",
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                })
                    

                if(RememberMe.current==true)
                {
                  window.localStorage.setItem('AuthToken', result[property])
                  window.localStorage.setItem('IsRemembered', true)
                }
                else
                {
                  window.localStorage.setItem('AuthToken', result[property])
                  window.localStorage.setItem('IsRemembered', false)
                }
          }
          else if(property=="UserNotFound")
          {
                 UserNameDontExist.current=true
                 
                 toast({
                  
                  title: 'Login',
                  description: "The username you inserted doesn't exist.",
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                })
          }
          else if(property=="WrongPassword")
          {
            UserWrongPassStatus.current=true
            toast({
              title: 'Login',
              description: "You typed the wrong password, Check if you have CAPS on.",
              status: 'info',
              duration: 3000,
              isClosable: true,
            })
          }
        
        }
         if(APIError.current==true)
         {
          toast({
            title: 'Server Internal Error',
            description: "Its Either the Server is down or you lost connection",
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
         }
        
        setLoadingSpinnerStatus(false) 
        if(UserAuthentificated.current==true)
        setTimeout(() => 
          window.location.replace('/index')
        , 1000)
        
      
   }).catch(error=>{
   
    toast({
      title: 'Server internal Error',
      description: "Contact Dev team, there is an internal error within the server",
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
   })}

  
  return (
    <ChakraProvider>
    <MDBContainer fluid className="p-3 my-5 h-custom">

      <MDBRow>
      
        <MDBCol col='10' md='6'>
        <div className="container-sm">
        <img src={logo} className="img-fluid" alt="Sample image" />
        </div>
        
          
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
          
        </MDBCol>
        

        <MDBCol col='4' md='6'>

          <div className="d-flex flex-row align-items-center justify-content-center">

            <p className="lead fw-normal mb-0 me-3">Sign in with</p>

            <MDBBtn floating size='md' tag='a' className='me-2'>
              <MDBIcon fab icon='facebook-f' />
            </MDBBtn>

            <MDBBtn floating size='md' tag='a'  className='me-2'>
              <MDBIcon fab icon='twitter' />
            </MDBBtn>

            <MDBBtn floating size='md' tag='a'  className='me-2'>
              <MDBIcon fab icon='linkedin-in' />
            </MDBBtn>

          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Or</p>
          </div>
          <form onSubmit={handlesubmit}>  
          <MDBInput wrapperClass='mb-4' label='Username' name="userName" id='formControl1' type='text' size="lg"/>
          <MDBInput wrapperClass='mb-4' label='Password' name="password" id='formControl2' type='password' size="lg"/>

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox name='RememberMe' value='on'type="checkbox" id='flexCheckDefault' label='Remember me' />
            <a href='' onClick={(props)=>{setPasswordRecoveryStatus(true)
            props.preventDefault()
            
            }}>Forgot password?</a>
            
          </div>
          {PasswordRecoveryStatus&&<PasswordRecovery passedhandleclose={HandleRecoveryClosure} Open={PasswordRecoveryStatus} />}  
          <div className='text-center text-md-start mt-4 pt-2'>
            <MDBBtn className="mb-0 px-5" size='lg'>Login</MDBBtn>
            <div className='d-flex justify-content-center mb-4'>
                {LoadingSpinnerStatus&&<LoadingSpinner id="Spinner"/>}       
              </div> 
              <div className='d-flex justify-content-center mb-4'>
                 
                          
              </div> 
            <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <a href="/Register" className="link-danger">Register</a></p>
          </div>
          
          </form>
        </MDBCol>

      </MDBRow>
      
      

    </MDBContainer>
    
    </ChakraProvider>
  );
}


export default App;