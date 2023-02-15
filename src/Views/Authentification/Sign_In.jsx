import './Sign_in.css';
import React,{ useState,useEffect} from 'react';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import LoadingSpinner from '../../components/LoadingSpinner'
function App() {
  let [LoadingSpinnerStatus, setLoadingSpinnerStatus] = useState(false);
  let [UserNameDontExist, setUserNameDontExist] = useState(false);
  let [WrongPassStatus, setUserWrongPassStatus] = useState(false);
  let [UserAuthentificated, setUserAuthentificated] = useState(false);
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
      return(json)
    } catch (error) {
      console.log("error", error);
      return(error);
    }
  }

  const handlesubmit=(props)=>
  {
    props.preventDefault()
    setLoadingSpinnerStatus(true)
    setUserAuthentificated(false)
    setUserNameDontExist(false)
    setUserWrongPassStatus(false)
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
  
    for( var property in result)
        {
          if( property=="JWT_AccessToken")
          {
                setUserAuthentificated(true)
                console.log("Verfied!")
          }
          else if(property=="UserNotFound")
          {
                 setUserNameDontExist(true)
                 console.log("Wrong name")
          }
          else if(property=="WrongPassword")
          {
            
            setUserWrongPassStatus(true)
          }
        
        }
        
        setLoadingSpinnerStatus(false)  
   }).catch(error=>{
    console.log(error)
   })}


   useEffect(() => {
    setTimeout(() => {
                if(UserAuthentificated==true)
      window.location.replace('/index')
    }, 1); 
  }, [UserAuthentificated]); 
  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">

      <MDBRow>

        <MDBCol col='10' md='6'>
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
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>

          <div className='text-center text-md-start mt-4 pt-2'>
            <MDBBtn className="mb-0 px-5" size='lg'>Login</MDBBtn>
            <div className='d-flex justify-content-center mb-4'>
                {LoadingSpinnerStatus&&<LoadingSpinner id="Spinner"/>}       
              </div> 
              <div className='d-flex justify-content-center mb-4'>
                {WrongPassStatus&&<p>You Typed the wrong password, please try again!</p>}  
                {UserNameDontExist&&<p> You Typed a username that doesn't exist, use an other one!</p>}            
              </div> 
            <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <a href="/Register" className="link-danger">Register</a></p>
          </div>
          
          </form>
        </MDBCol>

      </MDBRow>
      
      

    </MDBContainer>
  );
}


export default App;