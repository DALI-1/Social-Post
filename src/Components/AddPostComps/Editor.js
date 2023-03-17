import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./Editor.css"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Paper } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import { MDBBtn } from 'mdb-react-ui-kit';




import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Container } from 'react-bootstrap';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export  function AlertDialogSlide(props) {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    
    setOpen(false);
    props.SetEmojiSelector(false)
  };

  return (
    <div>
      
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Select the Emoji you want to add"}</DialogTitle>
        <DialogContent>
        <EmojiPicker lazyLoadEmojis={true}  onEmojiClick={props.HandleEmojiClick}/>
        </DialogContent>
       
      </Dialog>
    </div>
  );
}

export default function Editor() {
  const [value, setValue] = useState('');
  const [EmojiSelector,SetEmojiSelector]=useState(false);
  const data = [{
    label: 'FB Page 1',
    value: 'FB',
    children: [
      {
        label: '',
        value: 'searchmetoo',
        children: [
          {
            label: 'No one can get me',
            value: 'anonymous',
          },
        ],
      },
    ]},
    {label: 'FB Page 1',
    value: 'FB',
    children: [
      {
        label: '',
        value: 'searchmetoo',
        children: [
          {
            label: 'No one can get me',
            value: 'anonymous',
          },
        ],
      },
    ]
  }]
  const HandleEmojiClick=((e)=>{
    setValue(`${value}\ ${e.emoji}`)
  })
  
  const onChange = (currentNode, selectedNodes) => {
    console.log('onChange::', currentNode, selectedNodes)
  }
  const onAction = (node, action) => {
    console.log('onAction::', action, node)
  }
  const onNodeToggle = currentNode => {
    console.log('onNodeToggle::', currentNode)
  }
  return(<Col>

<Paper >
<Card.Header as="h5">Add Post</Card.Header>
      <Card.Body>
        <Card.Text className='mb-0'>
        <label className="small mb-1" htmlFor="inputLastName">Post Title </label>
        <input className="form-control mb-1" name="lastName" id="inputLastName" type="text" placeholder="Enter your Post Title" />
        <label className="small mt-1" > FaceBook pages </label>
        <DropdownTreeSelect className='m-0'  data={data} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} />
        <Paper elevation={0} sx={{ width: '100%' ,textAlign: "right" }}>

          <Container >
            <Row>
              <Col>
              <MDBBtn outline className=' mb-2' color='secondary' onClick={()=>{SetEmojiSelector(!EmojiSelector)}} >
        Add Emoji
      </MDBBtn>
              </Col>
              <Col>
              <MDBBtn outline className=' mb-2' color='secondary' onClick={()=>{SetEmojiSelector(!EmojiSelector)}} >
        Add Dynamic Field
      </MDBBtn>
              </Col>
            </Row>
          </Container>
     

      
        </Paper>
        </Card.Text>
  
         
      
     
      <ReactQuill  theme="snow" value={value} onChange={setValue} />

        {EmojiSelector==true&&<AlertDialogSlide HandleEmojiClick={HandleEmojiClick} SetEmojiSelector={SetEmojiSelector}/>}
        
        
      </Card.Body>
</Paper>
      
    
   
    
    </Col> );


    

  
  
  
  
}