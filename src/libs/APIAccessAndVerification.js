import React,{ useState,useEffect,useRef } from 'react';
import { useToast } from '@chakra-ui/react'
import { APIStatuses } from '../variables/variables';
import {ServerInternalError,ServerConnectionLostError}from "../Exceptions/Exceptions" ;
import  {APIStatus}from "../variables/variables"
import { ToastContainer, toast } from 'react-toastify';
//This is an Async method which will call our API, url is the API path, data is the json data, the format should follow our DTO format in the backend
export  const  CALLAPI = async (url,data)=>
  {
   
    try {
      const response = await fetch(url,{
        method: "POST",
        
        headers: { 
          "Content-Type": "application/json"  
        },
        body: data
      })
      .catch((e)=>{
        //Throwing the Connection Lost Exception
        throw new ServerConnectionLostError()
      });

      
      if(response.status.toString()=="500")
      {
      
        //Throwing the Internal Error Exception
        console.log("DEVELOPER ONLY: ->")
        console.log(response)
        throw new ServerInternalError()

        
      }
      
      const json = await response.json(); 
      if(response.status.toString()=="400"&&json.errorCode == "F004")
      {
        console.log("TOO MANY FACEBOOK REQUESTS")
      }
      APIStatus.Status=APIStatuses.APICallSuccess
      return(json)

    } catch (error) {
      APIStatus.Status=APIStatuses.ConnectionLost
     //Handling the Internal Error Exception
      if(error instanceof ServerInternalError)
      {
        APIStatus.Status=APIStatuses.ConnectionLost
        toast.error(error.ErrorMessageUser, {
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
       //Handling the Connection Lost Exception
      if(error instanceof ServerConnectionLostError)
      {
        
        APIStatus.Status=APIStatuses.ConnectionLost
        toast.error(error.ErrorMessageUser, {
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
  }
//This is an Async method which will call our API, url is the API path, data is the json data and also requires a valid JWT token
  export const CALL_API_With_JWTToken = async (url,data,token)=>
  {
    
    try {
      const response = await fetch(url,{
        method: "POST",
        
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` 
        },
        body: data
      })
      .catch((e)=>{
        //Throwing the Connection Lost Exception
        console.log("DEVELOPER: "+response)
        throw new ServerConnectionLostError()
      });

      
      if(response.status.toString()=="500")
      {
        //Throwing the Internal Error Exception
        console.log("DEVELOPER ONLY: ->")
        console.log(response)
        throw new ServerInternalError()
      }

  
    

      const json = await response.json();  
      
      if(response.status.toString()=="400"&&json.errorCode == "F004")
      {
        console.log("TOO MANY FACEBOOK REQUESTS")
      }
      
      APIStatus.Status=APIStatuses.APICallSuccess
      return(json)
    



    } 
    catch(error)
    {

      APIStatus.Status=APIStatuses.ConnectionLost
      //Handling the Internal Error Exception
       if(error instanceof ServerInternalError)
       {
         APIStatus.Status=APIStatuses.ConnectionLost
         toast.error(error.ErrorMessageUser, {
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
        //Handling the Connection Lost Exception
       if(error instanceof ServerConnectionLostError)
       {
         
         APIStatus.Status=APIStatuses.ConnectionLost
         toast.error(error.ErrorMessageUser, {
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
 
  }
  
  export const VerifyAuth = async (url,data,token)=>
  {
    
    try {
      const response = await fetch(url,{
        method: "POST",
        
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` 
        },
        body: data
      })
      .catch((e)=>{
        //Throwing the Connection Lost Exception
        throw new ServerConnectionLostError()
      });

      
      if(response.status.toString()=="500")
      {
        //Throwing the Internal Error Exception
        console.log("DEVELOPER ONLY: ->")
        console.log(response)
        throw new ServerInternalError()
      }
      
      const json = await response.json();  
      APIStatus.Status=APIStatuses.APICallSuccess
      return(json)
    } catch (error) {
      APIStatus.Status=APIStatuses.ConnectionLost
      //Handling the Internal Error Exception
       if(error instanceof ServerInternalError)
       {
         APIStatus.Status=APIStatuses.ConnectionLost
         toast.error(error.ErrorMessageUser, {
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
        //Handling the Connection Lost Exception
       if(error instanceof ServerConnectionLostError)
       {
         
         APIStatus.Status=APIStatuses.ConnectionLost
         toast.error(error.ErrorMessageUser, {
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
  }


  export const CALL_API_With_JWTToken_GET = async (url,token)=>
  {
    
    try {
      const response = await fetch(url,{
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` 
        }
        
      })
      .catch((e)=>{
        //Throwing the Connection Lost Exception
        throw new ServerConnectionLostError()
      });

      
      if(response.status.toString()=="500")
      {
        //Throwing the Internal Error Exception
        console.log("DEVELOPER ONLY: ->")
        console.log(response)
        throw new ServerInternalError()
      }

      const json = await response.json(); 
      if(response.status.toString()=="400"&&json.errorCode == "F004")
      {
        console.log("TOO MANY FACEBOOK REQUESTS")
      } 
      APIStatus.Status=APIStatuses.APICallSuccess
      return(json)
    } catch (error) {
      APIStatus.Status=APIStatuses.ConnectionLost
     //Handling the Internal Error Exception
      if(error instanceof ServerInternalError)
      {
        APIStatus.Status=APIStatuses.ConnectionLost
        toast.error(error.ErrorMessageUser, {
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
       //Handling the Connection Lost Exception
      if(error instanceof ServerConnectionLostError)
      {
        
        APIStatus.Status=APIStatuses.ConnectionLost
        toast.error(error.ErrorMessageUser, {
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
  }