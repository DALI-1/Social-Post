import React from 'react'
import "./FBPostBoxClone.css"
import Paper from '@mui/material/Paper';
import { Avatar } from "@nextui-org/react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from '@mui/material/Button';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import * as variables from "../../variables/variables"
import Carousel from 'react-material-ui-carousel'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
export default function FBPostBoxClone({Text,PageInfo}) {
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-US');

    //----------------------------------If the PAGE WE POSTING IS for a FACEBOOK PAGE--------------------------------------//
   if(PageInfo.PageType==1)
   {
      //----------------------------If the POST CONTAINS NO IMAGES-------------------------------//
    if(variables.PostGlobalVariables.POST_SelectedAssetsInfo.length==0)
    {
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
            <hr/>
            </div>
            <div className='ClonePostFooter'>
            <div class="social-icons">
              <Container>
                <Row>
                  <Col > <Button  style={{color:"#666"}} startIcon={<i class="fa fa-thumbs-up"style={{color:"#666"}}></i>}>Like</Button></Col>
                  <Col > <Button style={{color:"#666"}} startIcon={<i class="fa fa-comment"style={{color:"#666"}}></i>}>Comment</Button></Col>
                  <Col> <Button style={{color:"#666"}}  startIcon={<i class="fa fa-share" style={{color:"#666"}}></i>}>Share</Button></Col>
                </Row>
              </Container>
        </div>
            </div>
            <div className='ClonePostFooter'>
           
            </div>
            </Paper>
      )
      
    }
    //----------------------------If the POST CONTAINS  IMAGES-------------------------------//
    else
    {
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
              

          
      {variables.PostGlobalVariables.POST_SelectedAssetsInfo.length==1?
      <img         
      src={variables.PostGlobalVariables.POST_SelectedAssetsInfo[0].src}
      style={{width:"100%",height:"300px"}}
      alt="Post Image"
      loading="lazy"
    />:<ImageList
      variant="quilted"
      cols={2}
      rowHeight={300}
    >
      {variables.PostGlobalVariables.POST_SelectedAssetsInfo.map((Asset,index) => (
        <ImageListItem key={index}> 
          <img         
            src={Asset.src}
            style={{width:"100%",height:"100%"}}
            alt="Post Image"
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
      }
            <hr/>
            </div>
            <div className='ClonePostFooter'>
            <div class="social-icons">
              <Container>
                <Row>
                  <Col > <Button  style={{color:"#666"}} startIcon={<i class="fa fa-thumbs-up"style={{color:"#666"}}></i>}>Like</Button></Col>
                  <Col > <Button style={{color:"#666"}} startIcon={<i class="fa fa-comment"style={{color:"#666"}}></i>}>Comment</Button></Col>
                  <Col> <Button style={{color:"#666"}}  startIcon={<i class="fa fa-share" style={{color:"#666"}}></i>}>Share</Button></Col>
                </Row>
              </Container>
        </div>
            </div>
            <div className='ClonePostFooter'>
           
            </div>
            </Paper>
      )
    }
    
    
   } //----------------------------------If the PAGE WE POSTING IS for a INSTAGRAM PAGE--------------------------------------//
   else
   {
    //----------------------------If the POST CONTAINS NO IMAGES-------------------------------//
    if(variables.PostGlobalVariables.POST_SelectedAssetsInfo.length==0)
    {
      return (
        <Paper style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
         sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
          
          <div class="post">
    <div class="header">
      <img src={PageInfo.PagePic} alt="Profile Picture"/>
      <div class="user-info">
        <h2>{PageInfo.label}</h2>
        <p>Location</p>
      </div>
      <i class="fas fa-ellipsis-h"></i>
    </div>
    <div class="image">
      <img src="https://via.placeholder.com/300x300" style={{width:"100%",height:"300px"}} alt="Post Image"/>
    </div>
    <div class="actions">
      <div class="left">
        <i class="far fa-heart"></i>
        <i class="far fa-comment"></i>
        <i class="far fa-paper-plane"></i>
      </div>
      <div class="right">
        <i class="far fa-bookmark"></i>
      </div>
    </div>
    <div class="likes">
      <img src={PageInfo.PagePic}  alt="Profile Picture"/>
      <p>Liked by <strong>{PageInfo.label}</strong> and <strong>2 others</strong></p>
    </div>
    <div class="caption">
      <p>{ ReactHtmlParser(Text) }</p>
    </div>
  </div>       
            </Paper>
      )
    }
    //----------------------------If the POST CONTAINS  IMAGES-------------------------------//
    else
    {
      return (
        <Paper style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
         sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
          
          <div class="post">
    <div class="header">
      <img src={PageInfo.PagePic} alt="Profile Picture"/>
      <div class="user-info">
        <h2>{PageInfo.label}</h2>
        <p>Location</p>
      </div>
      <i class="fas fa-ellipsis-h"></i>
    </div>
    <div class="image">
    <Carousel
    navButtonsProps={{          // Change the colors of the actual buttons. THIS STYLES BOTH BUTTONS
      style: {
          backgroundColor: 'white',
          color:"black"
      }
  }} >
      {variables.PostGlobalVariables.POST_SelectedAssetsInfo.map((Asset)=>{
       return(<img src={Asset.src} style={{width:"100%",height:"300px"}} alt="Post Image"/>)
      })}   
        </Carousel>
    </div>
    <div class="actions">
      <div class="left">
        <i class="far fa-heart"></i>
        <i class="far fa-comment"></i>
        <i class="far fa-paper-plane"></i>
      </div>
      <div class="right">
        <i class="far fa-bookmark"></i>
      </div>
    </div>
    <div class="likes">
      <img src={PageInfo.PagePic} alt="Profile Picture"/>
      <p>Liked by <strong>{PageInfo.label}</strong> and <strong>2 others</strong></p>
    </div>
    <div class="caption">
      <p>{ ReactHtmlParser(Text) }</p>
    </div>
    <div class="timestamp">
      <p>{dateStr}</p>
    </div>
  </div>       
            </Paper>
      )
    }
   
   }
 
}
