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

import AddGroupContent from './AddGroupContent';
import EditGroupContent from './EditGroupContent';

import {AppContext} from "../../context/Context"
import { ProfileTabs,GroupTabs } from '../../variables/variables';


export default function Content() {
    const {GlobalState,Dispatch}=React.useContext(AppContext)
    
  return (
    <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Toolbar>
          
        </Toolbar>
      </AppBar>
      <Typography component={'span'} sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
        {GlobalState.GroupSelectedTab==GroupTabs.AddGroup&&<AddGroupContent/>}
        {GlobalState.GroupSelectedTab==GroupTabs.EditGroupTab&&<EditGroupContent/>}
        
      </Typography>
    </Paper>
  );
}