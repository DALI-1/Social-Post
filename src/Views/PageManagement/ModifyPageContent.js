import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { DropDownTree } from "@progress/kendo-react-dropdowns";
import { processTreeData, expandedState } from "../../components/tree-data-operations";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ModifyPageContent.css';
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
import { mapTree, extendDataItem } from '@progress/kendo-react-common';
export default function Content() {
    const selectField = "selected";
    const expandField = "expanded";
    const dataItemKey = "id";
    const textField = "name";
    const subItemsField ="fb_page_categories";
    const fields = {
      selectField,
      expandField,
      dataItemKey,
      subItemsField,
    };
    let uploadTask=React.useRef(null)
    const [SelectedpageData, setSelectedpageData] = React.useState([]);
    const [data, setdata] = React.useState([{id:"",name:"Loading"}]);
    const [value, setValue] = React.useState(null);
    const [expanded, setExpanded] = React.useState([data[0][dataItemKey]]);
    let PagePicture= React.useRef();
    const onChange = (event) => setValue(event.value);
    const onExpandChange = React.useCallback(
      (event) => setExpanded(expandedState(event.item, dataItemKey, expanded)),
      [expanded]
    );
    
    
    let PageName=React.useRef("")
    let PageDescription=React.useRef("")
    let PageAbout=React.useRef("")
    let PageImageUrl=React.useRef("")
    const treeData = React.useMemo(() => processTreeData(data,{expanded,value},fields),[expanded, value,data]);
    const {GlobalState,Dispatch}=React.useContext(AppContext)
    let OriginalUserinfo=React.useRef()
    const [UploadProgress,setUploadProgress]=React.useState(0)
    React.useEffect(() => {              
        //Loading All FB Categories from the backened
        
        var JsonObject={
            "PageID": variables.Pages.ListOfSelectedPages[0].ID
          }
          let JsonObjectToSend=JSON.stringify(JsonObject)  
          let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETFBCATEGORIES
          let UserToken=window.localStorage.getItem("AuthToken")
          let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
          Dispatch({type:variables.HeaderSpinnerActions.TurnOnRequestSpinner})
          APIResult.then((result)=> {
            if(result.ErrorCode==undefined)
              {setdata(result.result.data)}
            else
            {
                console.log(result)
               
            }  
            
            
        
        })     
          .catch((e)=>{console.log(e)})
       
          Dispatch({type:variables.HeaderSpinnerActions.TurnOffRequestSpinner}) 

        },[]);


        React.useEffect(()=>{
            if(data.length!=null)
            {
 //Getting the Selected Page Informations
 var JsonObject3={
    "PageID": variables.Pages.ListOfSelectedPages[0].ID
  }
  let JsonObjectToSend3=JSON.stringify(JsonObject3)  
  let url3=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETPAGEINFO
  let UserToken3=window.localStorage.getItem("AuthToken")
  let APIResult3=CALL_API_With_JWTToken(url3,JsonObjectToSend3,UserToken3)
 
  APIResult3.then((result)=> { 
    if(result.ErrorCode==undefined)
    {
        if (result.result.name!=undefined){PageName.current.value=result.result.name}
        if (result.result.about!=undefined){PageAbout.current.value=result.result.about}
        if (result.result.picture.data.url!=undefined){PageImageUrl.current.src=result.result.picture.data.url}
        if (result.result.description!=undefined){PageDescription.current.value=result.result.description}
        if (result.result.category_list[0]!=undefined){
            //Setting the default category to selected
            
        var res=mapTree(treeData,subItemsField,(item)=>{
            if(item.id==result.result.category_list[0].id)
              setValue(item)
            return item
        })
        }
    }
    else
    {
        console.log(result)
    }
  
    
   
    

})     
  .catch((e)=>{console.log(e)})
            }

        },[data])





   
   //handles the save of the page informations
    const handlesubmit=(props)=>
    {
      props.preventDefault()
      
      var JsonObject={
        "PageID": variables.Pages.ListOfSelectedPages[0].PageID,"pageName":PageName.current.value,"pageDescription":PageDescription.current.value
        ,"pageAbout":PageAbout.current.value
      }
      let JsonObjectToSend=JSON.stringify(JsonObject)  
      let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_UPDATEPAGEINFO
      let UserToken=window.localStorage.getItem("AuthToken")
      let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
      Dispatch({type:variables.HeaderSpinnerActions.TurnOnRequestSpinner})
      APIResult.then((result)=> {
          })     
      .catch((e)=>{console.log(e)})
   
      Dispatch({type:variables.HeaderSpinnerActions.TurnOffRequestSpinner}) 
     
     
    }




    const handleImageUpdate=(props)=>
    {
        props.preventDefault()
        if(!props.target[0].files[0]) return; 
        let file=props.target[0].files[0]
        let HashedFileName=hashRandom()
        const storageRef=ref(storage,`/PageImages/${HashedFileName}`)

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
           console.log(error)  
        }
        ,
        //This function is executed when the state changes, we gonna use it for the state changing to complete
        ()=>{
         getDownloadURL(uploadTask.current.snapshot.ref)
         .then(url=>
            {  
                //Sending a POST HTTP To the API with the Json Object
                setUploadProgress(0)
                var JsonObject={
                    "PageID": variables.Pages.ListOfSelectedPages[0].PageID,"pictureURL":url.toString()
                   
                  }
                  let JsonObjectToSend=JSON.stringify(JsonObject)  
                  let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_UPDATEPAGEPICTURE
                  let UserToken=window.localStorage.getItem("AuthToken")
                  let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
                  Dispatch({type:variables.HeaderSpinnerActions.TurnOnRequestSpinner})
                  APIResult.then((result)=> {

                    
                    toast.success('Page Picture Changed Successfully', {
                        position: "bottom-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });

                    Dispatch({type:variables.HeaderSpinnerActions.TurnOffRequestSpinner})
                      })     
                  .catch((e)=>{console.log(e)})
                
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
  return (
    
      <div className="container-xl px-4 mt-4">
    <div className="row d-flex" >
        <div className="col-xl-4 d-flex">
            
            <div className="card mb-4 ">
                <div className="card-header d-flex justify-content-center"> Page Picture</div>
                <div className="card-body text-center ">
                    {/*Test if User has a profile picture if not show default*/}
                    
                    <img ref={PageImageUrl}   style={{ display: 'block', margin: 'auto' }}  className="rounded-5 shadow-2 mb-5 border border-primary"  alt=""/> 
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
        <div className="col-xl-8 d-flex">
           
            <div className="card mb-4 ">
                <div className="card-header d-flex justify-content-center"> Page  Details</div>
                <div className="card-body text-center ">
                    <form onSubmit={handlesubmit}>
                      
                        <div className="mb-3">
                            <label className="small mb-1" htmlFor="Pname"> Page Name</label>
                            <input  ref={PageName} className="form-control" name="Page_Name" id="Pname" type="text" placeholder="Enter your new Page Name" />
                        </div>
                       
                        <div className="row gx-3 mb-3">
                        
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="Pabout">About</label>
                                <input ref={PageAbout} className="form-control" name="firstName" id="Pabout" type="text" placeholder="Enter your Page About here" />
                            </div>
                           
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="pdes">Description</label>
                                <input  ref={PageDescription} className="form-control"  name="lastName" id="pdes" type="text" placeholder="Enter your Page Description here" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="small mb-1"> Page Category</label>
                            <br></br>
                            <div>
                                <DropDownTree
                                    data={treeData}
                                    value={value}
                                    onChange={onChange}
                                    placeholder="Please select ..."
                                    textField={textField}
                                    dataItemKey={dataItemKey}
                                    selectField={selectField}
                                    expandField={expandField}
                                    subItemsField={subItemsField}
                                    onExpandChange={onExpandChange}
                                />
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