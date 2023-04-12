import React from 'react';
import "./CustomCell.css"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
export default function CustomCell(props)
{
    //props contain the selected date
      const handleCreatePost=()=>{
        Dispatch({type:variables.PostSelectedTabActions.SelectAddPost})
      }
    const [isHovered, setIsHovered] = React.useState(false);
    const {GlobalState,Dispatch}=React.useContext(AppContext)

    const currentDate = new Date();

  
// Create another date to compare with
const cellDate = new Date(props.date)

if(currentDate<=cellDate)
{
  console.log("here with the fade one")
  return (
    <div className='post-container'
        style={{width:"85%",height:"30%",
         }}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}>
         <p style={{color:"white"}}>_</p>
          {isHovered&&
          <div className={isHovered ? 'FadedPost fade-in' : 'FadedPost fade-out'} >
      
          <Container>
          
           <Row>
               <Col md={12} > <div  class="HiddenPostInfo">_</div></Col>
              {/* <Col md={5} ><div    class="HiddenPostInfo">_</div></Col>
               <Col md={5} ><div    class="HiddenPostInfo">_</div></Col>*/}
              


               <Col md={12} ><div   class="HiddenPostInfo">_</div></Col>
               

           </Row>
           <Row><Col md={12}> 
 <IconButton aria-label="fingerprint" color="primary" onClick={handleCreatePost}>
   <SendIcon/>
 </IconButton>
 
       </Col></Row>
           

          
          </Container>
          </div>
          }
      
          
         

          
          
          
         
    </div>)
}
else
{
  
 return( <div> Passed</div>)
}
    

    
}