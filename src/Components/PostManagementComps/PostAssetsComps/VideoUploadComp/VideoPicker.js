
import React, { Component } from 'react'
import ImagePicker from 'react-image-picker'
import './VideoPicker.css'
import { Box, Button,Card } from '@mui/material';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'; 
import Pagination from '@mui/material/Pagination';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'; 
export default function VideoGalleryPicker({Video_Gallery,SelectedVideo_State,Set_SelectedVideo}) {
//==============Pagination Variables and functions===================//
  const itemsPerPage = 3;
  const [page, setPage] = React.useState(1);
  const startIndex = (page-1)* itemsPerPage;
  const endIndex = ((startIndex) + itemsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
//================Video Variables and functions===============================//
const [SelectedVideo,SetSelectedVideo]= React.useState(null)
React.useEffect(()=>{
Set_SelectedVideo(SelectedVideo)
},[SelectedVideo])
  return (
    <div>
        <Container>
            <Row>
            {Video_Gallery.slice(startIndex, endIndex).map((Video,index)=>{
            return(
                
                <Col>
     <div className='VideoSelector'>
         <video
          height="100%"
          width="100%"
          controls
          src={Video.resourceURL}
            />
              {SelectedVideo==Video.id&&<div className='SelectedVideoIcon'></div>}
              <div style={{padding:"10px"}}>
              <Button style={{width:"100%"}} variant="outlined" color='primary'  onClick={()=>{SetSelectedVideo(Video.id)}}>Select Video</Button>
              </div>
            
     </div>
    
      </Col>
            )
        })}
            </Row>
        </Container>
    
    {  Video_Gallery.length!=0&&<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <Pagination count={Math.ceil(Video_Gallery.length / itemsPerPage)} page={page} color="primary" onChange={handleChangePage} />
       
      </Box>
    }
    </div>

  );
}
