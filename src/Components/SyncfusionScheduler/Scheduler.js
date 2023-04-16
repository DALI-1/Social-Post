import * as React from 'react';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
 import CustomCell from "./CustomCell"
 import * as APILib from "../../libs/APIAccessAndVerification"
import {  toast } from 'react-toastify';
export default function App() {
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  const [data,setdata]=React.useState([
    {
      Id: 1,
      Subject: 'Meeting - 1',
      StartTime: new Date(2018, 1, 15, 10, 0),
      EndTime: new Date(2018, 1, 15, 10, 0),
      IsAllDay: false,
      Status: 1,
      Priority: 'High'
    },
    {
      Id: 2,
      Subject: 'Meeting - 2',
      StartTime: new Date(2018, 1, 17, 10, 0),
      EndTime:  new Date(2018, 1, 17, 10, 0),
      IsAllDay: false,
      Status: 1,
      Priority: 'High'
    }
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
    var localdata =[...data]
    result.result.map((post)=>{
      localdata=[...localdata,{
        Id: post.id,
        Subject: 'Post - '+post.id,
        StartTime: new Date(post.postDate),
        EndTime: new Date(post.postDate),
        IsAllDay: false,
        Status: "Completed",
        Priority: 'High'
      }]

    })
    setdata(localdata)
    
    
  }
});
},[])  
const popupOpenHandler = (args) => {
  args.cancel = true; // Cancel the default pop-up form
  // Create and display your custom form
  // Example: display a simple alert box
  //Dispatch({type:variables.PostSelectedTabActions.SelectAddPost})
};
const eventSettings = { dataSource: data, fields: fieldsData }


  //eventsettings contanis the data of the scheduled posts we want to show
  return (
    <ScheduleComponent selectedDate= {new Date()}
    eventSettings={eventSettings}
    cellTemplate={CustomCell}
    popupOpen={popupOpenHandler}
    >
     
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
        
    </ScheduleComponent>
  );
}