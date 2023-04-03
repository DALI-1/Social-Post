import * as React from 'react';
import ProfilePage from '../ProfileManagement/Content';
import PostMangementPage from '../PostManagement/Content';
import GroupMangementPage from '../GroupManagement/Content';
import UserMangementPage from '../UserManagement/Content';
import PageMangementPage from '../PageManagement/Content';
import {AppContext} from "../../context/Context"
import {NavigatorTabs } from '../../variables/variables';
export default function Content() {
    const {GlobalState}=React.useContext(AppContext)  
 
  return (
  <>
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManageProfilInformationsTab&&<ProfilePage/>}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManagePostsTab&&<PostMangementPage/>}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManageGroupsTab&&<GroupMangementPage/>}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManagePagesTab&&<PageMangementPage/>}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManageUsersTab&&<UserMangementPage/>}

  </>
    
  );
}