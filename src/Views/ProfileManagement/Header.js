import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {AppContext} from "../../context/Context"
import { ProfileSelectedTabActions,ProfileTabs } from '../../variables/variables';
import { Avatar } from "@nextui-org/react";


    
const lightColor = 'rgba(255, 255, 255, 0.7)';


function Header(props) {
  
  const { onDrawerToggle } = props;
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  let [TabMenu,SetTabMenu]=React.useState(GlobalState.ProfileSelectedTab==ProfileTabs.ProfileTab?0:1)
  
  let [PicStatus,SetPicStatus]=React.useState();
  React.useEffect(()=>{
    if(GlobalState.UserProfilePicture=="")
    {
      
      SetPicStatus("/static/images/avatar/1.jpg")
    }
    else
    {
      
      SetPicStatus(GlobalState.UserProfilePicture)
      
    }
    
  },[GlobalState])
  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            
            <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item style={{marginTop:"1rem"}}>
             <p>{GlobalState.FirstName+" "} {GlobalState.LastName}</p>
           
            </Grid>
            <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <IconButton color="inherit" sx={{ p: 0.5 }}>
          
        <Avatar
          size="lg"
          src={PicStatus} 
          color="primary"
          bordered
          squared
        />
              
              </IconButton>
            </Grid>
           

          </Grid>
          
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                Profile Management
              </Typography>
            </Grid>
           
            <Grid item>
              <Tooltip title="Help">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 0 }}>
        <Tabs  value={TabMenu} textColor="inherit">
          <Tab  label="Profile"  onClick={(e)=>{Dispatch({type:ProfileSelectedTabActions.SelectProfile})
          SetTabMenu(0)
        }}/>
          <Tab label="Security"onClick={()=>{Dispatch({type:ProfileSelectedTabActions.SelectSecurity})
        SetTabMenu(1)
        }} />
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}



export default Header;