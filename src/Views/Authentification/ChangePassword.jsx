import './Sign_in.css';
import React,{ useState,useEffect,useRef } from 'react';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import LoadingSpinner from '../../components/LoadingSpinner'
import { useToast } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import { PasswordRecovery } from './PasswordRecovery';
function App() {
  let [LoadingSpinnerStatus, setLoadingSpinnerStatus] = useState(false);
  let [PasswordRecoveryStatus, setPasswordRecoveryStatus] = useState(false);
  let UserNameDontExist= useRef(false);
  let UserWrongPassStatus= useRef(false);
  let UserAuthentificated= useRef(false);
  let APIError = useRef(false);
  const toast = useToast()

//This methode update the parent that the pop up closed
  const HandleRecoveryClosure=()=>{
   
setPasswordRecoveryStatus(false)
  }

  //This is an Async method which will call our API, url is the API path, data is the json data, the format should follow our User.DTO in the backend.
  const CALLAPI = async (url,data)=>
  {
    
    try {
      const response = await fetch(url,{
        method: "POST",
        
        headers: { 
          "Content-Type": "application/json"  
        },
        body: data
      });
      
      const json = await response.json();  
      APIError.current=false;
      return(json)
    } catch (error) {
      console.log(" DEVELOPER ONLY : ERROR", error);

      toast({
        title: 'Connection Error!',
        description: "There is an Error with our server, please retry again",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      APIError.current=true;
      return(error);
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
    for(let i=0;i<2;i++)
      {
        
        if(i!=1)
        JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\","
        else
        JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\"}"
      }

      
   JsonObject=JSON.parse(JSON.stringify(JsonString))
   //Sending a POST HTTP To the API with the Json Object
   let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_LOGINAPINAME
  
   let APIResult=CALLAPI(url,JsonObject)
  
   APIResult.then(result=>{
  
    
   }).catch(error=>{
    console.log(error)
   })}

  
  return (
    <ChakraProvider>
    <MDBContainer fluid className="p-3 my-5 h-custom">

      <MDBRow>

        <MDBCol col='10' md='6'>
        <h1 className="my-1 display-3 fw-bold ls-tight px-3" style={{color: '#0a4275'}}>
            Social Post <br />
            
          </h1>
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
          <MDBInput wrapperClass='mb-4' label='Email' name="Email" id='formControl1' type='text' size="lg"/>
          <MDBInput wrapperClass='mb-4' label='Password' name="Password" id='formControl2' type='password' size="lg"/>
          <MDBInput wrapperClass='mb-4' label='Confirm Password' name="Password" id='formControl2' type='password' size="lg"/>
          
           
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