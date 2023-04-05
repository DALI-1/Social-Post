import * as React from 'react';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import {
  Scheduler,
  DayView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
;

export const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'multilineTextEditor') {
    return null;
  } return <AppointmentForm.TextEditor {...props} />;
};

 export const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onCustomFieldChange = (nextValue) => {
    onFieldChange({ customField: nextValue });
  };

  const {GlobalState,Dispatch}=React.useContext(AppContext)
  Dispatch({type:variables.PostSelectedTabActions.SelectAddPost})
  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}>
     

    </AppointmentForm.BasicLayout>
  );
};