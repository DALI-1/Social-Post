

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

//This is all the possible values that the API status variable can take
export const APIStatuses=
{
   ConnectionLost:"ConnectionLost",
   APICallSuccess:"APISucceeded",
   NoAPICall:"NoAPICall"
}
export let APIStatus=
{
    //This variable contains the status of the current API request
    //This tell other comps if the API call failed or is successfull "NOAPICALL" indicate there is no API call right now
    Status:APIStatuses.NoAPICall
}

export var UserInformations=
{
    //This info Object contains all the informations of the logged user, which groups he has accesss to, his personal informations and all
 info:null
}

export var Group=
{
    //This SelectGroup Variable indicate which Group the user selected
    SelectedGroup:null,
     //This SelectedGroupName Variable is the name of the group that the user selected
    SelectedGroupName:null,
    //This variable is gonna contain all the permissions that the current selected Group has
    SelectedGroupPermissions:[],
    //This Variable is gonna contain all the menu items the current selected Group can see
    GroupMenuItems:[]
}

//This is all the possible actions that the spinner can take, this is used for the Context variable  so it rerender the page properly based on the request
export var HeaderSpinnerActions=
{
 TurnOnSpinner:"SpinnerON",
 TurnOffSpinner:"SpinnerOFF",
 TurnOnRequestSpinner:"RequestSpinnerON",
 TurnOffRequestSpinner:"RequestSpinnerOFF"
}

export var HeaderSpinner=
{
    //HeadSpinner represent the spinner on the top by the nav bar, if it's false then the spinner is not in loading state, if its true, it's in loading state
    //This HeadSpinner is mainly responsible of waiting for the pages initializtion
    HeadSpinner:false,
    //RequestSpinner represent the spinner on the top by the nav bar, if it's false then the spinner is not in loading state, if its true, it's in loading state
    //This RequestSpinner is mainly responsible for waiting for the add/modify requests to be handled
    RequestSpinner:true
}

export var User=
{
    //This indicate to the ModifyUser in the User Management which user is selected, it contains the selected User ID
    SelectedUserToModify:"",
   
}

//This represent all the possible actions that a Re-render can take, this is mainly used by a Context as an action variable
//This Variable is used to force a rerender in the case of some informations updates after a modify/add
export var RerenderActions=
{
 ReRenderPage:"RenderON"

}

//This represent all the possible actions that a SelectGroupActions can take, this is mainly used by a Context as an action variable
//This Variable is used to force a rerender in the case of the user selecting a different Group, SetSelectedGroupToDefault just selects the first group in the list
export var SelectGroupActions=
{
 SetSelectedGroup:"SetSelectedGroup",
 SetSelectedGroupToDefault:"SetSelectedGroupToDefault"

}

export var Pages=
{
    
    FBSelectPagesList:[],
    FBSelectedPagesList:[],
    FBINGSelectedOptionalPagesList:[],
    //This variable gonna contain all the possible Instagram Business pages available for the logged user
    //This is mainly used to show the business pages list in order for the User to select which Business accounts he want to add
    //DATA FORMAT:[{name: 'RestaurantA', id: '100272216328499', instagram_business_account: {name: 'Mohamed Ali Gargouri', id: '17841458690186189'}}]
    // name here indicate the Facebook page name and ID (this is useful for the optional choice later on)
    INGSelectPagesList:[],
    //This Variable contains the selected Instagram Pages from the previous select list
     //This is mainly used to show the facebook pages list in order for the User to optionally select the related Facbook users
    //DATA FORMAT:[{name: 'RestaurantA', id: '100272216328499', instagram_business_account: {name: 'Mohamed Ali Gargouri', id: '17841458690186189'}}]
    // name here indicate the Facebook page name and ID (this is useful for the optional choice later on)
    INGSelectedPagesList:[],
    //This Variable contains the selected optional facebook pages Pages from the previous select list
     //This is mainly used so that in the request we know which optional pages to add
    //DATA FORMAT:[{name: 'RestaurantA', id: '100272216328499', instagram_business_account: {name: 'Mohamed Ali Gargouri', id: '17841458690186189'}}]
    // name here indicate the Facebook page name and ID (this is useful for the optional choice later on)
    INGFBSelectedOptionalPagesList:[],
    //This Variable represent all the pages that the current Group has, it uses SelectedGroup variable to get the required data as reference
    //DATA FORMAT: [{PageDetails:{},PageOwnerDetails:{},PagePlatformDetails{},OtherPlatformAccountsDetails{}}]
    //PageDetails:{id: '11264564', name: 'NAAAME', profile_picture_url: 'URL1', username:"USER1"}
    //PageOwnerDetails: {id: '123', first_name: 'A, last_name: 'B',name: 'NAME1', picture:{data: {height: 50, is_silhouette: false, url: 'IMGURL', width: 50}}}
    //PagePlatformDetails: [{id: 2, platformName: 'Instagram', platformLogoImageUrl: 'URL1', platformPolicyUrl: 'PolicyURL},{...}]
    //OtherPlatformAccountsDetails: [{contentType: null, serializerSettings: null, statusCode: null, value: {name: 'RestaurantA', id: '1', picture: {…}, category: 'Restaurant', followers_count: 0, …}}]
    //The order in this Lists MATTERS!, for example  for the Page 2, in order to find 's details u need to accesss PageDetails[2],PageOwnerDetails[2] and So on.. So be aware!
    CurrentGroupPages:[],

    //This Variable contains the ID of the Selected Platform, when the user chooses to add a new page, the modal asks him to select the platform
    // that he wants to add the page from, either Facebook or Instagram, once selected this attribute is gonna be set to the platform ID which is stored in the backend and loaded from there
    //So far,  1 represent Facebook, 2 Instagram, 0 Nothing Selected.
    SelectedPlatformID:0,

    //This variable contains the List of the selected Pages ID
    //DATA FORMAT:  [{PageID: '100272216328499'},{PageID: '100272216328499'}]
    ListOfSelectedPages:[],
    PagesCategories:[]
   
    
}

export var FacebookUser=
{
    //This variable contains the current Facebook logged in user informations
    //DATA FORMAT : {first_name: 'Mohamed Ali', last_name: 'Gargouri', id: '130119143343976', email: 'mohamedaligargouri1999@gmail.com', picture: {data: {height: 50, is_silhouette: false, url: 'URl'},signedRequest: "HASH1",userID: "130119143343976"}
    LoggedFacebookUserInfo:{}
    
}

export var PostGlobalVariables=
{
 //This variable contains the selected Pages info by the user ! INFO ONLY USED TO DISPLAY PAGE INFO LATER WHEN U INSERT DYNAMIC FIELD
 /*[
    {
        "id": "120524764321751",
        "label": "Acteol",
        "PagePic": "https://scontent.ftun4-2.fna.fbcdn.net/v/t39.30808-1/339619932_766806731416281_3059132488471044205_n.jpg?stp=c14.0.50.50a_cp0_dst-jpg_p50x50&_nc_cat=105&ccb=1-7&_nc_sid=dbb9e7&_nc_ohc=Zel4npR3Wj8AX-S6UEB&_nc_ht=scontent.ftun4-2.fna&edm=AJdBtusEAAAA&oh=00_AfDspo8pJ57Xyx-r6-M4lZTqYmMqirAbtB2NxV6dTVoVgQ&oe=64458AB3",
        "PageType": 1
    },

]      This is an EXAMPLE OBJECT That shows how POST_SelectedPagesInfo Is Formated */
    POST_SelectedPageInfo:[],
     //This variable contains the selected Pages IDs by the user  !ID ONLY HERE USED FOR AN INITIZALIZING for tHE MULTISELECT
    POST_SelectedPageIds:[],
    POST_AddedDynamicFields:[],
    POST_PatternsInfo:[],
    POST_Scheduler_Selected_DateTime:new Date(),
    POST_SelectedAssetsInfo:[],
    POST_TargetedGenderId:3,   //Values  are 1: males only, 2 females only, 3 both genders, by default it's 3
    POST_TargetedAgeRange:{
        FromAge:"",
        ToAge:""
    },
    POST_AssetsTags:[],  // [{Id:id1,Asset_ID:id1,[{TaggedUserID:ID,Tag_X:1,Tag_Y:2}]}]
    POST_TargetSelectedPlatform:"1",  //Facebook only for now...//
    POST_TargetedCountries:[],
    POST_CachedCountryOptions:[],
    POST_TargetedRegions:[],
    POST_CachedRegionOptions:[],
    POST_TargetedLocations:[],
    POST_CachedLocationOptions:[],
    POST_TargetedInterests:[],
    POST_CachedInterestOptions:[],
    POST_TargetedLanguages:[],
    POST_CachedLanguageOptions:[]

}