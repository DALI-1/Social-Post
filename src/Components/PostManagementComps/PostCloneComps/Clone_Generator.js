import React from 'react'
import "./Clone_Generator.css"
import Paper from '@mui/material/Paper';
import { Avatar } from "@nextui-org/react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from '@mui/material/Button';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import * as variables from "../../../variables/variables"
import Carousel from 'react-material-ui-carousel'
import FbImageLibrary from '../../../libs/Facebook_Image_Selector/Facebook_Image_Selector'
import MainCard from "../../UI/cards/MainCard"
export default function FBPostBoxClone({Text,PageInfo}) {
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-US');
    var ImagesTab=[]


    variables.PostGlobalVariables.POST_SelectedAssetsInfo.map((im)=>{
      ImagesTab=[...ImagesTab,im.src]
    })
    //----------------------------------If the PAGE WE POSTING IS for a FACEBOOK PAGE--------------------------------------//
   if(PageInfo.PageType==1)
   {
      //----------------------------If the POST CONTAINS NO IMAGES-------------------------------//
    if(variables.PostGlobalVariables.POST_SelectedAssetsInfo.length==0)
    {

        if(variables.PostGlobalVariables.POST_SelectedVideoAssetsInfo!=null)
        {

          return (
            <MainCard style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
             sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
                <div className='ClonePostHeader' >
              <Container>
                <Row>
                    <Col sx={4}  style={{ padding: 0 }}>
                        <div className='flex'>
                        <Avatar size="lg" src={PageInfo.PagePic} color="gradient"   rounded zoomed/>
                        <Col xs={12}><p style={{marginLeft:70,marginTop:-37}}>{PageInfo.label}</p></Col>      
                        </div>
                    
                    </Col>
                   
                </Row>
              </Container>
                
                </div>
                <br></br>
                <div className='ClonePostContent'>
                { ReactHtmlParser(Text) }
                        <video
                  poster={variables.PostGlobalVariables.POST_SelectedVideoThumbnail}
                  height="100%"
                  width="100%"
                  controls
                  src={variables.PostGlobalVariables.POST_SelectedVideoAssetsInfo.resourceURL}
                    />
                </div>
                <br></br>
                <hr/>
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
                </MainCard>
          )
        }
        else
        {
          return (
            <MainCard style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
             sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
                <div className='ClonePostHeader' >
              <Container>
                <Row>
                    <Col sx={4}  style={{ padding: 0 }}>
                        <div className='flex'>
                        <Avatar size="lg" src={PageInfo.PagePic} color="gradient"   rounded zoomed/>
                        <Col xs={12}><p style={{marginLeft:70,marginTop:-37}}>{PageInfo.label}</p></Col>      
                        </div>
                    
                    </Col>
                   
                </Row>
              </Container>
                
                </div>
                <br></br>
                <div className='ClonePostContent'>
                { ReactHtmlParser(Text) }
                
                </div>
                <br></br>
                <hr/>
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
                </MainCard>
          )
        }

      
      
    }
    //----------------------------If the POST CONTAINS  IMAGES-------------------------------//
    else
    {
      return (
        <MainCard style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
         sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
            <div className='ClonePostHeader' >
          <Container>
            <Row >
                <Col sx={4}  style={{ padding: 0 }}>
                    <div className='flex'>
                    <Avatar size="lg" src={PageInfo.PagePic} color="gradient"   rounded zoomed/>
                    <Col xs={12}><p style={{marginLeft:70,marginTop:-37}}>{PageInfo.label}</p></Col>     
                    </div>
                
                </Col>
               
            </Row>
          </Container>
            
            </div>
            <br></br>
            <div className='ClonePostContent'>
            { ReactHtmlParser(Text) }             
              <br></br>
            <FbImageLibrary images={ImagesTab}/>
           
            </div>
            <br></br>
            <hr/>
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
            </MainCard>
      )
    }
    
    
   } //----------------------------------If the PAGE WE POSTING IS for a INSTAGRAM PAGE--------------------------------------//
   else
   {
    //----------------------------If the POST CONTAINS NO IMAGES-------------------------------//
    if(variables.PostGlobalVariables.POST_SelectedAssetsInfo.length==0)
    {

      if(variables.PostGlobalVariables.POST_SelectedVideoAssetsInfo!=null)
        {

          return (
            <MainCard style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
             sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
              
              <div class="post">
        <div class="header">
          <img src={PageInfo.PagePic} alt="Profile Picture"/>
          <div class="user-info">
            <h2>{PageInfo.label}</h2>
            
          </div>
          <i class="fas fa-ellipsis-h"></i>
        </div>
        <br></br>
        <div class="image" style={{width:"100%",height:"100%"}}>
         
        <video
                 
                 height="100%"
                 width="100%"
                 controls
                 poster={variables.PostGlobalVariables.POST_SelectedVideoThumbnail}
                 src={variables.PostGlobalVariables.POST_SelectedVideoAssetsInfo.resourceURL}
                   />

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
        <br></br>
        <div class="caption">
          <p>{ ReactHtmlParser(Text) }</p>
          
        </div>
        <br></br>
       
        
      </div>       
                </MainCard>
          )
        }
        else
        {
          return (
            <MainCard style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
             sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
              
              <div class="post">
        <div class="header">
          <img src={PageInfo.PagePic} alt="Profile Picture"/>
          <div class="user-info">
            <h2>{PageInfo.label}</h2>
            
          </div>
          <i class="fas fa-ellipsis-h"></i>
        </div>
        <br></br>
        <div class="image" style={{width:"100%",height:"100%"}}>
          <img src="https://via.placeholder.com/300x300" style={{width:"100%"}} alt="Post Image"/>
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
        <br></br>
        <div class="caption">
          <p>{ ReactHtmlParser(Text) }</p>
          
        </div>
        <br></br>
       
        
      </div>       
                </MainCard>
          )
        }
      
    }
    //----------------------------If the POST CONTAINS  IMAGES-------------------------------//
    else
    {
      return (
        <MainCard style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
         sx={{ width: '100%',m: 1,p:2 ,textAlign: "center",display:"inline-block" }}>
          
          <div  class="post">
    <div class="header">
      <img src={PageInfo.PagePic}   loading="lazy" alt="Profile Picture"/>
      <div class="user-info">
        <h2>{PageInfo.label}</h2>
        
      </div>
      <i class="fas fa-ellipsis-h"></i>
    </div>
    <br></br>
    <div class="image">
    <Carousel
    autoPlay={true}
    changeOnFirstRender={true}
    navButtonsProps={{          // Change the colors of the actual buttons. THIS STYLES BOTH BUTTONS
      style: {
          backgroundColor: 'white',
          color:"black", 
          
      }
  }} >
    
      {variables.PostGlobalVariables.POST_SelectedAssetsInfo.map((Asset)=>{
       return(<img loading="lazy" src={Asset.src} alt="Post Image"/>
        )
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
    <br></br>
    <div class="caption">
      <p>{ ReactHtmlParser(Text) }</p>
    </div>
    <br></br>
  
    

  </div>       
            </MainCard>
      )
    }
   
   }
 
}
