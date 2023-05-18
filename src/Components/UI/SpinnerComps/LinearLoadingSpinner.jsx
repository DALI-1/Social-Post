import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


/*
import LinearLoadingSpinner from '../../components/LinearLoadingSpinner'
import {HeaderSpinnerActions,HeaderSpinner}  from '../../variables/variables'
Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})
Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
*/
export default function LinearIndeterminate() {
  return (
   <div style={{margin:"0.1px"}}>
    <LinearProgress />
   </div>
     
    
  );
}