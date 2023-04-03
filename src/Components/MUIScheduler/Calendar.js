import React, { useState } from "react";
import PropTypes from "prop-types";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import CustomTaskView from './CustomAppointmentForm';
import CustomAppointment from "./CustomAppointment"
import {Header,Content,CommandButton} from "./CustomAppointmentToolTip"
import {BasicLayout,TextEditor} from "./CustomAppointmentForm"
import "./styles.css"
import {
  Scheduler,
  MonthView,
  WeekView,
  DayView,
  Appointments,
  AllDayPanel,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentTooltip,
  TodayButton,
  ConfirmationDialog,
  CurrentTimeIndicator,
  DragDropProvider,
  AppointmentForm
} from "@devexpress/dx-react-scheduler-material-ui";


function Calendar(props) {
  const { data, onCurrentDateChange, onCommitChanges } = props;

  const [currentViewName, setCurrentViewName] = useState("Week");

 function  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };
    });
  }

  return (
    <>
    <Scheduler data={data}>
      <ViewState
        currentViewName={currentViewName}
        onCurrentViewNameChange={setCurrentViewName}
        onCurrentDateChange={onCurrentDateChange}
      />
      <EditingState onCommitChanges={commitChanges} />
      <ConfirmationDialog />
      <DayView startDayHour={0.0} endDayHour={24.0} cellDuration={60} />
      <WeekView startDayHour={0.0} endDayHour={24.0} cellDuration={60} />
      <MonthView startDayHour={0.0} endDayHour={24.0} />
      {/*This here is used to show the custom appointment in the calendar */}
      <Appointments appointmentComponent={CustomAppointment} />
      <AllDayPanel />
      <Toolbar />
      <DateNavigator />
      <TodayButton />
      <ViewSwitcher />
      
{/*This here is used to show the cusom appointment tooltip */}
      <AppointmentTooltip
            headerComponent={Header}
            contentComponent={Content}
            commandButtonComponent={CommandButton}
            showCloseButton
          />
      <DragDropProvider />
      <CurrentTimeIndicator
        shadePreviousCells={true}
        shadePreviousAppointments={true}
        updateInterval={10000}
      />
      {/*This here is used to show the add new post form */}
      <AppointmentForm
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}
          />

      
    </Scheduler>
   
   </>
  );
}

Calendar.propTypes = {
  data: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  onCurrentDateChange: PropTypes.func.isRequired,
  onCommitChanges: PropTypes.func.isRequired
};

Calendar.defaultProps = {
  data: []
};

export default Calendar;
