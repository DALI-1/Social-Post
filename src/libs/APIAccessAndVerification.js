import React,{ useState,useEffect,useRef } from 'react';
import { useToast } from '@chakra-ui/react'

//This is an Async method which will call our API, url is the API path, data is the json data, the format should follow our DTO format in the backend
export  const  CALLAPI = async (url,data, UpdateAPIError)=>
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
      UpdateAPIError(false) 
      
      return(json)
    } catch (error) {
      console.log(" DEVELOPER ONLY : ERROR", error);

      UpdateAPIError(true) 
      
      return(error);
    }
  }
//This is an Async method which will call our API, url is the API path, data is the json data and also requires a valid JWT token
  export const CALL_API_With_JWTToken = async (url,data,token,UpdateAPIError)=>
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
      UpdateAPIError(false) 
      return(json)
    } catch (error) {
      console.log(" DEVELOPER ONLY : ERROR", error);

      UpdateAPIError(true) 
      return(error);
    }
  }
  
  export const VerifyAuth = async (url,data,token,UpdateAuthStatus)=>
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
      UpdateAuthStatus(true) 
      return(json)
    } catch (error) {
      console.log(" DEVELOPER ONLY : ERROR", error);

      UpdateAuthStatus(false) 
      return(error);
    }
  }