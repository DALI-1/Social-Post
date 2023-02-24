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
import ProfilePage from '../ProfileManagement/Content';
import PostMangementPage from '../PostManagement/Content';
import GroupMangementPage from '../GroupManagement/Content';
import {AppContext} from "../../context/Context"
import {NavigatorTabs } from '../../variables/variables';
import LoadingSpinner from "../../components/LoadingSpinner"
export default function Content() {
    const {GlobalState,Dispatch}=React.useContext(AppContext)  
  return (
  <>
  {GlobalState.NavigatorSelectedTab==NavigatorTabs.ManageProfilInformationsTab&&<ProfilePage/>}
  {GlobalState.NavigatorSelectedTab==NavigatorTabs.ManagePostsTab&&<PostMangementPage/>}
  {GlobalState.NavigatorSelectedTab==NavigatorTabs.ManageGroupsTab&&<GroupMangementPage/>}
  </>
    
  );
}