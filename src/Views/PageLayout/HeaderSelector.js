import * as React from 'react';
import {AppContext} from "../../context/Context"
import Profileheader from "../ProfileManagement/Header"
import Postheader from "../PostManagement/Header"
import Groupheader from "../GroupManagement/Header"
import Userheader from "../UserManagement/Header"
import Pageheader from "../PageManagement/Header"
import {NavigatorTabs } from '../../variables/variables';
function Header() {

  const {GlobalState}=React.useContext(AppContext)
  return (
    <>
    {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManageProfilInformationsTab&&<Profileheader/>}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManagePostsTab&&<Postheader/>}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManageGroupsTab&&<Groupheader/>}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManageUsersTab&&<Userheader/>}
  {GlobalState.NavigatorSelectedTab===NavigatorTabs.ManagePagesTab&&<Pageheader/>}
    </>
  )
}



export default Header;