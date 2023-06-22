import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Accordion from 'react-bootstrap/Accordion';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { Avatar } from "@nextui-org/react";
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Fade from '@mui/material/Fade'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'; 
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import LocationDialog from "../../../Assets/location.png"
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function AlertDialogSlide({SetShowAddLocationDialog}) {
      //this is used for tags
  const [selected, setSelected] = React.useState(["#Gaming"]);


  
  const handleClose = () => {
    SetShowAddLocationDialog(false)
  };

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);


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
        <DialogTitle>
        
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
      <Container>
        <Row>
          <Col md={12}>
          <Accordion className='m-2' defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col md={4}>
              <Avatar size="xl"  style={{marginRight:"0.5rem"}} src={LocationDialog} color="primary" zoomed/>
              </Col>              
            </Row>


            
            <Row>
            <Col md={10}>
               <p style={{marginTop:"1rem"}}>Manage Post Location</p>
              </Col>
              <Col md={2}>
              <Tooltip style={{marginTop:"0.5rem"}} title="Here you can select the location you're referring to for you blog" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
        </Accordion.Header>
        <Accordion.Body> 
        Feature Disabled, under development.
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
          </Col>
          
        </Row>
      </Container>

    
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button variant="outlined" color='warning' startIcon={<CancelIcon />} onClick={handleClose}>Close Tab</Button>
          <Button variant="outlined" color='primary' startIcon={<SaveIcon/>} onClick={handleClose}>Save Location</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
