import * as React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ManagePostContent.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'

import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import Form from 'react-bootstrap/Form';
import { Tree, TreeNode } from 'react-organizational-chart';
import { MDBRadio,MDBContainer, MDBRow, MDBCol,MDBCheckbox } from 'mdb-react-ui-kit';
import { Card, CardBody, CardFooter,Checkbox, CheckboxGroup } from '@chakra-ui/react'
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import AdjustSharpIcon from '@mui/icons-material/AdjustSharp';
import {hashString,hashRandom } from 'react-hash-string'
import Editor from "../../components/AddPostComps/Editor"


//import PostScheduler from "../../components/KendoUIScheduler/Scheduler"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { MDBBtn } from 'mdb-react-ui-kit';
import Paper from '@mui/material/Paper';
import Counter from "../../components/Test/counter"
import {HeaderSpinnerActions,HeaderSpinner}  from '../../variables/variables'
import PostScheld from "../../components/MUIScheduler/Scheduler"

export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)

    const [ListOfViewsToShow,SetListOfViewsToShow]=React.useState([]);
    const [ListOfPermToShow,SetListOfPermToShow]=React.useState([]);
    
    
  return (
    <>
       <Container>
        <Row>
          <Col>
          <Paper sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
          <div style={{ textAlign: "right" }}>
      <MDBBtn outline className='mx-2 m-2' color='secondary' >Add New Pattern</MDBBtn>
      <MDBBtn outline className='mx-2 m-2' color='secondary' > Modifty Page</MDBBtn>
      <MDBBtn outline className='mx-2 m-2' color='secondary' >Delete Page </MDBBtn>
       </div>
       </Paper>
          </Col>
        </Row>
  </Container>
       
       <Container>
       <Row>
        <Col>
        <Paper sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
        {/* <PostScheduler/>*/}  

       <PostScheld/>
        </Paper>
        </Col>  
      </Row>
       
       </Container>

 
     
      
      
      
      
      
      
      
       {/*<Row className="d-flex">
        <Col className="d-flex">
        <div className="card mb-4 mb-xl-0">
               <form >
                <div className="card-header d-flex justify-content-center"> Sub Group Details</div>
                <div className="card-body text-center">
                <div className="mb-3">
               
                        </div>
                    
                    <div className="small font-italic text-muted mb-4">
                    </div>
                    <input className="btn btn-primary" type="submit" value="Add Sub Group"/>
                    
                </div>
                </form>
            </div>
        </Col>
  </Row>*/}
 

  

</>
  );
}