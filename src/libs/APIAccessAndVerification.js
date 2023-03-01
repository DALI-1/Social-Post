import React,{ useState,useEffect,useRef } from 'react';
import { useToast } from '@chakra-ui/react'
import { APIStatuses } from '../variables/variables';
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
      });
      
      const json = await response.json(); 
     
      APIStatus.Status=APIStatuses.APICallSuccess
      return(json)

    } catch (error) {
      APIStatus.Status=APIStatuses.ConnectionLost
        toast.error('Connection Lost, please try again...', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
       

      return(error);
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
      });
      
      const json = await response.json();  
      
      APIStatus.Status=APIStatuses.APICallSuccess
      return(json)
    } catch (error) {
      console.log(error)
      APIStatus.Status=APIStatuses.ConnectionLost
      toast.error('Connection Lost, please try again...', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      return(error);
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
      });
      
      const json = await response.json();  
      APIStatus.Status=APIStatuses.APICallSuccess
      return(json)
    } catch (error) {
      APIStatus.Status=APIStatuses.ConnectionLost
      toast.error('Connection Lost, please try again...', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      return(error);
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
        
      });
      
      const json = await response.json();  
      APIStatus.Status=APIStatuses.APICallSuccess
      return(json)
    } catch (error) {
      APIStatus.Status=APIStatuses.ConnectionLost
        toast.error('Connection Lost, please try again...', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        
    
      return(error);
    }
  }