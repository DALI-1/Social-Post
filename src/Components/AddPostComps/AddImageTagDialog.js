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
import './AddImageTagDialog.css'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/material';
import {  toast } from 'react-toastify';
import { Avatar } from "@nextui-org/react";
import * as APILib from "../../libs/APIAccessAndVerification"
import * as variables from "../../variables/variables"
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({SetShowImageTagDialog,SelectedAssets}) {

  //-------------------------------------NOTE:Here you find the Component states and variables---------------------------------///
  let [ListOfPossible_Users_To_Tag,setListOfPossible_Users_To_Tag]=React.useState([])
  let [ListOfBoxes,setListOfBoxes]=React.useState([])
  let [current_ScrollTop,setcurrent_ScrollTop]=React.useState(0);
  let [current_ScrollLeft,setcurrent_ScrollLeft]=React.useState(0);
  let current_X=React.useRef(0);
  let current_Y=React.useRef(0);
  //-------------------------------------END NOTE---------------------------------///

  //----------------------------INFO: INITIALIZATIONG the PAGE PART-------------------------------//
  //--------------getting the list of possible mentions-------------//
  React.useEffect(()=>
  {
    var JsonObject = {};
  let JsonObjectToSend = JSON.stringify(JsonObject);
  let url2 =process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_GETTAGABLEPLATFORMACCOUNTS;
  let UserToken = window.localStorage.getItem("AuthToken");
  let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
  APIResult.then((response) => {
    if (response.errorCode == undefined) {
      if(response.successCode=="TagalePlatformAccounts_fetched!")
      {
        let Temp_AccList=[]
        response.result.map((Acc)=>{
          Temp_AccList=[...Temp_AccList,{UserID:Acc.platformAccountID,Name:Acc.cachedData_Name,imgurl:Acc.cachedData_PictureURL}]
          setListOfPossible_Users_To_Tag(Temp_AccList)
        })
      }
    }
      
  })
   
  },[])

   //--------------Initializing the Page with Tags if it has any-------------//
React.useEffect(()=>{


  variables.PostGlobalVariables.POST_AssetsTags.map((Tag)=>{

    //---------We test if we already have tags for this specific Image-------------//
    if(Tag.Id==SelectedAssets[0].value)
    {
      let Temp_ListOfBoxes=[]
      Tag.Assetags.map((tag)=>{
        let BoxObj={
          BoxID:hashRandom(),
          Screen_x:tag.Screen_x,
          Screen_y:tag.Screen_y,
          ScrollTopValue:tag.ScrollTopValue,
          ScrollLeftValue:tag.ScrollLeftValue,
          Image_X:tag.Tag_X,
          Image_Y:tag.Tag_Y,
          TaggedPersonID:tag.TaggedUserID,
          TaggedPersonName:tag.TaggedPersonName,
          TaggedPersonPic:tag.TaggedPersonPic
        }
        Temp_ListOfBoxes=[...Temp_ListOfBoxes,BoxObj]

      })
      setListOfBoxes(Temp_ListOfBoxes)
    }
  })
},[])
  //----------------------------INFO: END OF INITIALIZATION-------------------------------//////
    //this is used for tags
    const handleClose = () => {
      SetShowImageTagDialog(false)
    };
  const HandleXYUpdating=((e)=>{
    //-----------NOTE: Here we get the X and Y that the mouse is hovering on Right now and save it (usref=>Won't cause a re-render for optimization)-----------------// 
  current_X=e.clientX
  current_Y=e.clientY
  })
const HandleBoxCreation=((e)=>{
  //------NOTE: Here I simply got the container's offset so I can remove these from the X and Y so that I get the real X Y for the image---------//
  let TagImageDiv=document.getElementById("TagImageID")
  let BoxObj={BoxID:hashRandom(),Screen_x:current_X,Screen_y:current_Y,ScrollTopValue:current_ScrollTop,ScrollLeftValue:current_ScrollLeft,Image_X:current_X-TagImageDiv.offsetLeft+current_ScrollLeft,Image_Y:current_Y-TagImageDiv.offsetTop+current_ScrollTop,TaggedPersonID:null,TaggedPersonName:null,TaggedPersonPic:null}
setListOfBoxes([...ListOfBoxes,BoxObj])
  })

  const HandleBoxesUpdateOnScroll=((e)=>
  {
    //---------NOTE: Here we update the scroll Top, left values which will update all the boxes to either show or not----------//
    setcurrent_ScrollTop(e.target.scrollTop)
    setcurrent_ScrollLeft(e.target.scrollLeft)
  })
 
  const handleBoxRemoval=((BoxID_ToDelete)=>{  
     //-------------Updating Tags Locally------------//
    setListOfBoxes( ListOfBoxes.filter((item)=>item.BoxID!=BoxID_ToDelete))

    let Temp_Tags=[]
    ListOfBoxes.filter((item)=>item.BoxID!=BoxID_ToDelete).map((Tag)=>{

      Temp_Tags=[...Temp_Tags,
        {TaggedUserID:Tag.TaggedPersonID,
          Tag_X:Tag.Image_X,
          Tag_Y:Tag.Image_Y,
          Screen_x:Tag.Screen_x ,
          Screen_y:Tag.Screen_y,
          ScrollTopValue:Tag.ScrollTopValue,
          ScrollLeftValue:Tag.ScrollLeftValue,
          TaggedPersonPic:Tag.TaggedPersonPic,
          TaggedPersonName:Tag.TaggedPersonName,
        }]
        
    })

    let OldTagObj=null
    variables.PostGlobalVariables.POST_AssetsTags.map((TaggedImage)=>{

      if(TaggedImage.Id==SelectedAssets[0].value)
      {
        OldTagObj=TaggedImage  
      }
    })

    //-------------Case of an Asset Already tagged this means we need to update it with the removal------------//
    if(OldTagObj!=null)
    {
      //Here I simply removed it from the List since it's about to get updated//
      variables.PostGlobalVariables.POST_AssetsTags=variables.PostGlobalVariables.POST_AssetsTags.filter((tag)=>tag.Id!=OldTagObj.Id)
       //-------------Adding the new Tag for the Asset------------//
       if(Temp_Tags.length>0)
       {
        variables.PostGlobalVariables.POST_AssetsTags=[...variables.PostGlobalVariables.POST_AssetsTags,{Id:SelectedAssets[0].value,Asset_ID:SelectedAssets[0].AssetId,Assetags:Temp_Tags}]
       }
   
    }

    toast.info("Tag Removed !", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  })
  const HandleTagSelected=((SelectedUser,UpdatedBoxID)=>{
   let UpdatedList=ListOfBoxes.filter((item)=>item.BoxID!=UpdatedBoxID) 
  let UpdatedBox=ListOfBoxes.filter((item)=>item.BoxID==UpdatedBoxID)
  UpdatedBox[0].TaggedPersonID=SelectedUser.UserID
  UpdatedBox[0].TaggedPersonName=SelectedUser.Name
  UpdatedBox[0].TaggedPersonPic=SelectedUser.imgurl
      UpdatedList=[...UpdatedList,UpdatedBox[0]]
      setListOfBoxes(UpdatedList)
  })
  const HandleAddTags=(()=>{

    let Empty_Tags_ExistFlag=false

    ListOfBoxes.map((boxitem)=>{

      if(boxitem.TaggedPersonID==null)
      {
        Empty_Tags_ExistFlag=true; 
      }
    })

    //-----Here is the case where there is some unselected boxes---//
    if(Empty_Tags_ExistFlag)
    {
      toast.info("You have unspecified tags in your photo, please specifiy the targetted person or delete them.", {
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
    //-------------The case where every box is selected to someone----------//
    else
    {
      let Temp_Tags=[]
      ListOfBoxes.map((Tag)=>{

        Temp_Tags=[...Temp_Tags,
          {TaggedUserID:Tag.TaggedPersonID,
            Tag_X:Tag.Image_X,
            Tag_Y:Tag.Image_Y,
            Screen_x:Tag.Screen_x ,
            Screen_y:Tag.Screen_y,
            ScrollTopValue:Tag.ScrollTopValue,
            ScrollLeftValue:Tag.ScrollLeftValue,
            TaggedPersonPic:Tag.TaggedPersonPic,
            TaggedPersonName:Tag.TaggedPersonName,
          }]
          
      })

      let OldTagObj=null
      variables.PostGlobalVariables.POST_AssetsTags.map((TaggedImage)=>{

        if(TaggedImage.Id==SelectedAssets[0].value)
        {
          OldTagObj=TaggedImage  
        }
      })

      //-------------Case of an Asset Already tagged------------//
      if(OldTagObj!=null)
      {
        //Here I simply removed it from the List since it's about to get updated//
        variables.PostGlobalVariables.POST_AssetsTags=variables.PostGlobalVariables.POST_AssetsTags.filter((tag)=>tag.Id!=OldTagObj.Id)
      }
      //-------------Adding the new Tag for the Asset------------//
      variables.PostGlobalVariables.POST_AssetsTags=[...variables.PostGlobalVariables.POST_AssetsTags,{Id:SelectedAssets[0].value,Asset_ID:SelectedAssets[0].AssetId,Assetags:Temp_Tags}]
      console.log(variables.PostGlobalVariables.POST_AssetsTags)

      toast.info("Tags saved !", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      handleClose();
    }

    
  })
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
              Tag Photo
            </Typography>         
            <Button  style={{marginRight:"1rem"}} color="inherit" variant="outlined" startIcon={<HighlightOffIcon />} onClick={handleClose}>Cancel</Button>
          <Button  style={{marginLeft:"1rem"}} color="inherit" variant="outlined" startIcon={<BeenhereIcon />} onClick={HandleAddTags}>Add Selected Tags</Button>
          </Toolbar>
        </AppBar>
        <DialogContent onScroll={HandleBoxesUpdateOnScroll}>
       <div className='ImageContainer'style={{display: "flex",justifyContent: "center", alignItems: "center"}} >
        <div id="TagImageID" className='Tag_Image'>
        <img onMouseMove={HandleXYUpdating} onClick={HandleBoxCreation}  src={SelectedAssets[0].src} alt="image" />
           {/*-----------INFO:-25 is because the box height/width is 50, so the center is -25 if u want his cursor to tog the middle of the box -----------*/}
           {
            ListOfBoxes.map((BoxElement)=>{
              //-------The Case where we just placed a box and didn't tag anyone-------------/
              if(BoxElement.TaggedPersonID==null)
              {
                return(<> 
                <div className='Tagbox'
                onDoubleClick={()=>{handleBoxRemoval(BoxElement.BoxID)}}
                style={{top: `${BoxElement.Screen_y+BoxElement.ScrollTopValue-25-current_ScrollTop}px`,left: `${BoxElement.Screen_x+BoxElement.ScrollLeftValue-25-current_ScrollLeft}px` }} >               
                </div>
<div className='TagPopup' style={{ minWidth:"200px",top: `${BoxElement.Screen_y+BoxElement.ScrollTopValue-25-current_ScrollTop}px`,left: `${BoxElement.Screen_x+BoxElement.ScrollLeftValue-25-current_ScrollLeft}px`,display:"inline-block" }}>
          <Autocomplete
          onChange={(event, SelectedUser)=>{
            HandleTagSelected(SelectedUser,BoxElement.BoxID)
          }}
          key={BoxElement.BoxID}
          id={BoxElement.BoxID}
          options={ListOfPossible_Users_To_Tag}
          getOptionLabel={(option) => option.Name}
          isOptionEqualToValue={(option)=>option.UserID}
          renderOption={(props, option, { selected }) => {
            return(
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                 <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
          <img
            loading="lazy"
            width="20"
            src={option.imgurl}
            alt=""
          /> 
          {option.Name}    
            </Box>
          )}}
          style={{ width: "auto" }}
          renderInput={(params) => (
            <TextField {...params}  placeholder="Select the User you want to Tag" />
          )}
          />
  
  </div>
</>)

              }
              if(BoxElement.TaggedPersonID!=null)
              {
                return(<> 
                  <div className='TagInfo' style={{top: `${BoxElement.Screen_y+BoxElement.ScrollTopValue-current_ScrollTop}px`,left: `${BoxElement.Screen_x+BoxElement.ScrollLeftValue-25-current_ScrollLeft}px` }}>
                  <div className="triangle"></div>
                  <Container>
                    <Row>
                      <Col>
                      <Avatar style={{marginTop:"0.3rem"}} size="lg" src={BoxElement.TaggedPersonPic} color="gradient" rounded  zoomed/>
                      </Col>
                      <Col >
                      <p style={{marginTop:"0.3rem"}}>{BoxElement.TaggedPersonName}</p>
                      </Col>
                      <Col>
                      <IconButton color="primary" key={BoxElement.BoxID} aria-label="delete tag" onClick={()=>{handleBoxRemoval(BoxElement.BoxID)}}>
                          <HighlightOffIcon />
                        </IconButton>
                      </Col>
                    </Row>
                  </Container>
                   </div>
                  </>)
              }
                })}
       </div>
       
        </div> 
        </DialogContent>

      </Dialog>
    </div>
  );
}
