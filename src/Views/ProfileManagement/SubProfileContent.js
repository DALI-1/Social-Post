import * as React from 'react';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SubProfileContent.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import { MDBFile } from 'mdb-react-ui-kit';
import {storage} from '../../libs/FireBase'
import {getDownloadURL,ref, uploadBytesResumable,deleteObject} from 'firebase/storage'
import {hashString,hashRandom } from 'react-hash-string'
import ProgressBar from 'react-bootstrap/ProgressBar';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import {APIStatus,APIStatuses}  from '../../variables/variables';
import { Avatar } from "@nextui-org/react";
import MainCard from "../../components/UI/cards/MainCard"
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)
    let OriginalUserinfo=React.useRef()
    let Username=React.useRef()
    let FirstName=React.useRef()
    let LastName=React.useRef()
    let Age=React.useRef()
    let PhoneNumber=React.useRef()
    let Email=React.useRef()
    let UserProfilePicture= React.useRef();
    let uploadTask=React.useRef(null)
    const [UploadProgress,setUploadProgress]=React.useState(0)
    React.useEffect(() => {
                        
                       Email.current.value=variables.UserInformations.info.email   
                        FirstName.current.value=variables.UserInformations.info.firstName
                         LastName.current.value= variables.UserInformations.info.lastName
                        PhoneNumber.current.value= variables.UserInformations.info.phoneNumber             
                        Username.current.value=variables.UserInformations.info.userName
                         Age.current.value=variables.UserInformations.info.birthdayDate
                         UserProfilePicture.current.src=variables.UserInformations.info.profilePictureURL 
     
      },[]);

    
    const handleImageUpdate=(props)=>
    {
        props.preventDefault()
        if(!props.target[0].files[0]) return; 
        let file=props.target[0].files[0]
        let HashedFileName=hashRandom()
        const storageRef=ref(storage,`/ProfileImages/${HashedFileName}`)
        UserProfilePicture.current.src=variables.UserInformations.info.profilePictureURL
        //Deleting the old picture from FireBase
        if(variables.UserInformations.info.profilePictureURL!="")
        { 
            
            const fileRef = ref(storage,variables.UserInformations.info.profilePictureURL);
            deleteObject(fileRef).then()
        }
        //Uploading the new image to FireBase

        uploadTask.current=uploadBytesResumable(storageRef,file)
        uploadTask.current.on("state_changed",
        //This async function is executed many times during the upload to indicate progress
        (snapshot)=>
        {
            const progress=Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100)
            setUploadProgress(progress)
        },
        //This async function is executed when there is an error with the upload
        (error)=>{
            
        }
        ,
        //This function is executed when the state changes, we gonna use it for the state changing to complete
        ()=>{
         getDownloadURL(uploadTask.current.snapshot.ref)
         .then(url=>
            {   //Sending a POST HTTP To the API with the Json Object
                 let JsonObject=JSON.parse(JSON.stringify(`{"ProfilePictureURL": "${url}"}`)) 
                let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CHANGEUSERIMAGE
                let UserToken=window.localStorage.getItem("AuthToken")
                let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
                APIResult.then(result=>{
                    setUploadProgress(0)
                    if(APIStatus.Status==APIStatuses.APICallSuccess)
                    {
                            for( var property in result)
                            {
                                
                                if( property=="ImageUpdated")
                                {
                                    
                                    toast.success('Image updated successfully!', {
                                        position: "bottom-left",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                        });
                                        UserProfilePicture.current.src=url
                                        
                                        Dispatch({type:variables.UserActions.UpdateProfilPicture,value:url})    
                                    break
                                }
                                if( property=="UserDoesntExist")
                                {
                                    toast.error('Your account doesnt exist, your account must be deleted recently while you re on', {
                                        position: "bottom-left",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                        });
                                        break
                                }
                                
                            }
                    }

                })
            }
            )
        }
        )


    }  
    const CancelImageUpload=(props)=>
    {
        let UploadCancelled=uploadTask.current.cancel()
     if(UploadCancelled)
     {
        setUploadProgress(0)
        toast.success('File Upload cancelled', {
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
     else
     {
        toast.error('File Upload cancel failed, please contact Dev team', {
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
   
  
    const handlesubmit=(props)=>
    {
      props.preventDefault()
      
     
      //Converting Form Data to a Json object
      let JsonObject
      let JsonString="{"
      for(let i=0;i<6;i++)
        {
          
          if(i!=5)
          JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\","
          else
          JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\"}"
  
        }
  
        
     JsonObject=JSON.parse(JSON.stringify(JsonString))
     //Sending a POST HTTP To the API with the Json Object
     let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CHANGEPERSONALINFO
     let UserToken=window.localStorage.getItem("AuthToken")
     let APIResult=CALL_API_With_JWTToken(url,JsonObject,UserToken)
    
     APIResult.then(result=>{
            if(APIStatus.Status==APIStatuses.APICallSuccess)
            {
                    for( var property in result)
                    {
                    if( property=="UserInfoUpdated")
                    {
                        Dispatch({type:variables.UserActions.UpdateFirstName,value:FirstName.current.value}) 
                        Dispatch({type:variables.UserActions.UpdateLastName,value:LastName.current.value})
                        Dispatch({type:variables.UserActions.UpdateUsername,value:Username.current.value})
                        Dispatch({type:variables.UserActions.UpdateEmail,value:Email.current.value})                
                        variables.UserInformations.info.phoneNumber =PhoneNumber.current.value            
                        variables.UserInformations.info.birthdayDate=Age.current.value
                        
                        toast.success('Personal Informations updated successfully!', {
                            position: "bottom-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            });
                        break
                    }
                    if( property=="PhoneNumberUsed")
                    {
                        toast.error('The Phone Number you choose already exist, please pick an other one!', {
                            position: "bottom-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            });
                        break
                    }
                    if( property=="UserNameUsed")
                    {
                        toast.error('The Username you choosed already exist, please pick an other one!', {
                            position: "bottom-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            });
                        break
                    }
                    if( property=="EmailUsed")
                    {
                        toast.error('The Email you choosed already exist, please pick an other one!', {
                            position: "bottom-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            });
                            break
                    }
                    if( property=="UserDoesntExist")
                    {
                        toast.error('Your account doesnt exist, your account must be deleted recently while you re on', {
                            position: "bottom-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            });
                            break
                    }

                    }
            }
 
    })
}
  return (
    
      <div className="container-xl px-4 mt-4">
    <div className="row d-flex" >
        <div className="col-xl-4 d-flex">
        <MainCard className="card mb-4">
            
                <div className="card-header d-flex justify-content-center">Profile Picture</div>
                <div className="card-body text-center ">
                    {/*Test if User has a profile picture if not show default*/}
                    
                    <img   style={{ display:"inline-block",maxWidth:"20rem",maxHeight:"20rem", margin: 'auto',borderRadius:"50%" }} ref={UserProfilePicture} className=" rounded-5  shadow-5 mb-5 border border-primary"  alt=""/>
                    
                    
                    <form onSubmit={handleImageUpdate}>
                    
                    <div className="small font-italic text-muted mb-4">
                    <input className="form-control" name="file" id="inputUsername" type="file" accept="image/png, image/gif, image/jpeg" />
                    {/* Show uploadprogress comp if the Uploadprogress state>0 */}
                    {UploadProgress!=0&&<ProgressBar  className='m-4' now={UploadProgress} />}
                    
                    {UploadProgress!=0&&<span>Uploading Image please wait...</span>}

                    {UploadProgress!=0&&<Button onClick={CancelImageUpload} variant="outline-primary">Cancel Upload</Button>}
                    </div>
                    <input className="btn btn-primary" type="submit" value="Save Image"/>
                    </form>
                </div>
            
            </MainCard>
        </div>
        <div className="col-xl-8 d-flex">
           
        <MainCard className="card mb-4">
                <div className="card-header">Account Details</div>
                <div className="card-body">
                    <form onSubmit={handlesubmit}>
                      
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="inputUsername">Username (how your name will appear to other users on the site)</label>
                            <input ref={Username} className="form-control" name="userName" id="inputUsername" type="text" placeholder="Enter your username" />
                        </div>
                       
                        <div className="row gx-3 mb-3">
                        
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputFirstName">First name</label>
                                <input ref={FirstName} className="form-control" name="firstName" id="inputFirstName" type="text" placeholder="Enter your first name" />
                            </div>
                           
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputLastName">Last name</label>
                                <input ref={LastName} className="form-control" name="lastName" id="inputLastName" type="text" placeholder="Enter your last name" />
                            </div>
                        </div>
                       
                        {/*<div className="row gx-3 mb-3">
                           
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputOrgName">Organization name</label>
                                <input className="form-control" id="inputOrgName" type="text" placeholder="Enter your organization name" />
                            </div>
                            
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputLocation">Location</label>
                                <input className="form-control" id="inputLocation" type="text" placeholder="Enter your location" />
                            </div>
                        </div>*/ }
                        
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="inputEmailAddress">Email address</label>
                            <input ref={Email} className="form-control" name="email" id="inputEmailAddress" type="email" placeholder="Enter your email address" />
                        </div>
                        
                        <div className="row gx-3 mb-3">
                            
                        <div className="col-md-6 ">
                                <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                                <input ref={PhoneNumber} className="form-control" name="phoneNumber" id="inputPhone" type="tel" placeholder="Enter your phone number" />
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="BirthdayDate">Birthday Date</label>
                                <input ref={Age} className="form-control" name="BirthdayDate" id="BirthdayDate" type="date" placeholder="Enter your age" />
                            </div>
                            
                        </div>
                        
                        <input type="submit" value="Save Changes" className="btn btn-primary"/>
                    </form>
                </div>
                </MainCard>
        </div>
    </div>
</div>
 
  );
}