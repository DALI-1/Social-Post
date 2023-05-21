import './Sign_in.css';
import React,{ useState,useRef } from 'react';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput} from 'mdb-react-ui-kit';
import LoadingSpinner from '../../components/UI/SpinnerComps/LoadingSpinner'
import { ChakraProvider } from '@chakra-ui/react'
import {CALL_API_With_JWTToken} from '../../libs/APIAccessAndVerification'
import { toast } from 'react-toastify';
import logo from '../../Assets/SocialPost-Logo.png';
function App() {
  let [LoadingSpinnerStatus, setLoadingSpinnerStatus] = useState(false);
  //let [PasswordRecoveryStatus, setPasswordRecoveryStatus] = useState(false);
  const queryParameters = new URLSearchParams(window.location.search)
 
  let Email = useRef(queryParameters.get("Email") );
  let Password = useRef("");
  let ConfirmPassword = useRef("");

//This methode update the parent that the pop up closed
/*  const HandleRecoveryClosure=()=>{
   
setPasswordRecoveryStatus(false)
  }*/
  const handlesubmit=(props)=>
  {
    props.preventDefault()
    if(Password.current.value===ConfirmPassword.current.value)
    {
      if(Password.current.value!=='' &&ConfirmPassword.current.value!==null)
      {
      setLoadingSpinnerStatus(true)
    
    //Converting Form Data to a Json object
    let JsonObject
    let JsonString="{"
    for(let i=0;i<2;i++)
      {
        
        if(i!==1)
        JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\","
        else
        JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\"}"
      }

      
   JsonObject=JSON.parse(JSON.stringify(JsonString))
   //Sending a POST HTTP To the API with the Json Object
   
   let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CHANGEPWAPINAME
   let APIResult=CALL_API_With_JWTToken(url,JsonObject,queryParameters.get("token"))
  
   APIResult.then(result=>{
    for( var property in result)
         {
          
           if( property==="PasswordChanged")
           {
                      toast.success('Your Password Has changed successfully!', {
                        position: "bottom-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                      setLoadingSpinnerStatus(false)
                        window.location.replace('/login')
                      break
           }
           if(property==="UserNotFound")
           {

            toast.error('Password hasnt been changed, User not found', {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
                 
                    setLoadingSpinnerStatus(false)
                    break
           }
         
          
         
         }
   }).catch(error=>{
    console.log(error)
   })
   setLoadingSpinnerStatus(false)
  }
  else
  {
    toast.info('The Password you typed cannot be empty!', {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });

    setLoadingSpinnerStatus(false)
  }
  }
   else
   {
    
    toast.error('The Password you typed doesnt match the confirm password', {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
    setLoadingSpinnerStatus(false)
   }
  
  }

  
  return (
    <ChakraProvider>
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>

        <MDBCol col='10' md='6'>
        <div className="container-sm">
        <img src={logo} className="img-fluid" alt="Social Post Logo" />
        </div>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid"  alt="Social Post" />
          
        </MDBCol>
        

        <MDBCol col='4' md='6'>

          {/*<div className="d-flex flex-row align-items-center justify-content-center">

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
          */}
          <form onSubmit={handlesubmit}>  
          <MDBInput wrapperClass='mb-4' label='Email' name="Email" id='formControl1' type='text' size="lg" value={Email.current}/>
          <MDBInput ref={Password} wrapperClass='mb-4' label='Password' name="Password" id='formControl2' type='password' size="lg"/>
          <MDBInput ref={ConfirmPassword} wrapperClass='mb-4' label='Confirm Password' name="CPassword" id='formControl3' type='password' size="lg"/>
          
           
          <div className='text-center text-md-start mt-4 pt-2'>
            <MDBBtn className="mb-0 px-5" size='lg'>Change Password</MDBBtn>
            <div className='d-flex justify-content-center mb-4'>
                {LoadingSpinnerStatus&&<LoadingSpinner id="Spinner"/>}       
              </div> 
              <div className='d-flex justify-content-center mb-4'>
                 
                          
              </div> 
           
          </div>
          
          </form>
        </MDBCol>

      </MDBRow>
      
      

    </MDBContainer>
    
    </ChakraProvider>
  );
}


export default App;