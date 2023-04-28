import { useReducer,createContext } from "react";
import * as variables from "../variables/variables"
export const AppContext=createContext(null);



const reducer=(GlobalState,action)=>
{
    
       switch(action.type)
       {
                    //Profile Tab actions
            case variables.ProfileSelectedTabActions.SelectProfile:
                {       
                    return({...GlobalState,ProfileSelectedTab:variables.ProfileTabs.ProfileTab})
                }
             
            case variables.ProfileSelectedTabActions.SelectSecurity:
                {
              return({...GlobalState,ProfileSelectedTab:variables.ProfileTabs.SecurityTab})
                }
                       //Group Tab actions
            case variables.GroupSelectedTabActions.SelectAddGroup:
                {       
                    return({...GlobalState,GroupSelectedTab:variables.GroupTabs.AddGroup})
                }
             
            case variables.GroupSelectedTabActions.SelectEditGroup:
                {
              return({...GlobalState,GroupSelectedTab:variables.GroupTabs.EditGroupTab})
                }

                case variables.GroupSelectedTabActions.SelectManageGroup:
                {
              return({...GlobalState,GroupSelectedTab:variables.GroupTabs.ManageGroupTab})
                }

                //User Tab Actions

                case variables.UserSelectedTabActions.SelectAddUser:
                    {       
                        return({...GlobalState,UserSelectedTab:variables.UserTabs.AddUser})
                    }
                 
                case variables.UserSelectedTabActions.SelectEditUser:
                    {
                  return({...GlobalState,UserSelectedTab:variables.UserTabs.EditUserTab})
                    }
    
                    case variables.UserSelectedTabActions.SelectManageUser:
                    {
                       
                  return({...GlobalState,UserSelectedTab:variables.UserTabs.ManageUserTab})
                    }

                      //Post Tab Actions

                case variables.PostSelectedTabActions.SelectAddPost:
                    {       
                        return({...GlobalState,PostSelectedTab:variables.PostTabs.AddPost})
                    }
                 
                case variables.PostSelectedTabActions.SelectEditPost:
                    {
                  return({...GlobalState,PostSelectedTab:variables.PostTabs.EditPost})
                    }
    
                    case variables.PostSelectedTabActions.SelectManagePosts:
                    {
                       
                  return({...GlobalState,PostSelectedTab:variables.PostTabs.ManagePostsTab})
                    }

                    case variables.PostSelectedTabActions.SelectPostGroup:
                    {
                       
                  return({...GlobalState,PostSelectedTab:variables.PostTabs.SelectPostGroup})
                    }




                        //Page Tab Actions

                case variables.PageTabActions.SelectAddPage:
                    {       
                        return({...GlobalState,PageSelectedTab:variables.PageTabs.AddPage})
                    }
                 
                case variables.PageTabActions.SelectEditPage:
                    {
                  return({...GlobalState,PageSelectedTab:variables.PageTabs.EditPage})
                    }
    
                    case variables.PageTabActions.SelectManagePage:
                    {
                       
                  return({...GlobalState,PageSelectedTab:variables.PageTabs.ManagePage})
                    }

                        //Navigator actions
            case variables.NavigatorSelectedTabActions.SelectLogout:
                {
                return({...GlobalState,NavigatorSelectedTab:variables.NavigatorTabs.LogoutTab})
                }
            case variables.NavigatorSelectedTabActions.SelectManageProfilInformations:
                {
                    
                return({...GlobalState,NavigatorSelectedTab:variables.NavigatorTabs.ManageProfilInformationsTab})
                }
                
            case variables.NavigatorSelectedTabActions.SelectManageGroups:
                {
                return({...GlobalState,NavigatorSelectedTab:variables.NavigatorTabs.ManageGroupsTab})
                }  
            case variables.NavigatorSelectedTabActions.SelectManagePages:
                {
                return({...GlobalState,NavigatorSelectedTab:variables.NavigatorTabs.ManagePagesTab})
                }  
            case variables.NavigatorSelectedTabActions.SelectManagePosts:
                {
                return({...GlobalState,NavigatorSelectedTab:variables.NavigatorTabs.ManagePostsTab})
                } 

                case variables.NavigatorSelectedTabActions.SelectManageUsers:
                    {
                      
                    return({...GlobalState,NavigatorSelectedTab:variables.NavigatorTabs.ManageUsersTab})
                    } 


                //Personal Info Actions

            
                       
                case variables.UserActions.UpdateFirstName:
                {
                    variables.UserInformations.info.firstName=action.value  
                return({...GlobalState,FirstName:action.value})
                } 
                case variables.UserActions.UpdateLastName:
                {
                    variables.UserInformations.info.lastName=action.value
                return({...GlobalState,LastName:action.value})
                } 
                case variables.UserActions.UpdateUsername:
                {
                    variables.UserInformations.info.userName=action.value
                return({...GlobalState,Username:action.value})
                } 
                case variables.UserActions.UpdateProfilPicture:
                {     
                    variables.UserInformations.info.profilePictureURL=action.value  
                return({...GlobalState,UserProfilePicture:action.value})
                } 
                case variables.UserActions.UpdateEmail:
                {   
                    
                    variables.UserInformations.info.email=action.value 
                    
                return({...GlobalState,Email:action.value})
                }

                //Spinner actions
              
                case variables.HeaderSpinnerActions.TurnOnSpinner:
                    {   
                        
                        variables.HeaderSpinner.HeadSpinner=true
                        
                    return({...GlobalState,HeadSpinner:true})
                    }
                    case variables.HeaderSpinnerActions.TurnOffSpinner:
                        {   
                            
                            variables.HeaderSpinner.HeadSpinner=false
                            
                        return({...GlobalState,HeadSpinner:false})
                        }

                case variables.HeaderSpinnerActions.TurnOnRequestSpinner:
                    {   
                        
                        variables.HeaderSpinner.RequestSpinner=true
                        
                    return({...GlobalState,RequestSpinner:true})
                    }
                    case variables.HeaderSpinnerActions.TurnOffRequestSpinner:
                        {   
                            
                            variables.HeaderSpinner.RequestSpinner=false
                            
                        return({...GlobalState,RequestSpinner:false})
                        } 
                        
                        //ReRender
                        
                        case variables.RerenderActions.ReRenderPage:
 
                        console.log("Re-render request triggered!")
                            return({...GlobalState,Rerender:!GlobalState.Rerender})
                        
                        case variables.SelectGroupActions.SetSelectedGroup:
                            {                              
                             variables.Group.SelectedGroup=variables.UserInformations.info.joinedGroups[action.value].id
                            return({...GlobalState,SelectedGroup:variables.UserInformations.info.joinedGroups[action.value]})
                           
                            } 

                            case variables.SelectGroupActions.SetSelectedGroupToDefault:
                            {   
                                variables.Group.SelectedGroup=0
                            return({...GlobalState,SelectedGroup:0})
                           
                            }
            default:
                
              return (GlobalState)  

       }
}

let InitialGlobalState={}
if(window.localStorage.getItem('SelectedTab')!=null)
{
     InitialGlobalState=
    {
        NavigatorSelectedTab:window.localStorage.getItem('SelectedTab'),
        ProfileSelectedTab:variables.ProfileTabs.ProfileTab,
        GroupSelectedTab:variables.GroupTabs.ManageGroupTab,
        UserSelectedTab:variables.UserTabs.ManageUserTab,
        PostSelectedTab:variables.PostTabs.ManagePostsTab,
        SelectedGroup:{group_Name:"Loading..."},
        PageSelectedTab: variables.PageTabs.ManagePage,
        

        PassedGroupID:null,
        Username:null,
        FirstName:"",
        LastName:"",
        Email:null,
        UserProfilePicture:null,
        GroupInformations:null,
        HeadSpinner:false,
        RequestSpinner:false,
        Rerender:false

    }
}
else
{
    InitialGlobalState=
    {
        NavigatorSelectedTab:variables.NavigatorTabs.ManagePostsTab,
        ProfileSelectedTab:variables.ProfileTabs.ProfileTab,
        GroupSelectedTab:variables.GroupTabs.ManageGroupTab,
        UserSelectedTab:variables.UserTabs.ManageUserTab,
        PostSelectedTab:variables.PostTabs.ManagePostsTab,       
        PageSelectedTab: variables.PageTabs.ManagePage,
        SelectedGroup:{group_Name:"Loading..."},
        PassedGroupID:null,
        Username:null,
        FirstName:"",
        LastName:"",
        Email:null,
        UserProfilePicture:null,
        GroupInformations:null,
        HeadSpinner:false,
        RequestSpinner:false,
        Rerender:false
    }
}


export const GlobalContext=({children})=>
{
     
    const [GlobalState,Dispatch]= useReducer(reducer,InitialGlobalState)
   

    return (<AppContext.Provider value={{GlobalState,Dispatch}}>{children}</AppContext.Provider>)

}




