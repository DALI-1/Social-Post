import React from 'react';
const CustomAppointment = ({
  children, style, ...restProps
}) => (

    <PostCard  style={{
      ...style,
      backgroundColor: '#FFC107',
      borderRadius: '8px',
    }}/>
   
  
);

export default CustomAppointment