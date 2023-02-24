import { useReducer,createContext,useContext,useEffect } from "react";
import * as variables from "../variables/variables"
import { ToastContainer, toast } from 'react-toastify';
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
              
               
               
            default:
                
              return (GlobalState)  

       }
}

const InitialGlobalState=
{
    NavigatorSelectedTab:variables.NavigatorTabs.ManagePostsTab,
    ProfileSelectedTab:variables.ProfileTabs.ProfileTab,
    GroupSelectedTab:variables.GroupTabs.AddGroup,
    Username:null,
    FirstName:null,
    LastName:null,
    Email:null,
    UserProfilePicture:null
    
}

export const GlobalContext=({children})=>
{
     
    const [GlobalState,Dispatch]= useReducer(reducer,InitialGlobalState)
   

    return (<AppContext.Provider value={{GlobalState,Dispatch}}>{children}</AppContext.Provider>)

}




