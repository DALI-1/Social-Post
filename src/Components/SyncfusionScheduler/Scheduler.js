import * as React from 'react';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
 import CustomCell from "./CustomCell"
 import * as APILib from "../../libs/APIAccessAndVerification"
import {  toast } from 'react-toastify';

import AddPost from "../../Views/PostManagement/AddPostContent"
export default function App() {
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  const [data,setdata]=React.useState([
  ])

  //
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
 
  console.log(args)
  if(args.type=="EventContainer")
{/*args.cancel = true;  Cancel the default pop-up form*/  
}
if(args.type=="QuickInfo")
{
/*args.cancel = true;  Cancel the default pop-up form*/
  
  //pop.style.width = '1000px';
}
if(args.type=="Editor")
{/*args.cancel = true;  Cancel the default pop-up form*/
console.log(args)
  var pop=document.getElementById(args.element.id)
  console.log(pop)
  pop.style.width="70%"
  pop.style.height="70%"
  pop.style.zIndex = "0";
}
  else
  { 
    /*args.cancel = true;  Cancel the default pop-up form*/

  }
};
const eventSettings = { dataSource: data, fields: fieldsData }

const appointmentTemplate = (props) => {
  console.log(props)
  return (<AddPost/>
   
  );
};

  //eventsettings contanis the data of the scheduled posts we want to show
  return (
    <ScheduleComponent selectedDate= {new Date()}
    eventSettings={eventSettings}
    appointmentTemplate={props => (
      <div>
        <p>hiii</p>
      </div>
    )}
    editorTemplate={
      appointmentTemplate
    }
    cellTemplate={CustomCell}
    popupOpen={popupOpenHandler}
    allowMultiRowSelection={false}
    >  
        <Inject services={[Day, Week,WorkWeek, Month, Agenda]}/>
    </ScheduleComponent>
  );

}