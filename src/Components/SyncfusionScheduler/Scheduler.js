import * as React from 'react';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import { ScheduleComponent, Day, Week, WorkWeek,
   Month, Agenda, Inject,MonthAgenda, TimelineViews,
    TimelineMonth,ViewsDirective, ViewDirective  }
 from '@syncfusion/ej2-react-schedule';
 import { extend } from '@syncfusion/ej2-base';
 import CustomCell from "./CustomCell"
 import * as APILib from "../../libs/APIAccessAndVerification"
import {  toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
const TransitionLeft = React.forwardRef(function Transition(props, ref) {
  return <Slide  direction="left" ref={ref} {...props} />;
});

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
        <DialogTitle> Post Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to delete the Selected post?
          </DialogContentText>
       </DialogContent>

        <DialogActions>
          <Button variant="outlined"color="primary"  onClick={handleClose}>No, I don't want to</Button>
          <Button variant="outlined"color="error"  onClick={handlePostDelete}>Yes, Delete the Post</Button>
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
const handleClose = () => {
  setOpen(false);
  setModifyPostShow(!ModifyPostShow)
};
const HandleModifyPost=()=>
{
  variables.PostGlobalVariables.EDITPOST_SelectedPostID=postid
  Dispatch({ type: variables.PostSelectedTabActions.SelectEditPost });
  handleClose()
}

const HandleDeletePost=()=>
{
  setDeletePostShow(!DeletePostShow)
  handleClose()
}
const HandlePreviewPost=()=>
{
  variables.PostGlobalVariables.EDITPOST_SelectedPostID=postid
  Dispatch({ type: variables.PostSelectedTabActions.SelectPreviewPost });
  handleClose()
}
return (
  <>
    <div>      
      <Dialog fullWidth={true} open={open} TransitionComponent={TransitionUp} >
        <DialogTitle> Post Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Select What do you wanna do with the selected Post.
          </DialogContentText>
       </DialogContent>

        <DialogActions>
        <Button variant="outlined"color="primary"  onClick={handleClose}>Cancel</Button>
        <Button variant="outlined"color="primary"  onClick={HandlePreviewPost}>Preview Post</Button>
          <Button variant="outlined"color="primary"  onClick={HandleModifyPost}>Modify Post</Button>
          <Button variant="outlined"color="error"  onClick={HandleDeletePost}>¨Delete Post</Button>
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
  
  const [ModifyPostShow,setModifyPostShow]=React.useState(false)
  const [DeletePostShow,setDeletePostShow]=React.useState(false)
  const [SelectedPostID,SetSelectedPostID]=React.useState(false)
  const fieldsData = {
    id: 'Id',
    subject: { name: 'Subject' },
    isAllDay: { name: 'IsAllDay' },
    startTime: { name: 'StartTime' },
    endTime: { name: 'EndTime' }
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
      if(post.isDeleted==false)
      {
        localdata=[...localdata,{
          Id: post.id,
          Subject: 'Post - '+post.id,
          StartTime: new Date(post.postDate),
          EndTime: new Date(post.postDate),
          IsAllDay: false,
          Status: "Completed",
          Priority: 'High',
          //RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        }]
      }        
    })
    setdata(localdata)
  }
});
},[])  
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

const eventSettings = { dataSource: extend([], data, null, true), fields: fieldsData }
  //eventsettings contanis the data of the scheduled posts we want to show
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