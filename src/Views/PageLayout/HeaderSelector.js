import * as React from 'react';
import {AppContext} from "../../context/Context"
import Profileheader from "../ProfileManagement/Header"
import Postheader from "../PostManagement/Header"
import Groupheader from "../GroupManagement/Header"
import Userheader from "../UserManagement/Header"
import Pageheader from "../PageManagement/Header"
import {NavigatorTabs } from '../../variables/variables';
function Header(props) {
  const {GlobalState}=React.useContext(AppContext)
  return (
    <>
    {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManageProfilInformationsTab&&<Profileheader onDrawerToggle={props.handleDrawerToggle} />}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManagePostsTab&&<Postheader onDrawerToggle={props.handleDrawerToggle} />}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManageGroupsTab&&<Groupheader onDrawerToggle={props.handleDrawerToggle} />}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManageUsersTab&&<Userheader onDrawerToggle={props.handleDrawerToggle} />}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManagePagesTab&&<Pageheader onDrawerToggle={props.handleDrawerToggle} />}
    </>
  )
}



export default Header;