import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TagsInput } from "react-tag-input-component";
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({SetShowAddHashTagDialog}) {
      //this is used for tags
  const [selected, setSelected] = React.useState(["#Gaming"]);

  const handleClose = () => {
    SetShowAddHashTagDialog(false)
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
        <DialogTitle>{"Add Tags To your Post"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Accordion className='m-2' defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Post Tags</Accordion.Header>
        <Accordion.Body>
        <div>
                  <label className="small mb-1" htmlFor="SelectPage"> Post Tags</label>
                  <TagsInput
                  value={selected}
                  onChange={setSelected}
                  name="tags"
                  placeHolder="Enter you Post tags"
               />
                  
              
                  </div>
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Add Selected Tags</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}