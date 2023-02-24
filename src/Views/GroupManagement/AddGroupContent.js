import * as React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddGroupContent.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'

import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)

    const handlesubmit=(props)=>
    {
      props.preventDefault()
      
     
      //Converting Form Data to a Json object
      let JsonObject
      let JsonString="{"
      for(let i=0;i<6;i++)
        {
          
          if(i!=5)
          JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\","
          else
          JsonString+="\""+props.target[i].name+"\": "+"\""+props.target[i].value+"\"}"
  
        }
  
        
     JsonObject=JSON.parse(JSON.stringify(JsonString))
     //Sending a POST HTTP To the API with the Json Object
     let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CHANGEPERSONALINFO
     let UserToken=window.localStorage.getItem("AuthToken")
     let APIResult=CALL_API_With_JWTToken(url,JsonObject,UserToken)
    
     
                    
            
 
    
}
  return (
    
      <div className="container-xl px-4 mt-4">
    <div className="row">
        <div className="col-xl-4">
            
            <div className="card mb-4 mb-xl-0">
                <div className="card-header">Group Details</div>
                <div className="card-body text-center">
                <div className="mb-3">
                            <label className="small mb-1" htmlFor="inputUsername">Group Name</label>
                            <input className="form-control" name="GroupName" id="inputUsername" type="text" placeholder="Enter your Group Name" />
                        </div>
                    
                    <div className="small font-italic text-muted mb-4">
                    </div>
                    <input className="btn btn-primary" type="submit" value="Add Group"/>
                    
                </div>
            </div>
        </div>
        <div className="col-xl-8">
           
            <div className="card mb-4">
                <div className="card-header">Group permissions</div>
                <div className="card-body">
                    <Container>
                    <Row>
                        <Col>
                        <div className="card mb-4">
                        <div className="card-header">Manage Posts</div>
                        <div className="card-body">
                        <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Add Permission"
                        />
                        <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Edit Permission"
                        />
                        <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Delete Permission"
                        />
                        </div>
                        </div>
                        </Col>

                        <Col>
                        <div className="card mb-4">
                        <div className="card-header">Manage Pages</div>
                        <div className="card-body">
                        <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Add Permission"
                        />
                        <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Edit Permission"
                        />
                        <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Delete Permission"
                        />
                        </div>
                        </div>
                        </Col>

                        <Col>
                        <div className="card mb-4">
                        <div className="card-header">Manage Publish</div>
                        <div className="card-body">
                        <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Add Permission"
                        />
                        <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Edit Permission"
                        />
                        <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Delete Permission"
                        />
                        </div>
                        </div>
                        </Col>
                        
                    </Row>
                    
                    </Container>
                </div>
                
            </div>
        </div>
    </div>
</div>
      
  );
}