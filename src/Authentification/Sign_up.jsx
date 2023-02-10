import './Sign_up.css';

import React,{ useState } from 'react';
import LoadingSpinner from '../Components/LoadingSpinner'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon
}
from 'mdb-react-ui-kit';


function App() {

  let [LoadingSpinnerStatus, setLoadingSpinnerStatus] = useState(false);
  let [UserExistStatus, setUserExistStatus] = useState(false);
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
  setUserExistStatus(false)
  //Converting Form Data to a Json object
  let JsonObject
  let JsonString="{"
  for(let i=0;i<8;i++)
    {
      
      if(i!=7)
      JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\","
      else
      JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\"}"
    }
 JsonObject=JSON.parse(JSON.stringify(JsonString))
 //Sending a POST HTTP To the API with the Json Object
 let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_REGISTERAPINAME

 let APIResult=CALLAPI(url,JsonObject)

 APIResult.then(result=>{

  for( var property in result)
      {
        
        if(property==="UsernameExist" && result[property]==="true")
        {  
            
          setUserExistStatus(true)
          
        }
      }
      setLoadingSpinnerStatus(false)
      if(UserExistStatus==false)
      {
        setTimeout(() => {
                
          window.location.replace('/login')
        }, 1); 
      }
 }).catch(error=>{
  console.log(error)
 })
}
  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>

      <MDBRow>

        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
            The best offer <br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>for your business</span>
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Eveniet, itaque accusantium odio, soluta, corrupti aliquam
            quibusdam tempora at cupiditate quis eum maiores libero
            veritatis? Dicta facilis sint aliquid ipsum atque?
          </p>

        </MDBCol>

        <MDBCol md='6' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
             <form onSubmit={handlesubmit}>     
              <MDBRow>
                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' label='First name' id='form1' type='text' name="FirstName" required={true}/>
                </MDBCol>

                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' label='Last name' id='form2' type='text' name="LastName" required={true}/>
                </MDBCol>
              </MDBRow>
              <MDBInput wrapperClass='mb-4' label='Username' id='form3' type='text' name="UserName" required={true}/>
              <MDBInput wrapperClass='mb-4' label='Email' id='form4' type='email' name="Email" required={true}/>
              <MDBInput wrapperClass='mb-4' label='Age' id='form5' type='number'name="Age" required={true}/>
              <MDBInput wrapperClass='mb-4' label='Campaign Name' id='form6' name="CampaignName" type='text' required={true}/>
              <MDBInput wrapperClass='mb-4' label='Phone Number' id='form7' name="PhoneNumber" type='tel' required={true}/>
              <MDBInput wrapperClass='mb-4' label='Password' id='form8' name="Password" type='password' required={true}/>

              <div className='d-flex justify-content-center mb-4'>
                {/*<MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Subscribe to our newsletter' />*/}
                <p className="small fw-bold mt-2 pt-1 mb-2">You Already have an account?  <a href="/Login" className="link-danger">Sign In</a></p>
              </div>

              <MDBBtn className='w-100 mb-4' size='md' type='submit'>sign up</MDBBtn>
              <div className='d-flex justify-content-center mb-4'>
                {LoadingSpinnerStatus&&<LoadingSpinner id="Spinner"/>}             
              </div> 
              <div className='d-flex justify-content-center mb-4'>               
                {UserExistStatus&&<p>Username exist, please pick an other one!</p>}
              </div> 
              </form>
              <div className='text-center text-md-start mt-4 pt-2'>
            
           
          </div>
            
              <div className="text-center">

                <p>or sign up with:</p>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='facebook-f' size="sm"/>
                </MDBBtn>

               

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>

                

              </div>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}

export default App;