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
import './AddUserContent.css';
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
import AddUserLogo from '../../Assets/AddUser.png';
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import {HeaderSpinnerActions,HeaderSpinner}  from '../../variables/variables'
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)
    let OriginalUserinfo=React.useRef()
    let Username=React.useRef()
    let FirstName=React.useRef()
    let LastName=React.useRef()
    let Age=React.useRef()
    let PhoneNumber=React.useRef()
    let Email=React.useRef()
    let ListOfGroups=React.useRef([])
    let [GroupsDropDownList,SetGroupsDropDownList]=React.useState({})
    
    const [UploadProgress,setUploadProgress]=React.useState(0)
    


    function CreateHiearchyData(Grp) {
        if(Grp.subGroups!=null)
       {
            var localres=[]
            Grp.subGroups.map((group,index) => {  
                  var childs=CreateHiearchyData(group) 
                  localres=[...localres,{label:group.group_Name,value:group.id,children:childs}]  
                })
                return(localres)            
          
      }
      else
      {
        return({label:Grp.group_Name,value:Grp.id,children:[{}]})
      }
    }
    
    const FillData=()=>
    {
     var res=[]

     variables.UserInformations.info.joinedGroups.map((grp)=>{
        res=[...res,{label:grp.group_Name,value:grp.id,children:CreateHiearchyData(grp)}]
    
     }
     )
    
    SetGroupsDropDownList(res)
    }
      const onChange = (currentNode, selectedNodes) => {
        console.log('onChange::', currentNode, selectedNodes)
         
        var res=[]
         selectedNodes.map((n)=>{
            res=[...res,n.value]
         })
        ListOfGroups.current=res
      }
      const onAction = (node, action) => {
        console.log('onAction::', action, node)
      }
      const onNodeToggle = currentNode => {
        console.log('onNodeToggle::', currentNode)
      }
   
  
    const handlesubmit=(props)=>
    {

      props.preventDefault()
      
     
      //Converting Form Data to a Json object
      let JsonObject=
      {
        "userGroupsIDs": ListOfGroups.current,
        "userName": Username.current.value,
        "firstName": FirstName.current.value,
        "lastName": LastName.current.value,
        "age": Age.current.value,
        "email": Email.current.value,
        "phoneNumber": PhoneNumber.current.value
      }
     JsonObject= JSON.stringify(JsonObject)
     //Sending a POST HTTP To the API with the Json Object
     let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CREATESLAVEUSER
     let UserToken=window.localStorage.getItem("AuthToken")
     console.log(JsonObject)
     let APIResult=CALL_API_With_JWTToken(url,JsonObject,UserToken)
    
     APIResult.then(result=>{
            
                    for( var property in result)
                    {
                    

                        if( property=="UserCreated")
                        {
                            toast.success('User Successfully created and automatically added to the selected groups', {
                                position: "bottom-left",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                                });
                                 //Updating our SubGroups info
                                 let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETPERSONALINFO
                                 let UserToken=window.localStorage.getItem("AuthToken")
                                 let APIResult=CALL_API_With_JWTToken_GET(url,UserToken)
                                 Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})
                                 APIResult.then(result=>{ 
                                          variables.UserInformations.info=result
                                          variables.UserInformations.info.passwordHash=null
                                          variables.UserInformations.info.passwordSalt=null
                                         
                                         
                                   })
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
            
                    Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})
    })
  
    }




React.useEffect(()=>{
    FillData()
},[])
  return (
    
      
       
        
           
            <div className="card mb-4 ">
                <div className="card-header">Account Details</div>
                <img  src={AddUserLogo} className="AddUserLogo"  alt=""/>
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
                                <label className="small mb-1" htmlFor="inputPhone">Age</label>
                                <input ref={Age} className="form-control" name="age" id="age" type="number" placeholder="Enter your age" />
                            </div>

                            
                            
                            
                            
                        </div>

                        <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputPhone"> Groups </label>
                                <DropdownTreeSelect data={GroupsDropDownList} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} />
                        </div>
                                
                            
                        
                        <input type="submit" value="Save Changes" className="btn btn-primary"/>
                    </form>
                </div>
            </div>
        
 
      
  );
}