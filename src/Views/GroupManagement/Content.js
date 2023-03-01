import * as React from 'react';
import AddGroupContent from './AddSubGroupContent';
import EditGroupContent from './EditGroupContent';

import {AppContext} from "../../context/Context"
import { ProfileTabs,GroupTabs } from '../../variables/variables';
import Container from 'react-bootstrap/Container';
export default function Content() {
    const {GlobalState,Dispatch}=React.useContext(AppContext)
    
  return (
    <>
     <Container fluid>
     {GlobalState.GroupSelectedTab==GroupTabs.AddGroup&&<AddGroupContent/>}
        {GlobalState.GroupSelectedTab==GroupTabs.EditGroupTab&&<EditGroupContent/>}
    </Container>
     
    </>
      
      
       
        
      
    
  );
}