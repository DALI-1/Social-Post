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
export default function FBPostBoxClone({Text,PageInfo}) {
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-US');
  

  return (
    <Paper style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
     sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
        <div className='ClonePostHeader' >
      <Container>
        <Row noGutters>
            <Col sx={4}  style={{ padding: 0 }}>
                <div className='flex'>
                <Avatar size="lg" src={PageInfo.PagePic} color="gradient"   rounded zoomed/>
                <Col xs={12}><p style={{marginLeft:70,marginTop:-37}}>{PageInfo.label}</p></Col>
                <Col xs={12}><span className="grayed-out" style={{marginLeft:50,marginTop:137}}>Published At {dateStr}</span></Col>      
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
