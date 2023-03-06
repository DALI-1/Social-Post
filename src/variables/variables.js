

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

export const NavigatorTabs=
{
    LogoutTab:"LogoutNav",
    ManageProfilInformationsTab:"ProfileInfoNav",
    ManagePostsTab:"PostsNav",
    ManageGroupsTab:"GroupsNav",
    ManagePagesTab:"PagesNav"
}
export const NavigatorSelectedTabActions=
{
    SelectLogout:"SwitchToLogOut",
    SelectManageProfilInformations:"SwitchToManageProfile",
    SelectManagePosts:"SwitchToManagePosts",
    SelectManageGroups:"SwitchToManageGroups",
    SelectManagePages:"SwitchToManagePages"
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