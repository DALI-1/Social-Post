import React from 'react';
import "./CustomCell.css"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
export default function CustomCell(props)
{
    //props contain the selected date
      const handleCreatePost=()=>{
        variables.PostGlobalVariables.POST_Scheduler_Selected_DateTime=new Date(props.date)
        Dispatch({type:variables.PostSelectedTabActions.SelectAddPost})
      }
    const [isHovered, setIsHovered] = React.useState(false);
    const {GlobalState,Dispatch}=React.useContext(AppContext)
    const currentDate = new Date();
// Create another date to compare with
const cellDate = new Date(props.date)
if(dayjs(currentDate).isBefore(dayjs(cellDate)))
{

  if(!isHovered)
  {
    if(props.type=="alldayCells")
    {
      return(<></>)
    }
    if(props.type=='monthCells')
    {
      return(<div onMouseEnter={() => setIsHovered(true)}><br/><br/><br/></div>)
    }
    else
    { return(<div onMouseEnter={() => setIsHovered(true)}><br/><br/><br/></div>)
    }
   
  }
  else
  {
    
    return (
      <div className='post-container'
           onMouseLeave={() =>setIsHovered(false)
          }
           onMouseEnter={() =>
            setIsHovered(true)}>
            <div className='FadedPost fade-in'>
            <Container>
             <Row>
                 <Col md={12} > <div  class="HiddenPostInfo"><br/></div></Col>        
                 <Col md={10} ><div   class="HiddenPostInfo"><br/></div></Col>
             </Row>
             <Row><Col md={12}> 
             <Button  style={{marginBottom:"5px"}}variant="outlined" color='primary' startIcon={<SendIcon />} onClick={handleCreatePost}>Post</Button>
         </Col></Row>
            </Container>
            </div>                
      </div>)
  }
}
else
{
  if(props.type=="alldayCells")
  {
    return(<></>)
  }
  if(props.type=='monthCells')
  {
    return(<CloseIcon color='primary' fontSize="small"/>)
  }
  else
  { 
    return(<CloseIcon color='primary' fontSize="small"/>)
  }
 
}
   

    
}