import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import PatternManagement from "../../PatternManagementComps/PatternTable"
import Accordion from 'react-bootstrap/Accordion';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import { Avatar } from "@nextui-org/react";
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Fade from '@mui/material/Fade'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'; 
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({SetShowDynamicFieldDialog,appendText,RemoveDynamicFieldText}) {
  const handleClose = () => {
    SetShowDynamicFieldDialog(false)
  };
  return (
    <div>
      <Dialog
      fullWidth={true}
      maxWidth='lg'
        open={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Dynamic Field Management</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Dynamic field
           
            <Accordion className='m-2' defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col md={4}>
              <Avatar size="xl" style={{marginRight:"0.5rem"}} src="https://firebasestorage.googleapis.com/v0/b/socialpost-58454.appspot.com/o/PlatformsLogo%2Fhome-icon-Unrivalled-functionality.png?alt=media&token=3777def1-531d-40b6-baed-8c33e7ec466b" color="primary" zoomed/>
              </Col>              
            </Row>


            
            <Row>
            <Col md={10}>
               <p style={{marginTop:"1rem"}}>Manage Dynamic Fields & Patterns</p>
              </Col>
              <Col md={2}>
              <Tooltip style={{marginTop:"0.5rem"}} title="The Dynamic field is used for  repeatitive posts where only minor things change like Promotion 50% for Page A, 20% for Page B, you just create a pattern  and input the value  for each page and it automatically replaces it for you." TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
          </Accordion.Header>
        <Accordion.Body>
        
              
        <PatternManagement handleClose={handleClose} appendText={appendText} RemoveDynamicFieldText={RemoveDynamicFieldText}/>     
              
        
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}> 
        <Button variant="outlined" color='primary' startIcon={<CancelIcon />} onClick={handleClose}>Cancel</Button>  
        </DialogActions>
      </Dialog>
    </div>
  );
}