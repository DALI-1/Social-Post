import { useReducer,createContext,useContext } from "react";
import {ProfileTabs,ProfileSelectedTabActions,NavigatorTabs,NavigatorSelectedTabActions} from "../variables/variables"
export const AppContext=createContext(null);


const reducer=(GlobalState,action)=>
{
       switch(action.type)
       {
                    //Profile Tab actions
            case ProfileSelectedTabActions.SelectProfile:
                {       
                    return({...GlobalState,ProfileSelectedTab:ProfileTabs.ProfileTab})
                }
             
            case ProfileSelectedTabActions.SelectSecurity:
                {
              return({...GlobalState,ProfileSelectedTab:ProfileTabs.SecurityTab})
                }
                        //Navigator actions
            case NavigatorSelectedTabActions.SelectLogout:
                {
                return({...GlobalState,NavigatorSelectedTab:NavigatorTabs.LogoutTab})
                }
            case NavigatorSelectedTabActions.SelectManageProfilInformations:
                {
                    
                return({...GlobalState,NavigatorSelectedTab:NavigatorTabs.ManageProfilInformationsTab})
                }
                
            case NavigatorSelectedTabActions.SelectManageGroups:
                {
                return({...GlobalState,NavigatorSelectedTab:NavigatorTabs.ManageGroupsTab})
                }  
            case NavigatorSelectedTabActions.SelectManagePages:
                {
                return({...GlobalState,NavigatorSelectedTab:NavigatorTabs.ManagePagesTab})
                }  
            case NavigatorSelectedTabActions.SelectManagePosts:
                {
                return({...GlobalState,NavigatorSelectedTab:NavigatorTabs.ManagePostsTab})
                } 

            default:
              return (GlobalState)  

       }
}

const InitialGlobalState=
{
    NavigatorSelectedTab:NavigatorTabs.ManagePostsTab,
    ProfileSelectedTab:ProfileTabs.ProfileTab
}

export const GlobalContext=({children})=>
{
     
    const [GlobalState,Dispatch]= useReducer(reducer,InitialGlobalState)
     
    return (<AppContext.Provider value={{GlobalState,Dispatch}}>{children}</AppContext.Provider>)

}




