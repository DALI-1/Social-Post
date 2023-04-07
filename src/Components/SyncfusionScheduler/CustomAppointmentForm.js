import * as React from 'react';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"


 export const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  
  return (
    <div></div>
  );
};