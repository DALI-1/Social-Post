import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import PatternManagement from "../PatternTable/PatternTable"
import Accordion from 'react-bootstrap/Accordion';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';

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
        <Accordion.Header>Manage Dynamic Fields & Patterns</Accordion.Header>
        <Accordion.Body>
        
              
        <PatternManagement appendText={appendText} RemoveDynamicFieldText={RemoveDynamicFieldText}/>     
              
        
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