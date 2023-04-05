import React from 'react'
import "./FBPostBoxClone.css"
import Paper from '@mui/material/Paper';
import { Avatar } from "@nextui-org/react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import CloneFooterImage from "../../Assets/FacebookClonePost/CloneFooterImage.png"
import CloneCommentsImage from "../../Assets/FacebookClonePost/CloneCommentImage.png"
export default function FBPostBoxClone({Text,Image}) {
   

  return (
    <Paper style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
     sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
        <div className='ClonePostHeader' >
      <Container>
        <Row noGutters>
            <Col sx={4}  style={{ padding: 0 }}>
                <div className='flex'>
                <Avatar size="lg" src="https://firebasestorage.googleapis.com/v0/b/socialpost-58454.appspot.com/o/ProfileImages%2F-795987239?alt=media&token=1562fa44-1956-4fd1-866e-c5aa61c6a641" color="gradient"   rounded zoomed/>
                <Col xs={12}><p style={{marginLeft:70,marginTop:-37}}> Page Name</p></Col>
                <Col xs={12}><span className="grayed-out" style={{marginLeft:50,marginTop:137}}>Published  At 25/01/2023</span></Col> 
                
                </div>
            
            </Col>
           
        </Row>
      </Container>
        
        </div>
        <div className='ClonePostContent'>
        { ReactHtmlParser(Text) }
       
          <br></br>
        <hr/>
        </div>
        <div className='ClonePostFooter'>
        <img src={CloneFooterImage} alt="My image" className="my-image" />
        </div>
        <div className='ClonePostFooter'>
        <img src={CloneCommentsImage} alt="My image" className="my-image" />
        </div>
        </Paper>
  )
}
