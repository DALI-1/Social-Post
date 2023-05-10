import React from 'react';
import "./CustomCell.css"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import IconButton from '@mui/material/IconButton';
export default function CustomCell(props)
{
    //props contain the selected date
      const handleCreatePost=()=>{
        console.log(props)
        console.log(dayjs(props.date))

        //--------------NOTE: This is done to fix a bug where the time is always -1 hour----------------//
        //Here i'm fixing the bug and also adding more hours, making it for months like 12AM instead of PM for a better user experience//
        if(props.type=="monthCells")
        {
          variables.PostGlobalVariables.POST_Scheduler_Selected_DateTime=dayjs(props.date).add(+1,"hour").add(+1,"second")
        }
        //For the cells that specific time
        else
        {
          variables.PostGlobalVariables.POST_Scheduler_Selected_DateTime=dayjs(props.date).add(+1,"hour").add(+1,"second")
        }
        
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
      return(null)
    }
    if(props.type=='monthCells')
    {
      return(<div style={{display:"block",height:"10px"}} onMouseEnter={() => setIsHovered(true)}></div>)
    }
    else
    { return(<div style={{display:"block",height:"10px"}} onMouseEnter={() => setIsHovered(true)}></div>)
    }
   
  }
  else
  {
    
    return (
      <div className='post-container' style={{ width: '100%' }}
           onMouseLeave={() => setIsHovered(false)}    
           onMouseEnter={() =>setIsHovered(true)}        
           >
            
            <div className='FadedPost'>
            <Container
             style={{
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '100%', width: '100%', maxHeight:'100%',height:'100%' 
            }}>
              
             <Row>
              <Col style={{ maxWidth: '100%', width: '100%' }} >
              <strong style={{whiteSpace: 'nowrap !important',
          overflow: 'hidden !important',
          textOverflow: 'ellipsis !important'}}>Create Post</strong>
              </Col> 
             </Row>  
             <Row >
              <Col style={{ maxWidth: '100%', width: '100%', maxHeight:'100%',height:'100%' }}>
              <IconButton  color="primary" aria-label="Create Post" component="label"  onClick={handleCreatePost} >
  <SendIcon />
</IconButton>
              </Col>
 
         </Row>
            </Container>
            </div>                
      </div>)
  }
}
else
{
  if(props.type=="alldayCells")
  {
    return(null);
  }
  if(props.type=='monthCells')
  {
    //return(<CloseIcon  color='primary' fontSize="small"/>)
  }
  else
  { 
    //return(<CloseIcon  color='primary' fontSize="small"/>)
  }
 
}
   

    
}