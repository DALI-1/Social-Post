import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LinearLoadingSpinner from '../../components/UI/SpinnerComps/LinearLoadingSpinner'
import {AppContext} from "../../context/Context"
import { GroupSelectedTabActions,GroupTabs } from '../../variables/variables';
import { Avatar } from "@nextui-org/react";
import EditIcon from '@mui/icons-material/Edit';
import TuneIcon from '@mui/icons-material/Tune';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
    



function Header(props) {
  
  const { onDrawerToggle } = props;
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  let [TabMenu,SetTabMenu]=React.useState(0)
  
  let [PicStatus,SetPicStatus]=React.useState();
  React.useEffect(()=>{
    if(GlobalState.UserProfilePicture==="")
    {
      
      SetPicStatus("https://firebasestorage.googleapis.com/v0/b/socialpost-58454.appspot.com/o/PlatformsLogo%2Ffavicon.ico.png?alt=media&token=67706ea6-c3ae-4cdd-bb9e-4f61c39d0505")
    }
    else
    {
      
      SetPicStatus(GlobalState.UserProfilePicture)
      
    }

    if(GlobalState.GroupSelectedTab===GroupTabs.ManageGroupTab)
    {
      SetTabMenu (0)
    }
    
    if(GlobalState.GroupSelectedTab===GroupTabs.AddGroup)
    {
      SetTabMenu(1) 
    }
    
    if(GlobalState.GroupSelectedTab===GroupTabs.EditGroupTab)
    {
      SetTabMenu(1)
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
                Groups Management
              </Typography>
            </Grid>
           
            <Grid item>
              <Tooltip title="Social Post is an application that lets you schedule, create posts efficently within an organized group, pages management.">
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
         
           <Tab  label={<><TuneIcon/> <p>Manage Group</p></>}  onClick={(e)=>{Dispatch({type:GroupSelectedTabActions.SelectManageGroup})
           SetTabMenu(0)
         }}/>
        
     
          {GlobalState.GroupSelectedTab===GroupTabs.AddGroup&&<Tab  label={<><GroupAddIcon/> <p>Add SubGroup</p></>}  onClick={(e)=>{Dispatch({type:GroupSelectedTabActions.SelectAddGroup})
          SetTabMenu(1)
        }}/>}
     
         {
          GlobalState.GroupSelectedTab===GroupTabs.EditGroupTab&&
          <Tab label={<><EditIcon/> <p>Edit Group</p></>} onClick={()=>{Dispatch({type:GroupSelectedTabActions.SelectEditGroup})
        SetTabMenu(2)
        }} />
}
        </Tabs>
      </AppBar>
      {GlobalState.HeadSpinner&&<LinearLoadingSpinner/>}
       {GlobalState.RequestSpinner&&<LinearLoadingSpinner/>}
    </React.Fragment>
  );
}



export default Header;