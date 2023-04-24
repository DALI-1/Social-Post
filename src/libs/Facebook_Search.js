import { APIStatuses } from '../variables/variables';
import {ServerInternalError,ServerConnectionLostError}from "../Exceptions/Exceptions" ;
import  {APIStatus}from "../variables/variables"
import {toast } from 'react-toastify';
export const Facebook_Get_Audience_Interests = async (Interest_Name)=>{
   
  let url="https://graph.facebook.com/v16.0/search?type=adinterest&q="+Interest_Name
  try {
    const response = await fetch(url,{
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${process.env.REACT_APP_METAAPP_APPACCESSTOKEN}`
      },
    })
    .catch((e)=>{
      //Throwing the Connection Lost Exception
      console.log("DEVELOPER: "+response)
      throw new ServerConnectionLostError()
    });
    const json = await response.json();     
    APIStatus.Status=APIStatuses.APICallSuccess
    return(json)
  } 
  catch(error)
  {
       console.log(error)
    APIStatus.Status=APIStatuses.ConnectionLost
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

export const Facebook_Get_Audience_Countries = async (CountryName)=>{
   
    let url="https://graph.facebook.com/v16.0/search?type=adgeolocation&location_types=country&q="+CountryName
    try {
      const response = await fetch(url,{
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${process.env.REACT_APP_METAAPP_APPACCESSTOKEN}`
        },
      })
      .catch((e)=>{
        //Throwing the Connection Lost Exception
        console.log("DEVELOPER: "+response)
        throw new ServerConnectionLostError()
      });
      const json = await response.json();     
      APIStatus.Status=APIStatuses.APICallSuccess
      return(json)
    } 
    catch(error)
    {
         console.log(error)
      APIStatus.Status=APIStatuses.ConnectionLost
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


  export const Facebook_Get_Audience_Regions = async (countries,RegionName)=>{
    let Result=[]
    try {
       
        const promises = countries.map(async (Country) => {
            const url = "https://graph.facebook.com/v16.0/search?type=adgeolocation&location_types=region&q="+ RegionName+"&country_code="+ Country.key;
            const response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${process.env.REACT_APP_METAAPP_APPACCESSTOKEN}`
              },
            });
            const json = await response.json();
            APIStatus.Status = APIStatuses.APICallSuccess;
            Result = [...Result, ...json.data];
          });
          await Promise.all(promises);
          return Result;
    } 
    catch(error)
    {
         console.log(error)
      APIStatus.Status=APIStatuses.ConnectionLost
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
  export const Facebook_Get_Audience_Locations = async (regions,CityName)=>{
    let Result=[]
    try {       
        const promises = regions.map(async (City) => {
            const url = "https://graph.facebook.com/v16.0/search?type=adgeolocation&location_types=['city']&region_id="+City.key+"&q="+ CityName
            const response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${process.env.REACT_APP_METAAPP_APPACCESSTOKEN}`
              },
            });
            const json = await response.json();
            APIStatus.Status = APIStatuses.APICallSuccess;
            Result = [...Result, ...json.data];
          });
          await Promise.all(promises);
          return Result;
    } 
    catch(error)
    {
         console.log(error)
      APIStatus.Status=APIStatuses.ConnectionLost
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
  