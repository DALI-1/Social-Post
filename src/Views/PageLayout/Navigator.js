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
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LoginIcon from '@mui/icons-material/Login';
import logo from '../../Assets/SocialPost-Logo.png';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import {AppContext} from "../../context/Context"
import { NavigatorTabs,NavigatorSelectedTabActions} from '../../variables/variables';
import * as variables from '../../variables/variables';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import PersonPinCircleRoundedIcon from '@mui/icons-material/PersonPinCircleRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import * as PermissionsLib from "../../libs/PermissionsChecker"
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


  const handleGroupSelect=(index)=>
  {
    
    
    Dispatch({type:variables.SelectGroupActions.SetSelectedGroup,value:index})
   
  }
          const HandleLogOut=()=>
        {
          Dispatch({type:NavigatorSelectedTabActions.SelectLogout})
          window.localStorage.removeItem("AuthToken")
          window.localStorage.setItem("IsRemembered",false)
          window.localStorage.removeItem('SelectedTab')
          setTimeout(() => 
          window.location.replace('/login')
        , 1)
        }

        const HandleProfile=()=>
        {
          window.localStorage.setItem('SelectedTab', NavigatorTabs.ManageProfilInformationsTab)
          Dispatch({type:NavigatorSelectedTabActions.SelectManageProfilInformations})
         
         
        }
        const HandlePost=()=>
        {
          
          window.localStorage.setItem('SelectedTab', NavigatorTabs.ManagePostsTab)
          Dispatch({type:NavigatorSelectedTabActions.SelectManagePosts})
         
         
        }

        const HandleGroup=()=>
        {
          window.localStorage.setItem('SelectedTab', NavigatorTabs.ManageGroupsTab)
           
          Dispatch({type:NavigatorSelectedTabActions.SelectManageGroups})
         
         
        }
        const HandleUsers=()=>
        {
          window.localStorage.setItem('SelectedTab', NavigatorTabs.ManageUsersTab)
           
          Dispatch({type:NavigatorSelectedTabActions.SelectManageUsers})
        }
        const HandlePage=()=>
        {
          window.localStorage.setItem('SelectedTab', NavigatorTabs.ManagePagesTab)
           
          Dispatch({type:NavigatorSelectedTabActions.SelectManagePages})
        }
  const MenuItems = [
    {
      id: 'Publish Managmeent',
      Identificator:variables.MenuItems.Publish_MenuItem,
      children: [
        { id: 'Manage Posts', icon: <CalendarMonthRoundedIcon />,refrence:NavigatorTabs.ManagePostsTab, clickmethod:()=>{HandlePost()} },
        /*{ id: 'View Posts', icon: <PreviewRoundedIcon /> },*/
        
      ],
    },
    {
      id: 'Group Managmeent',
      Identificator:variables.MenuItems.Group_MenuItem,
      children: [
        { id: 'Manage Groups', icon: <Groups2RoundedIcon />,refrence:NavigatorTabs.ManageGroupsTab, clickmethod:()=>{HandleGroup()} },
        /*{ id: 'View Groups', icon: <PreviewRoundedIcon/> },*/
        /*{ id: 'Test Lab', icon: <PhonelinkSetupIcon /> },*/
      ],
    },
    {
      id: 'User Managmeent',
      Identificator:variables.MenuItems.User_MenuItem,
      children: [
        { id: 'Manage Users', icon: <PersonPinCircleRoundedIcon />,refrence:NavigatorTabs.ManageUsersTab, clickmethod:()=>{HandleUsers()} },
       /* { id: 'View Pages', icon: <PreviewRoundedIcon/> },*/
        
      ],
    },
    {
      id: 'Page Managmeent',
      Identificator:variables.MenuItems.Page_MenuItem,
      children: [
        { id: 'Manage Pages', icon: <DescriptionRoundedIcon />,refrence:NavigatorTabs.ManagePagesTab, clickmethod:()=>{HandlePage()} },
       /* { id: 'View Pages', icon: <PreviewRoundedIcon/> },*/
        
      ],
    },
    
    {
      
      id:'Account Management' ,
      Identificator:variables.MenuItems.Profile_MenuItem,
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
      ],
    },
    
  ];
  
  const MenuItems_Filtered=[...MenuItems.filter((p)=>PermissionsLib.ValidateMenuItem(p.Identificator)),MenuItems[4]]
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

       
        <Box  sx={{ bgcolor: '#101F33',display: "flex",justifyContent: "center", alignItemsn: "center" }}>
        <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}><GroupIcon /></ListItemText>
            </ListItem>
           
        <ListItem disablePadding sx={{marginLeft:"-130px"}}>   
        
          <MDBDropdown>
        <MDBDropdownToggle color='secondary'>{GlobalState.SelectedGroup.group_Name}</MDBDropdownToggle>
        <MDBDropdownMenu dark>
           
        {
        variables.UserInformations.info!=null&&
        variables.UserInformations.info.joinedGroups.map((grp,index)=>{
            return(
              <MDBDropdownItem key={index}  onClick={()=>{handleGroupSelect(index)}} link>{grp.group_Name}</MDBDropdownItem>
            )
          })}
        
        </MDBDropdownMenu>
      </MDBDropdown>
            
     
        </ListItem>
        </Box>
        
        
        {MenuItems_Filtered.map(({ id, children }) => (
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