import * as React from 'react';
import AddGroupContent from './AddSubGroupContent';
import EditGroupContent from './EditGroupContent';
import ManageGroupContent from './ManageGroupContent';
import {AppContext} from "../../context/Context"
import { ProfileTabs,GroupTabs } from '../../variables/variables';
import Container from 'react-bootstrap/Container';
export default function Content() {
    const {GlobalState,Dispatch}=React.useContext(AppContext)
    
  return (
    <>
     <Container >
     {GlobalState.GroupSelectedTab==GroupTabs.AddGroup&&<AddGroupContent/>}
        {GlobalState.GroupSelectedTab==GroupTabs.EditGroupTab&&<EditGroupContent/>}
        {GlobalState.GroupSelectedTab==GroupTabs.ManageGroupTab&&<ManageGroupContent/>}
    </Container>
     
    </>
      
      
       
        
      
    
  );
}