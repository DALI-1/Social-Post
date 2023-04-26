import * as React from 'react';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
 import CustomCell from "./CustomCell"
 import * as APILib from "../../libs/APIAccessAndVerification"
import {  toast } from 'react-toastify';
import AddPost from "../../Views/PostManagement/AddPostContent"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
export function ModifyDialog({setModifyPostShow,ModifyPostShow,postid,data,setdata}) {
  const [open, setOpen] = React.useState(true);
  const {GlobalState,Dispatch}=React.useContext(AppContext)

const handleClose = () => {
  setOpen(false);
  setModifyPostShow(false)
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
      <Dialog fullWidth={true} open={open} >
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

export default function App() {
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  const [data,setdata]=React.useState([
  ])
  const [ModifyPostShow,setModifyPostShow]=React.useState(false)
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
const eventSettings = { dataSource: data, fields: fieldsData }
  //eventsettings contanis the data of the scheduled posts we want to show
  return (<>
   <ScheduleComponent
     selectedDate= {new Date()}
    eventSettings={eventSettings}
    cellTemplate={CustomCell}
    popupOpen={popupOpenHandler}
    >  
        <Inject services={[Day, Week,WorkWeek, Month, Agenda]}/>
    </ScheduleComponent>
  {ModifyPostShow&&<ModifyDialog ModifyPostShow={ModifyPostShow} setModifyPostShow={setModifyPostShow} postid={SelectedPostID} setdata={setdata} data={data}/>}
  </>
   
  );

}