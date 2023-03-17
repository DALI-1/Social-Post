

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



export const PostTabs=
{
    AddPost:"AddPostTab",
    SelectPostGroup:"SelectPostGroup",
    EditPost:"EditPostTab",
    ManagePostsTab:"ManagePostsTab"
}


export const PostSelectedTabActions=
{
    SelectAddPost:"SwitchToAddPost",
    SelectPostGroup:"SelectPostGroup",
    SelectEditPost:"SwitchToEditUser",
    SelectManagePosts:"SwitchToManagePostsTab"
}



export const PageTabs=
{
    AddPage:"AddPageTab",
    ManagePage:"ManagePageTab",
    EditPage:"EditPageTab",
   
}
export const PageTabActions=
{
    SelectAddPage:"SwitchToAddPageTab",
    SelectEditPage:"SwitchToEditPageTab",
    SelectManagePage:"SwitchToManagePageTab"
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

export var User=
{
    SelectedUserToModify:"",
   
}
export var HeaderSpinnerActions=
{
 TurnOnSpinner:"SpinnerON",
 TurnOffSpinner:"SpinnerOFF",
 TurnOnRequestSpinner:"RequestSpinnerON",
 TurnOffRequestSpinner:"RequestSpinnerOFF"
}

export var RerenderActions=
{
 ReRenderPage:"RenderON"

}

export var SelectGroupActions=
{
 SetSelectedGroup:"SetSelectedGroup",
 SetSelectedGroupToDefault:"SetSelectedGroupToDefault"

}

export var Pages=
{
    SelectPagesList:{},
    CurrentGroupPages:[]
    
}

export var FacebookUser=
{
    LoggedFacebookUserInfo:{}
}