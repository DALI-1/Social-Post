import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ProfileTabs,UserInformations } from '../../variables/variables';
import * as variables from '../../variables/variables';
import {AppContext} from "../../context/Context"
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import ManagePageContent from "./ManagePageContent";

export default function Content() {
  const {GlobalState,Dispatch}=React.useContext(AppContext)

  return (

 <>
    {!GlobalState.HeadSpinner?<>

     {UserInformations.info!=null?<>
      <Container>
{GlobalState.NavigatorSelectedTab==variables.NavigatorTabs.ManagePagesTab&&<ManagePageContent/>}







   
</Container>
     
     </>:<> <div className="card-body text-center"><p>Failed to Load Data please retry again or check your connection</p></div></>}
     
    </>:<><div className="card-body text-center"><p>Please wait, loading data....</p></div></>}
     
     
    </>
      
  );
}