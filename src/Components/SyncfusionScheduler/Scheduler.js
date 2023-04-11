import * as React from 'react';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
 import CustomCell from "./CustomCell"

export default function App() {
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  const data=[
    {
      Id: 1,
      Subject: 'Meeting - 1',
      StartTime: new Date(2018, 1, 15, 10, 0),
      EndTime: new Date(2018, 1, 16, 12, 30),
      IsAllDay: false,
      Status: 'Completed',
      Priority: 'High'
    },
  ];

  const fieldsData = {
    id: 'Id',
    subject: { name: 'Subject' },
    isAllDay: { name: 'IsAllDay' },
    startTime: { name: 'StartTime' },
    endTime: { name: 'EndTime' }
}

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