import * as React from 'react';
import {AppContext} from "../../../context/Context"
import * as variables from "../../../variables/variables"
import { ScheduleComponent, Day, Week, WorkWeek,
   Month, Agenda, Inject,MonthAgenda, TimelineViews,
    TimelineMonth,ViewsDirective, ViewDirective  }
 from '@syncfusion/ej2-react-schedule';
 import { Internationalization, extend } from '@syncfusion/ej2-base';
 import CustomCell from "./CustomCell"
 import * as APILib from "../../../libs/APIAccessAndVerification"
import {  toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import * as PermissionLib from "../../../libs/PermissionsChecker"
const TransitionLeft = React.forwardRef(function Transition(props, ref) {
  return <Slide  direction="left" ref={ref} {...props} />;
});
const instance = new Internationalization();
const TransitionUp = React.forwardRef(function Transition(props, ref) {
  return <Slide  direction="up" ref={ref} {...props} />;
});
//---------------------------------This Dialog here shows the delete confirmation for the Post-----------------------------//
export function DeleteConfirmDialog({DeletePostShow,setDeletePostShow,postid,data,setdata}) {
  const [open, setOpen] = React.useState(true);
const handleClose = () => {
  setOpen(false);
  setDeletePostShow(!DeletePostShow)
};
const handlePostDelete=()=>
{

  var JsonObject = {  
    postID: postid
 };

let JsonObjectToSend = JSON.stringify(JsonObject);
let url2 =
  process.env.REACT_APP_BACKENDURL + 
  process.env.REACT_APP_DELETEPOST
let UserToken = window.localStorage.getItem("AuthToken");
let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
APIResult.then((result) => {
  if (result.errorCode == undefined) {
    if(result.successCode=="Post_Removed")
    {
      toast.success("The Selected Post Is deleted.", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",     
      });
      setdata(data.filter(p=>p.Id!=postid))
      handleClose()
      
    } 
  }

});

}
return (
  <>
    <div>      
      <Dialog fullWidth={true} open={open} TransitionComponent={TransitionLeft} >
        <DialogTitle> Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to delete the Selected post?<br></br>
            
          <strong>
            Note: Deleting the post of an already published post is not gonna delete the posts from Facebook or instagram.

          </strong>
          
          </DialogContentText>
       </DialogContent>
 
        <DialogActions>
          <Button variant="outlined"color="primary" startIcon={<CancelIcon/>}  className='mx-2 m-1'  onClick={handleClose}>No, I don't want to</Button>
          <Button variant="outlined"color="error" startIcon={<DeleteForeverIcon/>}  className='mx-2 m-1' onClick={handlePostDelete}>Yes, Delete the Post</Button>
        </DialogActions>
      </Dialog>
    </div>
  </>  
);
}

//----------------------------Here is the dialog where we allow the user to choose either to Edit, Modify or delete a post-----------------
export function ModifyDialog({setModifyPostShow,ModifyPostShow,postid,data,setdata,DeletePostShow,setDeletePostShow}) {
  const [open, setOpen] = React.useState(true);
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  var EditPostisGranted=PermissionLib.ValidateAction(variables.MenuItems.Publish_MenuItem,variables.MenuItemActions.Edit_PostAction)
  var DeletePostisGranted=PermissionLib.ValidateAction(variables.MenuItems.Publish_MenuItem,variables.MenuItemActions.Remove_PostAction)
const handleClose = () => {
  setOpen(false);
  setModifyPostShow(!ModifyPostShow)
};
const HandleModifyPost=()=>
{
  if(EditPostisGranted)
  {
    variables.PostGlobalVariables.EDITPOST_SelectedPostID=postid
    Dispatch({ type: variables.PostSelectedTabActions.SelectEditPost });
    handleClose()
  }
  else
  {
    toast.error("You don't have the permission to Edit posts within this group, contact your administrator.", {
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

const HandleDeletePost=()=>
{
  if(DeletePostisGranted)
  {
    setDeletePostShow(!DeletePostShow)
    handleClose()
  }else
  {
    toast.error("You don't have the permission to Delete posts within this group, contact your administrator.", {
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
const HandlePreviewPost=()=>
{
  variables.PostGlobalVariables.EDITPOST_SelectedPostID=postid
  Dispatch({ type: variables.PostSelectedTabActions.SelectPreviewPost });
  handleClose()
}
var PostisEditable=false
data.map((post)=>{
  if(post.Id==postid)
  {
    if(post.Status=="Pending")
    {
      PostisEditable=true
    }
  }
})
return (
  <>
    <div>      
      <Dialog fullWidth={true} open={open} TransitionComponent={TransitionUp} >
        <DialogTitle> Post Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <strong>
            What do you want to do with the selected post?
          </strong>
          </DialogContentText>
       </DialogContent>
      
        <DialogActions>
        <Button variant="outlined"color="primary" startIcon={<CancelIcon/>}  onClick={handleClose}>Cancel</Button>
        <Button variant="outlined"color="primary" startIcon={<VisibilityIcon/>}  onClick={HandlePreviewPost}>Preview Post</Button>
      {PostisEditable&&<Button variant="outlined"color="primary" startIcon={<EditIcon/>}   onClick={HandleModifyPost}>Modify Post</Button>}
      <Button variant="outlined"color="error" startIcon={<DeleteForeverIcon/>}  onClick={HandleDeletePost}>¨Delete Post</Button>
        </DialogActions>
      </Dialog>
    </div>
  </>  
);
}

export default function App() {
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  const [data,setdata]=React.useState([
  ])
  
  const [IsDataLoaded,setIsDataLoaded]=React.useState(false)
  const [ModifyPostShow,setModifyPostShow]=React.useState(false)
  const [DeletePostShow,setDeletePostShow]=React.useState(false)
  const [SelectedPostID,SetSelectedPostID]=React.useState(false)
  const fieldsData = {
    id: 'Id',
    subject: { name: 'Subject' },
    isAllDay: { name: 'IsAllDay' },
    startTime: { name: 'StartTime' },
    endTime: { name: 'EndTime' },
    ContainFBPage:"FacebookExist",
    ContainINPage:"InstagramExist",
    Status:"Status"
    
}


function getTimeString(value) {
  return instance.formatDate(value, { skeleton: 'hm' });
}

const CustomAppointmentView=(props)=> {
  return (<div>
    <div style={{width:"100%",height:"100%"}}>
    {props.Status=="Pending"?<PendingIcon fontSize="small"/>
    :<CheckCircleIcon fontSize="small"/>}
       {" Post "+props.Subject+" - "+getTimeString(props.StartTime)+" - "}
    {props.FacebookExist&&<FacebookIcon fontSize="small"/>}
       {props.InstagramExist&&<InstagramIcon fontSize="small"/>}
    </div>
       
</div>)

}

React.useEffect(()=>{
  var JsonObject = {groupID: GlobalState.SelectedGroup.id }; 
let JsonObjectToSend = JSON.stringify(JsonObject);
let url2 =
  process.env.REACT_APP_BACKENDURL + 
  process.env.REACT_APP_GETGROUPPOSTS;
let UserToken = window.localStorage.getItem("AuthToken");
let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
APIResult.then((result) => {
  if (result.errorCode == undefined) {
    var localdata =[]
    result.result.map((post)=>{
      let ContainFBPage_Flag=false
      let ContainINPage_Flag=false;
      if(post.isDeleted==false)
      {
        //==================NOTE: Here we test if the Post contains FB page or IN Pages==================//
        //Test if it contains a FB Page or Insta Page
        post.pages.map((page)=>{

          //Setting flag to True if a FB page is found
          if(page.platformID=="1")
          {
            ContainFBPage_Flag=true
          }
          //Setting flag to True if a IN page is found
          if(page.platformID=="2")
          {
            ContainINPage_Flag=true
          }

        })
        //=========================END NOTE=============================================//
        localdata=[...localdata,{
          Id: post.id,
          Subject: post.id.toString(),
          StartTime: new Date(post.postDate),
          EndTime: new Date(post.postDate),
          IsAllDay: false,
          Status:post.isPosted?"Completed":"Pending",
          Priority: 'High',
          FacebookExist:ContainFBPage_Flag,
          InstagramExist:ContainINPage_Flag,
          

          //RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        }]
        

        
      }        
    })
    setdata(localdata)
    setIsDataLoaded(true)
  }
});
},[GlobalState.SelectedGroup])
 
const popupOpenHandler = (args) => {
 
  if(args.type=="EventContainer")
{/*args.cancel = true;  Cancel the default pop-up form*/  
}
if(args.type=="QuickInfo")
{
//args.cancel = true;  //Cancel the default pop-up form*/
if(args.data.Id==null)
{
  args.cancel = true;
}
else
{
  setModifyPostShow(true)
  SetSelectedPostID(args.data.Id)
}

}
if(args.type=="Editor")
{args.cancel = true;  //Cancel the default pop-up form*/

 /* var pop=document.getElementById(args.element.id)
  pop.style.width="70%"
  pop.style.height="70%"
  pop.style.zIndex = "0";*/
}
  else
  { 
    /*args.cancel = true;  Cancel the default pop-up form*/

  }
};

const eventSettings = { dataSource: extend([], data, null, true), fields: fieldsData,template: CustomAppointmentView }
  //eventsettings contanis the data of the scheduled posts we want to show
  //data loaded
  if(IsDataLoaded)
  {
    return (<>
      <ScheduleComponent
        selectedDate= {new Date()}
       eventSettings={eventSettings}
       cellTemplate={CustomCell}
       popupOpen={popupOpenHandler}
       width='100%' height='700px' currentView='Month'
       allowResizing={true}
       cssClass='schedule-cell-dimension'
       
       >  
       <ViewsDirective>
   
               <ViewDirective option='Day' />
               <ViewDirective option='Week' />
               <ViewDirective option='Month' />
               <ViewDirective option='Agenda' />
               
              {/*
               <ViewDirective option='MonthAgenda' />
               <ViewDirective option='TimelineDay' />
               <ViewDirective option='TimelineWeek' />
               <ViewDirective option='TimelineMonth' />
               */
              }
               
             </ViewsDirective>
       <Inject services={[Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth ]} />
       </ScheduleComponent>
     {ModifyPostShow&&<ModifyDialog ModifyPostShow={ModifyPostShow} setModifyPostShow={setModifyPostShow} postid={SelectedPostID} setdata={setdata} data={data} DeletePostShow={DeletePostShow} setDeletePostShow={setDeletePostShow}/>}
     {DeletePostShow&&<DeleteConfirmDialog DeletePostShow={DeletePostShow} setDeletePostShow={setDeletePostShow} postid={SelectedPostID} setdata={setdata} data={data}/>}
     </>
      
     );
  }
  //Data not loaded
  else
  {

    return( <Box sx={{ width: '100%',padding:"0.5rem" }}>
    <LinearProgress />
  </Box>)
  }
  

}