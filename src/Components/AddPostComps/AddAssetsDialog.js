import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Accordion from 'react-bootstrap/Accordion';
import ImageAddEditor from "../../components/PostAssetsManagement/ImageAddEditor"
import ImagePickerList from "../../components/PostAssetsManagement/ImagePicker"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { MDBBtn } from 'mdb-react-ui-kit';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({SetShowAssetsDialog}) {
  const handleClose = () => {
    SetShowAssetsDialog(false)
  };

  return (
    <div>
      <Dialog
        open={true}
        fullWidth={true}
        maxWidth='lg'
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Manage Assets"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          
          <Accordion className='m-2' defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Manage Assets</Accordion.Header>
        <Accordion.Body>
        
             <Container className='justify-content-center align-items-center'>
              
              <Row>
              <ImageAddEditor/>
              </Row>
              <Row>
              <ImagePickerList/>     
              </Row>
              
              
              </Container> 
             
            
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Add Selected Images</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}