import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
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
import Profileheader from "../ProfileManagement/Header"
import Postheader from "../PostManagement/Header"
import Groupheader from "../GroupManagement/Header"
import {NavigatorTabs } from '../../variables/variables';
const lightColor = 'rgba(255, 255, 255, 0.7)';

function Header(props) {
  const { onDrawerToggle } = props;
  const {GlobalState,Dispatch}=React.useContext(AppContext)
  return (
    <>
    {GlobalState.NavigatorSelectedTab==NavigatorTabs.ManageProfilInformationsTab&&<Profileheader/>}
  {GlobalState.NavigatorSelectedTab==NavigatorTabs.ManagePostsTab&&<Postheader/>}
  {GlobalState.NavigatorSelectedTab==NavigatorTabs.ManageGroupsTab&&<Groupheader/>}
    </>
  )
}



export default Header;