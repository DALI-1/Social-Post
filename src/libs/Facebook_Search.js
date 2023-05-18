import { APIStatuses } from '../variables/variables';
import {ServerInternalError,ServerConnectionLostError}from "../Exceptions/Exceptions" ;
import  {APIStatus}from "../variables/variables"
import {toast } from 'react-toastify';
import * as APILib from "./APIAccessAndVerification"
export const Facebook_Get_Audience_Interests = async (Interest_Name)=>{
  var JsonObject = {"interestName": Interest_Name };
  let JsonObjectToSend = JSON.stringify(JsonObject);
  let url2 =process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_SEARCHINTEREST;
  let UserToken = window.localStorage.getItem("AuthToken");
  let APIResult = await APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
    //Case no Error
    
    if (APIResult.errorCode == undefined) {
      if(APIResult.successCode=="Interests_Reterived")
      {
        
        return APIResult.result
         
      }
    }
    //Case there is an error
    else
    {
      return []
    }
      


}

export const Facebook_Get_Audience_Countries = async (CountryName)=>{
  var JsonObject = {"countryName": CountryName };
  let JsonObjectToSend = JSON.stringify(JsonObject);
  let url2 =process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_SEARCHCOUNTRY;
  let UserToken = window.localStorage.getItem("AuthToken");
  let APIResult = await APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
  if (APIResult.errorCode == undefined) {
    if(APIResult.successCode=="Countries_Reterived")
    {
      
      return APIResult.result
       
    }
  }
  //Case there is an error
  else
  {
    return []
  }

  
  }


  export const Facebook_Get_Audience_Regions = async (countries,RegionName)=>{
    //formating the country codes list for the backened
    let Temp_CountryCodes=[]
    countries.map((country)=>{
      Temp_CountryCodes=[...Temp_CountryCodes,country.country_PlatformCode]
    })
    var JsonObject = {"countryCodes":Temp_CountryCodes ,"regionName": RegionName };   
    let JsonObjectToSend = JSON.stringify(JsonObject);
    let url2 =process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_SEARCHREGION;
    let UserToken = window.localStorage.getItem("AuthToken");
    let APIResult = await APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
    if (APIResult.errorCode == undefined) {
      
      if(APIResult.successCode=="Regions_Reterived")
      {
        
        return APIResult.result
         
      }
    }
    //Case there is an error
    else
    {
      return []
    }
  }
  export const Facebook_Get_Audience_Locations = async (regions,CityName)=>{
    
    let Temp_RegionCodes=[]
    regions.map((region)=>{
      Temp_RegionCodes=[...Temp_RegionCodes,region.region_PlatformCode]
    })
    var JsonObject = {"regionCodes":Temp_RegionCodes ,"locationName": CityName};  
    let JsonObjectToSend = JSON.stringify(JsonObject);
    let url2 =process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_SEARCHLOCATION;
    let UserToken = window.localStorage.getItem("AuthToken");
    let APIResult = await APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
    if (APIResult.errorCode == undefined) {
    
      if(APIResult.successCode=="Locations_Reterived")
      {
       
        return APIResult.result
         
      }
    }
    //Case there is an error
    else
    {
      return []
    }
  
  }
  