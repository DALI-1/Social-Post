import { useReducer,createContext,useContext } from "react";
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

                //Personal Info Actions
                case variables.UserActions.UpdateFirstName:
                {
                return({...GlobalState,FirstName:action.value})
                } 
                case variables.UserActions.UpdateLastName:
                {
                return({...GlobalState,LastName:action.value})
                } 
                case variables.UserActions.UpdateUsername:
                {
                return({...GlobalState,Username:action.value})
                } 
                case variables.UserActions.UpdateProfilPicture:
                    {
                        
                    return({...GlobalState,UserProfilePicture:action.value})
                    } 
               
            default:
                
              return (GlobalState)  

       }
}

const InitialGlobalState=
{
    NavigatorSelectedTab:variables.NavigatorTabs.ManagePostsTab,
    ProfileSelectedTab:variables.ProfileTabs.ProfileTab,
    Username:null,
    FirstName:null,
    LastName:null,
    UserProfilePicture:"NoPictureYet"
}

export const GlobalContext=({children})=>
{
     
    const [GlobalState,Dispatch]= useReducer(reducer,InitialGlobalState)
     
    return (<AppContext.Provider value={{GlobalState,Dispatch}}>{children}</AppContext.Provider>)

}




