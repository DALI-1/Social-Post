import * as React from 'react';
import AddGroupContent from './AddSubGroupContent';
import EditGroupContent from './EditGroupContent';
import ManageGroupContent from './ManageGroupContent';
import {AppContext} from "../../context/Context"
import {GroupTabs,UserInformations } from '../../variables/variables';
import Container from 'react-bootstrap/Container';
export default function Content() {
    const {GlobalState,Dispatch}=React.useContext(AppContext)
    
  return (
    <>
    {!GlobalState.HeadSpinner?<>

     {UserInformations.info!==null?<>
      <Container >

{GlobalState.GroupSelectedTab===GroupTabs.AddGroup&&<AddGroupContent/>}
   {GlobalState.GroupSelectedTab===GroupTabs.EditGroupTab&&<EditGroupContent/>}
   {GlobalState.GroupSelectedTab===GroupTabs.ManageGroupTab&&<ManageGroupContent/>}
</Container>
     
     </>:<> <div className="card-body text-center"><p>Failed to Load Data please retry again or check your connection</p></div></>}
     
    </>:<><div className="card-body text-center"><p>Please wait, loading data....</p></div></>}
     
     
    </>
      
      
       
        
      
    
  );
}