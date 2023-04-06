import React from 'react';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import PostCard from "../PostCardComponent/PostComp"
const CustomAppointment = ({
  children, style, ...restProps
}) => (
  /*<Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: '#FFC107',
      borderRadius: '8px',
    }}
  >{children}</Appointments.Appointment>*/
    <PostCard  style={{
      ...style,
      backgroundColor: '#FFC107',
      borderRadius: '8px',
    }}/>
   
  
);

export default CustomAppointment