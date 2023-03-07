

export const ProfileTabs=
{
    ProfileTab:"ProfileTab",
    SecurityTab:"SecurityTab"
}

export const ProfileSelectedTabActions=
{
    SelectProfile:"SwitchToProfileTab",
    SelectSecurity:"SwitchToSecurityTab"
}

export const GroupTabs=
{
    AddGroup:"AddGroupTab",
    EditGroupTab:"EditGroupTab",
    ManageGroupTab:"ManageGroupTab"
}

export const GroupSelectedTabActions=
{
    SelectAddGroup:"SwitchToAddGroup",
    SelectEditGroup:"SwitchToEditGroup",
    SelectManageGroup:"SwitchToManageGroup"
}

export const UserTabs=
{
    AddUser:"AddUserTab",
    EditUserTab:"EditUserTab",
    ManageUserTab:"ManageUserTab"
}

export const UserSelectedTabActions=
{
    SelectAddUser:"SwitchToAddUser",
    SelectEditUser:"SwitchToEditUser",
    SelectManageUser:"SwitchToManageUSer"
}

export const NavigatorTabs=
{
    LogoutTab:"LogoutNav",
    ManageProfilInformationsTab:"ProfileInfoNav",
    ManagePostsTab:"PostsNav",
    ManageGroupsTab:"GroupsNav",
    ManagePagesTab:"PagesNav",
    ManageUsersTab:"ManageUsersTab"
}
export const NavigatorSelectedTabActions=
{
    SelectLogout:"SwitchToLogOut",
    SelectManageProfilInformations:"SwitchToManageProfile",
    SelectManagePosts:"SwitchToManagePosts",
    SelectManageGroups:"SwitchToManageGroups",
    SelectManagePages:"SwitchToManagePages",
    SelectManageUsers:"SwitchToManageUsers"
}
export const UserActions=
{
   UpdateUsername:"UpdateUserName",
   UpdateFirstName:"UpdateFirstName",
   UpdateLastName:"UpdateLastName",
   UpdateProfilPicture:"UpdateProfilePicture",
   UpdateEmail:"UpdateEmail"
}

export const APIStatuses=
{
   ConnectionLost:"ConnectionLost",
   APICallSuccess:"APISucceeded",
   NoAPICall:"NoAPICall"
}
export let APIStatus=
{
    Status:APIStatuses.NoAPICall
}

export var UserInformations=
{
 info:null
}

export var Group=
{
    SelectedGroup:null,
    SelectedGroupName:null,
    SelectedGroupPermissions:[],
    GroupMenuItems:[]
}

export var HeaderSpinner=
{
    HeadSpinner:false,
    RequestSpinner:false
}

export var HeaderSpinnerActions=
{
 TurnOnSpinner:"SpinnerON",
 TurnOffSpinner:"SpinnerOFF",
 TurnOnRequestSpinner:"RequestSpinnerON",
 TurnOffRequestSpinner:"RequestSpinnerOFF"
}