import React from 'react';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
const CustomAppointment = ({
  children, style, ...restProps
}) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: '#FFC107',
      borderRadius: '8px',
    }}
  >
    {children}
    <p>
      Hello!
    </p>
  </Appointments.Appointment>
);

export default CustomAppointment