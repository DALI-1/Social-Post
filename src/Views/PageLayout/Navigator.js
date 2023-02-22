import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual';
import PublicIcon from '@mui/icons-material/Public';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LoginIcon from '@mui/icons-material/Login';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import logo from '../../Assets/SocialPost-Logo.png';

import {AppContext} from "../../context/Context"
import { NavigatorTabs,NavigatorSelectedTabActions} from '../../variables/variables';




const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};



export default function Navigator(props) {

  const { ...other } = props;
  const {GlobalState,Dispatch}=React.useContext(AppContext)

          const HandleLogOut=()=>
        {
          Dispatch({type:NavigatorSelectedTabActions.SelectLogout})
          window.localStorage.removeItem("AuthToken")
          window.localStorage.setItem("IsRemembered",false)
          setTimeout(() => 
          window.location.replace('/login')
        , 1)
        }

        const HandleProfile=()=>
        {
          Dispatch({type:NavigatorSelectedTabActions.SelectManageProfilInformations})
         
         
        }
        const HandlePost=()=>
        {
          Dispatch({type:NavigatorSelectedTabActions.SelectManagePosts})
         
         
        }
  const categories = [
    {
      id: 'Publish Managmeent',
      children: [
        { id: 'Manage Posts', icon: <SettingsIcon />,refrence:NavigatorTabs.ManagePostsTab, clickmethod:()=>{HandlePost()} },
        /*{ id: 'View Posts', icon: <PreviewRoundedIcon /> },*/
        
      ],
    },
    {
      id: 'Group Managmeent',
      children: [
        { id: 'Manage Groups', icon: <SettingsIcon />,refrence:NavigatorTabs.ManageGroupsTab, clickmethod:()=>{} },
        /*{ id: 'View Groups', icon: <PreviewRoundedIcon/> },*/
        /*{ id: 'Test Lab', icon: <PhonelinkSetupIcon /> },*/
      ],
    },
    {
      id: 'Page Managmeent',
      children: [
        { id: 'Manage Pages', icon: <SettingsIcon />,refrence:NavigatorTabs.ManagePagesTab, clickmethod:()=>{} },
       /* { id: 'View Pages', icon: <PreviewRoundedIcon/> },*/
        
      ],
    },
    
    {
      id: 'Account Management',
      children: [
        {
          id: 'Manage Personal informatons',
          icon: <AccountCircleRoundedIcon />,
          refrence:NavigatorTabs.ManageProfilInformationsTab,
          active: false,
          clickmethod:()=>{HandleProfile()}
        },
        { id: 'Logout', icon: <LoginIcon/>
         ,refrence:NavigatorTabs.LogoutTab
         , clickmethod:()=>{HandleLogOut()}
           }
        /*{ id: 'Database', icon: <DnsRoundedIcon /> },
        { id: 'Storage', icon: <PermMediaOutlinedIcon /> },
        { id: 'Hosting', icon: <PublicIcon /> },
        { id: 'Functions', icon: <SettingsEthernetIcon /> },
        {
          id: 'Machine learning',
          icon: <SettingsInputComponentIcon />,
        },*/
      ],
    },
    
  ];
  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#ffff' }}>
        
        <img src={logo} className="img-fluid" alt="Sample image" />
       
        
        
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Social Post Overview</ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active,clickmethod,refrence }) =>{
               
              
                
                return( <ListItem disablePadding key={childId}>
                  <ListItemButton selected={GlobalState.NavigatorSelectedTab==refrence?true:false} sx={item} onClick={clickmethod}
                    
                 >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{childId}</ListItemText>
                  </ListItemButton>
                </ListItem>)
              
              
            }   
            )}

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}