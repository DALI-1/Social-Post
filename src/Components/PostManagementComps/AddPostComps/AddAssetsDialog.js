import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Accordion from 'react-bootstrap/Accordion';
import ImageAddEditor from "../PostAssetsComps/ImageAddEditor"
import ImagePickerList from "../PostAssetsComps/ImagePicker"
import { MDBBtn } from 'mdb-react-ui-kit';
import {AppContext} from "../../../context/Context"
import * as APILib from "../../../libs/APIAccessAndVerification"
import LinearProgress from '@mui/material/LinearProgress';
import {  toast } from "react-toastify";
import {storage} from '../../../libs/FireBase'
import {getDownloadURL,ref, uploadBytesResumable,deleteObject} from 'firebase/storage'
import * as variables from "../../../variables/variables"
import {hashString,hashRandom } from 'react-hash-string'
import {LinearWithValueLabel} from "../../UI/SpinnerComps/LinearProgressBar_With_label"
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Avatar } from "@nextui-org/react";
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Fade from '@mui/material/Fade'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'; 
import IconButton from '@mui/material/IconButton';
import VideoInput from '../PostAssetsComps/VideoUploadComp/VideoInput';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import VideoPicker from "../PostAssetsComps/VideoUploadComp/VideoPicker"
import VideoIcon from "../../../assets/video_Icon.png"
import ImageIcon from "../../../assets/gallery_Icon.png"
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({SetShowAssetsDialog,AppenedAsset,AppenedVideoAsset}) {
  const {GlobalState,Dispatch}=React.useContext(AppContext)
const [UploadedImage,SetUploadedImage]=React.useState()
let SelectedPictures=React.useRef([])
const [Gallery,SetGallery]=React.useState([])
const [AssetsLoading,SetAssetsLoading]=React.useState(true)
let uploadTask=React.useRef(null)
let ProgressSpinnerRef=React.useRef(null)
const [UploadProgress,setUploadProgress]=React.useState(0)
  const handleClose = () => {
    SetShowAssetsDialog(false)
  };
  //This state tells which tab is selected, Images or Videos, used to Update the buttons.
  const [SelectedOption,SetSelectedOption]=React.useState([])

const HandleAddImageToGallery=()=>{
  if(UploadedImage===null)
  {
    toast.info("Please Upload an Image in order to add!", {
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
    handleImageUpdate(UploadedImage)
  }
}

const Convert_URLImageData_ToFile=(ImageUrl)=>
{
  // Example base64-encoded string representing an image
const base64String = ImageUrl;
// Extract the MIME type and base64 data
const match = base64String.match(/^data:(.+);base64,(.*)$/);
const mimeType = match[1];
const base64Data = match[2];

// Decode the base64 data
const decodedData = atob(base64Data);

// Create a new Uint8Array from the decoded data
const dataArray = new Uint8Array(decodedData.length);
for (let i = 0; i < decodedData.length; i++) {
  dataArray[i] = decodedData.charCodeAt(i);
}

// Create a new blob object with the Uint8Array and specify the MIME type
const blob = new Blob([dataArray], { type: mimeType });

const fileExtension = mimeType.split("/")[1] || '';
const fileName = `image.${fileExtension}`;
const file = new File([blob], fileName, { type: mimeType });
return(file);
}


const AspectRatio_IsValid = (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onload = function (event) {
      const image = new Image();
      image.src = event.target.result;

      image.onload = function () {
        const aspectRatio = image.naturalWidth / image.naturalHeight;
  
        if (aspectRatio <= 1.91 && aspectRatio >= 4/5) {
          resolve(true);
        } else {
          resolve(false);
        }
      };

      image.onerror = function () {
        reject(new Error('Failed to load image.'));
      };
    };

    reader.onerror = function () {
      reject(new Error('Failed to read file.'));
    };
  });
};

const handleImageUpdate=(ImageUrl)=>
    { 
        setUploadProgress(0)

        
        
        if(ImageUrl===null || ImageUrl=="") return; 
        
        let file=Convert_URLImageData_ToFile(ImageUrl)
        AspectRatio_IsValid(file).then((IsAspectRatioValid)=>{
          if(IsAspectRatioValid)
        {
          let HashedFileName=hashRandom()
          const storageRef=ref(storage,`/AssetsPictures/${HashedFileName}`)
          //Uploading the new image to FireBase
          uploadTask.current=uploadBytesResumable(storageRef,file)
          uploadTask.current.on("state_changed",
          //This async function is executed many times during the upload to indicate progress
          (snapshot)=>
          {
              const progress=Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100)
              setUploadProgress(progress)
              
              if(ProgressSpinnerRef.current!=null)
              {
                const SpinnerProgressBarStateSetter= ProgressSpinnerRef.current.GetSpinnerProgressBarStateSetter;
                SpinnerProgressBarStateSetter(progress)
              }
                
                
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
              {   //Sending a POST HTTP To the API with the Json Object     
                var JsonObject = { 
                  groupID: GlobalState.SelectedGroup.id,
                  assetName: file.name,
                  assetType: file.type,
                  resourceURL: url        
            };
            let JsonObjectToSend = JSON.stringify(JsonObject);
            let url2 =
              process.env.REACT_APP_BACKENDURL + 
              process.env.REACT_APP_ADDASSET;
            let UserToken = window.localStorage.getItem("AuthToken");
            let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
            APIResult.then((result) => {
              if (result.errorCode == undefined) {
                if(result.successCode=="Asset_Added")
                {
                  toast.success('Image saved to the Gallery', {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                    
                  SetGallery([...Gallery,result.result])     
                }
              }
            });
  
              }
              )
          }
          )
        }
        else
        {
          toast.info('The selected Image Aspect ratio is not valid, please pick something between 4:5 and 1.91:1 ', {
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

    const HandleDeleteSelectedImages=()=>{
      var ListOfAssets=[];
      var ListOfSelectedIDs=[]
       SelectedPictures.current.map((SelectedPic)=>
       {
        
        ListOfSelectedIDs=[...ListOfSelectedIDs,SelectedPic.value]
        ListOfAssets=[...ListOfAssets,{assetID:SelectedPic.value}]
       })

      var JsonObject = {        
          listOfAssets: ListOfAssets   
                       };
  let JsonObjectToSend = JSON.stringify(JsonObject);
  let url2 =
    process.env.REACT_APP_BACKENDURL + 
    process.env.REACT_APP_DELETEGROUPASSET;
  let UserToken = window.localStorage.getItem("AuthToken");
  let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
  APIResult.then((result) => {
    if (result.errorCode == undefined) {
      if(result.successCode=="Asset_Deleted")
      {
        toast.success('Assets deleted Successfully !', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
            //Deleting the old picture from FireBase
            SelectedPictures.current.map((Pic)=>{
              const fileRef = ref(storage,Pic.src);
              deleteObject(fileRef).then()
            })     
        SetGallery(Gallery.filter(item => !ListOfSelectedIDs.includes(item.id)))
        SelectedPictures.current=[]
      }
    }
    else
    {
      if(result.result=="Invalid Asset ID")
      {
        toast.error('Error, One of the Selected Assets cannot be deleted! !', {
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
  });

    }
  //Loading the Group assets
  React.useEffect(()=>{
    var JsonObject = { 
      
        groupID: GlobalState.SelectedGroup.id
  };
  let JsonObjectToSend = JSON.stringify(JsonObject);
  let url2 =
    process.env.REACT_APP_BACKENDURL + 
    process.env.REACT_APP_GETGROUPASSETS;
  let UserToken = window.localStorage.getItem("AuthToken");
  let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
  APIResult.then((result) => {
    if (result.errorCode == undefined) {
      if(result.successCode=="Assets_Retrieved")
      {
        SetGallery(result.result)
        SetAssetsLoading(false)       
      }
    }
  });
  },[])

  
    const HandleAddSelectedPictures_ToTheEditor=()=>
  {
      let ListOfAssets=[]
      SelectedPictures.current.map((Asset)=>{  
        ListOfAssets=[...ListOfAssets,Asset]
      })
    AppenedAsset(ListOfAssets)
    handleClose()
  }



  
//=================================VIDEO RELATED FUNCTIONS & STATES========================================//
const [SelectedVideo_Local_URL,setSelectedVideo_Local_URL]=React.useState(null)
const [Video_Gallery,SetVideo_Gallery]=React.useState([])
const [VideoGalleryLoading,SetVideoGalleryLoading]=React.useState(false)
const [SelectedVideo,Set_SelectedVideo]=React.useState(false)

  //Loading the Group Video assets
  React.useEffect(()=>{
    var JsonObject = {      
        groupID: GlobalState.SelectedGroup.id
  };
  
  let JsonObjectToSend = JSON.stringify(JsonObject);
  let url2 =
    process.env.REACT_APP_BACKENDURL + 
    process.env.REACT_APP_GETGROUPVIDEOASSETS;
  let UserToken = window.localStorage.getItem("AuthToken");
  SetVideoGalleryLoading(true)
  let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
  APIResult.then((result) => {
    if (result.errorCode == undefined) {
      if(result.successCode=="Assets_Retrieved")
      {
        SetVideo_Gallery(result.result)
        SetVideoGalleryLoading(false)       
      }
    }
  });
  },[])
//=========This function add a video to the Gallery=======//
const HandleAddVideoToGallery=()=>{
  if(SelectedVideo_Local_URL===null)
  {
    toast.info("Please Upload an Video in order to add it to the Gallery", {
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
    UploadVideo_To_FireBase(SelectedVideo_Local_URL)
  }
}

//=========This function Converts a Blob URL to a File =======//
function convertBlobUrlToVideoFile(blobUrl) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', blobUrl);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        const videoBlob = xhr.response;
        const videoFile = new File([videoBlob], 'video.mp4', { type: videoBlob.type });
        resolve(videoFile);
      } else {
        reject(new Error('Failed to convert blob URL to video file.'));
      }
    };
    xhr.onerror = () => {
      reject(new Error('Failed to convert blob URL to video file.'));
    };
    xhr.send();
  });
}
//=========This function uploads the video to the Firebase and saves it to the DB in The Assets Table=======//
const UploadVideo_To_FireBase=(ImageUrl)=>
    { 
        setUploadProgress(0) 
        if(ImageUrl===null || ImageUrl=="") return; 
        
        convertBlobUrlToVideoFile(ImageUrl).then((file)=>{
          let HashedFileName=hashRandom()
          const storageRef=ref(storage,`/AssetsVideos/${HashedFileName}`)
          //Uploading the new image to FireBase
          uploadTask.current=uploadBytesResumable(storageRef,file)
          uploadTask.current.on("state_changed",
          //This async function is executed many times during the upload to indicate progress
          (snapshot)=>
          {
              const progress=Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100)
              setUploadProgress(progress)
              
              if(ProgressSpinnerRef.current!=null)
              {
                const SpinnerProgressBarStateSetter= ProgressSpinnerRef.current.GetSpinnerProgressBarStateSetter;
                SpinnerProgressBarStateSetter(progress)
              }
                
                
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
              {   //Sending a POST HTTP To the API with the Json Object     
                var JsonObject = { 
                  groupID: GlobalState.SelectedGroup.id,
                  assetName: file.name,
                  assetType: file.type,
                  resourceURL: url        
            };
            let JsonObjectToSend = JSON.stringify(JsonObject);
            let url2 =
              process.env.REACT_APP_BACKENDURL + 
              process.env.REACT_APP_ADDASSET;
            let UserToken = window.localStorage.getItem("AuthToken");
            let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
            APIResult.then((result) => {
              if (result.errorCode == undefined) {
                if(result.successCode=="Asset_Added")
                {
                  toast.success('Video saved to the Gallery', {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                    SetVideo_Gallery([...Video_Gallery,result.result])     
                }
              }
            });
  
          }
              )
          }
          )
       
        })
    } 

    const HandleDeleteSelectedVideo=()=>{
      var JsonObject = {        
          listOfAssets: [{assetID:SelectedVideo}]   
                       };
  let JsonObjectToSend = JSON.stringify(JsonObject);
  let url2 =
    process.env.REACT_APP_BACKENDURL + 
    process.env.REACT_APP_DELETEGROUPASSET;
  let UserToken = window.localStorage.getItem("AuthToken");
  let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
  APIResult.then((result) => {
    if (result.errorCode == undefined) {
      if(result.successCode=="Asset_Deleted")
      {
        toast.success('Video deleted Successfully !', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
            //Deleting the old picture from FireBase
            SelectedPictures.current.map((Pic)=>{
              const fileRef = ref(storage,Pic.src);
              deleteObject(fileRef).then()
            })     

        SetVideo_Gallery(Video_Gallery.filter(item => item.id!=SelectedVideo))
        Set_SelectedVideo(null)
      }
    }
    else
    {
      if(result.result=="Invalid Asset ID")
      {
        toast.error('Error, One of the Selected Videos cannot be deleted! !', {
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
  });

    }

    const HandleAddSelectedVideo_ToTheEditor=()=>
    {
        let ListOfVideos=[]
        Video_Gallery.map((Video)=>{  
          if(Video.id==SelectedVideo)
          ListOfVideos=[Video]
        })
        if(ListOfVideos.length>0)
        {
          variables.PostGlobalVariables.POST_SelectedVideoThumbnail=""
          AppenedVideoAsset(ListOfVideos)
        handleClose()
        }
        else
        {
          toast.info('Please select a video You want to insert.', {
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
    <div>
      <Dialog
        open={true}
        fullWidth={true}
        maxWidth='lg'
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"       
      >
        <DialogTitle>Manage Assets</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          
          <Accordion className='m-2' defaultActiveKey="-1" onSelect={(e)=>{e==0?SetSelectedOption("ImageUploader"):e==1?SetSelectedOption("VideoUploader"):SetSelectedOption("NothingSelected")}}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col md={4}>
              <Avatar size="xl"  style={{marginRight:"0.5rem"}} src={ImageIcon} color="primary" zoomed/>
              </Col>              
            </Row>


            
            <Row>
            <Col md={10}>
               <p style={{marginTop:"1rem"}}>Images Gallery</p>
              </Col>
              <Col md={2}>
              <Tooltip style={{marginTop:"0.5rem"}} title="Here you can manage your Group Gallery, Add new repeatitive pictures like logos and use them directly and also add the pictures to your posts" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
        </Accordion.Header>
        <Accordion.Body>
        
             <Container style={{justifyContent: 'center',alignItems: 'center',margin:"1rem"}}>
              {/*This progress is to indicate the image upload */}
              {UploadProgress!=0&&UploadProgress!=100&&<strong>Uploading the Image, please wait...</strong>}
             {UploadProgress!=0&&UploadProgress!=100&& <LinearWithValueLabel ref={ProgressSpinnerRef} value={UploadProgress} />}
             {/*This progress is to indicate the Gallery intial load progress */}
             {AssetsLoading&&<LinearProgress />}
             {!AssetsLoading&&
             <Row className="mb-4">
             <ImageAddEditor Gallery={Gallery} SetGallery={SetGallery} UploadedImage={UploadedImage} SetUploadedImage={SetUploadedImage}/>
             </Row>
             }
              {!AssetsLoading&&
              <Row>
              <ImagePickerList   SelectedPictures={SelectedPictures} Gallery={Gallery} SetGallery={SetGallery}/>     
              </Row>
              }
              
              </Container> 
             
            
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="1">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col md={4}>
              <Avatar size="xl"  style={{marginRight:"0.5rem"}} src={VideoIcon} color="primary" zoomed/>
              </Col>              
            </Row>


            
            <Row>
            <Col md={10}>
               <p style={{marginTop:"1rem"}}> Videos Gallery</p>
              </Col>
              <Col md={2}>
              <Tooltip style={{marginTop:"0.5rem"}} title="Here you can manage your videos." TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
        </Accordion.Header>
        <Accordion.Body>
           {/*This progress is to indicate the image upload */}
         {UploadProgress!=0&&UploadProgress!=100&&<strong>Uploading the video, please wait...</strong>}
        {UploadProgress!=0&&UploadProgress!=100&& <LinearWithValueLabel style={{margin:"10px"}} ref={ProgressSpinnerRef} value={UploadProgress} />} 
        {VideoGalleryLoading&&<LinearProgress />}
        {VideoGalleryLoading==false&&<VideoInput width={400} height={300} setSelectedVideo_Local_URL={setSelectedVideo_Local_URL}/>}          
        {VideoGalleryLoading==false&&<VideoPicker  Video_Gallery={Video_Gallery} SelectedVideo_State={SelectedVideo} Set_SelectedVideo={Set_SelectedVideo}/>}

        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
        <Button variant="outlined"  color='primary' startIcon={<CancelIcon />} onClick={handleClose}>Close Tab </Button>
        {SelectedOption=="ImageUploader"&&
        <>                  
              {(UploadProgress==0 ||UploadProgress==100 )&&<Button variant="outlined" color='primary' startIcon={<AddAPhotoIcon />} onClick={HandleAddImageToGallery}>Add To Images Gallery</Button>}
              {(UploadProgress!=0&&UploadProgress!=100)&&<Button variant="outlined" color='warning' startIcon={<CancelIcon />} onClick={CancelImageUpload}>Cancel Image Upload</Button>}
              
              <Button variant="outlined" color='error' startIcon={<DeleteIcon />} onClick={HandleDeleteSelectedImages}>Delete Image from Gallery</Button>
              <Button variant="outlined" color='primary' startIcon={<PostAddIcon />} onClick={HandleAddSelectedPictures_ToTheEditor}>Insert Image To Post</Button>
        </> 
        }
          {SelectedOption=="VideoUploader"&&
        <>
         
              
              {(UploadProgress==0 ||UploadProgress==100 )&&<Button variant="outlined" color='primary' startIcon={<OndemandVideoIcon/>} onClick={HandleAddVideoToGallery}>Add To  Video Gallery</Button>}
              {(UploadProgress!=0&&UploadProgress!=100)&&<Button variant="outlined" color='warning' startIcon={<CancelIcon />} onClick={CancelImageUpload}>Cancel Video Upload</Button>}
              
              <Button variant="outlined" color='error' startIcon={<DeleteIcon />} onClick={HandleDeleteSelectedVideo}>Delete Video from Gallery</Button>
              <Button variant="outlined" color='primary' startIcon={<PostAddIcon />} onClick={HandleAddSelectedVideo_ToTheEditor}>Insert Video To Post</Button>
        </> 
        }

        </DialogActions>
      </Dialog>
    </div>
  );
}