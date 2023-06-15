import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Accordion from 'react-bootstrap/Accordion';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import SellIcon from '@mui/icons-material/Sell';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import {hashRandom } from 'react-hash-string'
import './ThumbnailPickerDialog.css'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/material';
import { Avatar } from "@nextui-org/react";
import * as APILib from "../../../libs/APIAccessAndVerification"
import * as variables from "../../../variables/variables"
import MainCard from "../../UI/cards/MainCard"
import Spinner from "../../UI/SpinnerComps/LoadingSpinner"
import LinearSpinner from "../../UI/SpinnerComps/LinearLoadingSpinner"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {  toast } from "react-toastify";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({SetShowThumbnailDialog,Video}) {

  //=============================Thumbnail Picker States and variables==================================//
  const [SelectedTime,Set_SelectedTime]=React.useState(-1);
  const [VideoDuration,Set_VideoDuration]=React.useState(0);
  const [HiddenVideoLoaded,Set_HiddenVideoLoaded]=React.useState(false);
  const [FramesLoading,Set_FramesLoading]=React.useState(false);
  const [SelectedThumbnail,Set_SelectedThumbnail]=React.useState(variables.PostGlobalVariables.POST_SelectedVideoThumbnail);
  let [Frames,SetFrames]=React.useState([]);
  const VideoRef=React.useRef()
  const Hidden_VideoRef=React.useRef()
  const handleClose = () => {
    SetShowThumbnailDialog(false)
  };

  //==========NOTE: This function will be executed everytime the video is loaded
  const handleLoadedMetadata = () => {
    
    const video = VideoRef.current;
    if (!video) return;
    Set_VideoDuration(video.duration)
    Set_SelectedTime(0)
    //This event listener is gonna change the select time state which gonna request a frames update.
    VideoRef.current.addEventListener("seeked", (event) => {
      console.log("Called")
      Set_SelectedTime(event.target.currentTime)
    });
  };

  const handleHiddenVid_LoadedMetadata = () => {
    Hidden_VideoRef.current.addEventListener("seeked", (event) => {
    });
    Set_HiddenVideoLoaded(true)
  };
 
  //This use effect will launch a new Video Frames capture after a new time selection
  React.useEffect(()=>{
    if(SelectedTime!==-1)
    {
      captureVideoFrames()
    }
  },[SelectedTime])
//=================This Method Capture the  video frames===============//

const captureVideoFrames = async () => {
  let Temp_frames = [];
  //Limiting the captures to 5 Only 
  let CaptureEndTime=SelectedTime+8;
  if(SelectedTime+8>VideoDuration)
  {
    CaptureEndTime=VideoDuration
  }


 for(let i=SelectedTime;i<CaptureEndTime;i++)
  {
  
    Set_FramesLoading(true)
    Hidden_VideoRef.current.currentTime = i;    
      //This here should wait for the video to seek the new position
    await new Promise((resolve) => {
      Hidden_VideoRef.current.onseeked = resolve;  
    }).then(() => { 
    const newCanvas = document.createElement("canvas");
    const newCtx = newCanvas.getContext("2d");
    newCanvas.width = Hidden_VideoRef.current.videoWidth;
    newCanvas.height = Hidden_VideoRef.current.videoHeight;
    newCtx.drawImage(Hidden_VideoRef.current, 0, 0);
    Temp_frames.push(newCanvas.toDataURL('image/jpeg'));
    });
  }
  Set_FramesLoading(false)
  SetFrames(Temp_frames);
}

const HandleNext=(()=>{
  if((SelectedTime+8)<VideoDuration)
  {
    Set_SelectedTime(SelectedTime+8)
  }
  else
  {
    Set_SelectedTime(VideoDuration-8)
  }
  
})

const HandleBack=(()=>{
  if((SelectedTime-8)>0)
  {
    Set_SelectedTime(SelectedTime-8)
  }
  else
  {
    Set_SelectedTime(0)
  }
  
})

const  HandleSaveThumbnail=()=>{
  variables.PostGlobalVariables.POST_SelectedVideoThumbnail=SelectedThumbnail
  toast.info("Video Thumbnail Saved.", {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
  handleClose()
}

  return (
    <div>
      <Dialog
        fullScreen
        open={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}      
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
              <SellIcon />
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
             Video Thumbnail
            </Typography>         
            <Button  style={{marginRight:"1rem"}} color="inherit" variant="outlined" startIcon={<HighlightOffIcon />} onClick={handleClose}>Cancel</Button>
          <Button  style={{marginLeft:"1rem"}} color="inherit" variant="outlined" startIcon={<BeenhereIcon />}  on onClick={HandleSaveThumbnail}>Save Selected Thumbnail</Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
       <MainCard>
          <div className="Thumbnail_Video_Container">
          
            {!HiddenVideoLoaded&&<Spinner/>}
          {HiddenVideoLoaded&&<video
          crossorigin="anonymous"
          id="Selected_VideoID"
          ref={VideoRef}
          height="50%"
          width="50%"
          controls
          src={Video.resourceURL}         
          onLoadedMetadata={()=>{handleLoadedMetadata()}} 
          
            />}
         
           
         {/*==========NOTE: This is a hidden video used to iteratte through frames without showing that the user========== */}
         <video
          crossorigin="anonymous"
          id="Selected_VideoID2"
          ref={Hidden_VideoRef}
          height="100%"
          width="100%"
          src={Video.resourceURL}
          onLoadedMetadata={handleHiddenVid_LoadedMetadata}
          style={{display:"none"}}
            />
             {/*==========END NOTE========== */}
          </div> 
          </MainCard>
           <MainCard style={{marginTop:"10px", marginBottom:"10px"}}>
           <div style={{ display: "flex",justifyContent: "center", alignItems: "center"}}>
           <h4>Video Frames</h4>
            </div>

            <div style={{ display: "flex",justifyContent: "center", alignItems: "center"}}>
              
              <div style={{width:"100%", marginRight:"5px"}}>
              <Button style={{width:"100%",height:"100%"}} variant="contained" onClick={()=>{HandleBack()}} startIcon={<ArrowBackIosIcon />}> Back </Button>
              </div>
            
              <div style={{width:"100%" , marginLeft:"5px"}}>
              <Button style={{width:"100%",height:"100%"}} variant="contained" onClick={()=>{HandleNext()}} startIcon={<ArrowForwardIosIcon />}> Next </Button>  
              </div>
              </div>
          </MainCard>

          <MainCard>
          <Container>
       
            <Row>
              
              {FramesLoading?<div >
                <p>Processing The Video frames...</p>               
                <LinearSpinner/>
              </div>:
              <>
              {Frames.map((Local_frameurl)=>{
            return(
              <Col xs={4} md={2}>
            {SelectedThumbnail==Local_frameurl?
            <div className='ThumbnailSelectBox' style={{border:"5px solid #009be5"}} onClick={()=>{Set_SelectedThumbnail(Local_frameurl)}}>
            <img className='ThumbnailSelectBoxImage' src={Local_frameurl}/>
            <div className='SelectedVideoThumbnailIcon'></div>           
            </div>:
            <div className='ThumbnailSelectBox' onClick={()=>{Set_SelectedThumbnail(Local_frameurl)}}>
            <img className='ThumbnailSelectBoxImage' src={Local_frameurl}/>           
            </div>
          }
            
            </Col>
            )
                        })}
              </>
               } 
            </Row>
         
          </Container>
            
            
           
          </MainCard>   
        </DialogContent>

      </Dialog>
    </div>
  );
}


