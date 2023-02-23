import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SubProfileContent.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import { MDBFile } from 'mdb-react-ui-kit';
import {storage} from '../../libs/FireBase'
import {getDownloadURL,ref, uploadBytesResumable,deleteObject} from 'firebase/storage'
import {hashString,hashRandom } from 'react-hash-string'
import DefaultProfilePicture from '../../Assets/DefaultProfilePicture.png';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)
    let OriginalUserinfo=React.useRef()
    let Username=React.useRef()
    let FirstName=React.useRef()
    let LastName=React.useRef()
    let Age=React.useRef()
    let PhoneNumber=React.useRef()
    let Email=React.useRef()
    let APIError = React.useRef(false);
    let UserProfilePicture= React.useRef("NoPictureYet");
    let uploadTask=React.useRef(null)
    const [UploadProgress,setUploadProgress]=React.useState(0)
    const UpdateAPIError=(error)=>
    {
      
      if(error==true)
      APIError.current=true
      else
      APIError.current=false
    }

   
    React.useEffect(() => {
        //Sending a GET HTTP request To the API to get the User informations
     let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETPERSONALINFO
     let UserToken=window.localStorage.getItem("AuthToken")
     let APIResult=CALL_API_With_JWTToken_GET(url,UserToken,UpdateAPIError)
     APIResult.then(result=>{
        if(APIError.current==false)
        {
            OriginalUserinfo.current=result
            //Updating the new personal info to the UI after success                  
                       Email.current.value=result["email"]    
                        FirstName.current.value=result["firstName"]
                         LastName.current.value=result["lastName"]  
                        PhoneNumber.current.value=result["phoneNumber"]               
                        Username.current.value=result["userName"]
                         Age.current.value=result["age"]
                         UserProfilePicture.current.src=result["profilePictureURL"]
                        /* Dispatch({type:variables.UserActions.UpdateUsername,value:result["userName"]}) 
                         Dispatch({type:variables.UserActions.UpdateFirstName,value:result["lastName"]})
                         Dispatch({type:variables.UserActions.UpdateLastName,value:result["lastName"]})*/
                         Dispatch({type:variables.UserActions.UpdateProfilPicture,value:result["profilePictureURL"]})
                        
                         
                
        }
        else
        {
            
            toast.error('There is an Error with our server or you lost connection, please try again or contact our Dev team!', {
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
        
     })
     .catch(error=>{
        console.log(error)
     })  

      },[]);

    
    const handleImageUpdate=(props)=>
    {
        props.preventDefault()
        if(!props.target[0].files[0]) return; 
        let file=props.target[0].files[0]
        let HashedFileName=hashRandom()
        const storageRef=ref(storage,`/ProfileImages/${HashedFileName}`)
        //Deleting the old picture from FireBase
        if(UserProfilePicture.current.src!="NoPictureYet")
        {
            const fileRef = ref(storage, UserProfilePicture.current.src);
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
                let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken,UpdateAPIError)
                APIResult.then(result=>{
                    setUploadProgress(0)
                    if(APIError.current==false)
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
                    else
                    {
                        
                        toast.error('There is an Error with our server or you lost connection, please try again or contact our Dev team!', {
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
     let APIResult=CALL_API_With_JWTToken(url,JsonObject,UserToken,UpdateAPIError)
    
     APIResult.then(result=>{
            if(APIError.current==false)
            {
                    for( var property in result)
                    {
                    if( property=="UserInfoUpdated")
                    {
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
            else
            {
                toast.error('There is an Error with our server or you lost connection, please try again or contact our Dev team!', {
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
    })
}
  return (
    
      <div className="container-xl px-4 mt-4">
  
            <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
    
    
    <div className="row">
        <div className="col-xl-4">
            
            <div className="card mb-4 mb-xl-0">
                <div className="card-header">Profile Picture</div>
                <div className="card-body text-center">
                    {/*Test if User has a profile picture if not show default*/}
                    <img  ref={UserProfilePicture}className="img-account-profile rounded-circle mb-2" src={DefaultProfilePicture} alt=""/>
                    
                    
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
            </div>
        </div>
        <div className="col-xl-8">
           
            <div className="card mb-4">
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
                            
                        <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                                <input ref={PhoneNumber} className="form-control" name="phoneNumber" id="inputPhone" type="tel" placeholder="Enter your phone number" />
                            </div>
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputPhone">Age</label>
                                <input ref={Age} className="form-control" name="age" id="age" type="number" placeholder="Enter your age" />
                            </div>
                            
                        </div>
                        
                        <input type="submit" value="Save Changes" className="btn btn-primary"/>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
      
  );
}