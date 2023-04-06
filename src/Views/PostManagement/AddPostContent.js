import * as React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './ManagePostContent.css';
import {AppContext} from "../../context/Context"
//import PostScheduler from "../../components/KendoUIScheduler/Scheduler"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { MDBBtn } from 'mdb-react-ui-kit';
import Paper from '@mui/material/Paper';
import PostSchedularCalendar from "../../components/MUIScheduler/Scheduler"
import Box from '@mui/material/Box';
import { Editor } from "@tinymce/tinymce-react";
import { createTheme, Pivot, PivotItem, ThemeProvider } from "@fluentui/react"
import { Splitter } from "@progress/kendo-react-layout";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import "./AddPostContent.css";
import { TagsInput } from "react-tag-input-component";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Accordion from 'react-bootstrap/Accordion';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import SelectMUI from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';

import FacebookPostClone from "../../components/FacebookComps/FBPostBoxClone"
import PatternManagement from "../../components/PatternTable/PatternTable"
import ImageAddEditor from "../../components/PostAssetsManagement/ImageAddEditor"
import ImagePickerList from "../../components/PostAssetsManagement/ImagePicker"
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)
    //this is used for the splitter
    const [panes, setPanes] = React.useState([
      {
        size: "70%",
        min: "300px",
        collapsible: false,
      },     
      {
        min: "200px",
        collapsible: false,
      },
    ]);
 

    const onChange = (event) => {
      setPanes(event.newState);
    };
    
    //this is used for the pages selection
    const animatedComponents = makeAnimated();
    const options = [
      { value: 'Facebook Page', label: 'Facebook Page' },
      { value: 'strawberry', label: 'Facebook Page 2' },
      { value: 'vanilla', label: 'Facebook Page 3' }
    ]

    //this is used for tags
    const [selected, setSelected] = React.useState(["#Gaming"]);

    //this is related to scheduling
    const [Repeat,setRepeat] = React.useState(false);
      //repeat things
      const [RepeatOption, setRepeatOption] = React.useState('');

  const handleChange = (event) => {
    setRepeatOption(event.target.value);
  };
  const commonStyles = {
    bgcolor: 'background.paper',
    m: 1,
    border: "0.5px solid #3498db",
   padding:1
  };


  //TinyMce Related
  let [TextCode,SetTextCode]=React.useState("")
  const editorRef=React.useRef(null)
  function handleEditorChange() {
    if(LivePreview)
    {
      const content = editorRef.current.getContent();
      SetTextCode(content)
    }
    
  }
  //Preview Related
  let [LivePreview,setLivePreview]=React.useState(true)
    
  return (
    <>  
       
       <div>

        <Splitter panes={panes} onChange={onChange}  style={{ height: "auto",margin:"1rem",padding:"1rem",boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)'}} theme={'blueocean'}>
          <div className="pane-content">
            <Container>   
              <Row>
              <div className="card-header d-flex justify-content-center">
              Scheduled Post informations
                </div>
                <div className="card-body text-center">
                <Col>

                <Accordion className='m-2' >
      <Accordion.Item eventKey="0">
        <Accordion.Header>Pages</Accordion.Header>
        <Accordion.Body>
        <div>
                <label className="medium mb-1" htmlFor="SelectPage"> Selected Pages</label>
              <Select
              id="SelectPage"
              components={animatedComponents}
              defaultValue={[options[0]]}
              isMulti
              options={options} />
                  </div>
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
              
                  <Accordion className='m-2'>
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
           <div style={{margin:"0.5rem"}}>
           
           <Editor
           onEditorChange={handleEditorChange}
          apiKey={process.env.REACT_APP_TINYMCEJWTAPIKEY}
          init={{
            content_script: '../../libs/tinymce/js/tinymce/tinymce.min.js', 
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tableofcontents footnotes mergetags autocorrect typography inlinecss auto_replace',
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            toolbar_location: "top",
            menubar: false,
            statusbar: true,
            height: 200,
            auto_replace: true,
            auto_replace_chars: [
              { before: ':D', after: '😀' },]
            
          }}
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue="Your blog here"
        />
           
            </div>

            <Accordion className='m-2'>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Manage Dynamic Fields & Patterns</Accordion.Header>
        <Accordion.Body>
        
              
        <PatternManagement/>     
              
        
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>


    <Accordion className='m-2'>
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
              <Row><MDBBtn rounded className='mx-2 m-3' color='primary'> Add Selected Images </MDBBtn></Row>
              
              </Container> 
             
            
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
                  <Accordion className='m-2'>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Post Time Scheduling</Accordion.Header>
        <Accordion.Body>
        <div>
 
                <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'MobileDateTimePicker'
        ]}
      >
          <MobileDateTimePicker label="Post Date" defaultValue={dayjs('2022-04-17T15:30')} /> 
      </DemoContainer>
    </LocalizationProvider>

    <FormControlLabel control={<Checkbox checked={Repeat} onChange={()=>{setRepeat(!Repeat)}} />} label="Repeat" />
<br></br>

      {Repeat&&<div className='fade-in'> 
      <Box sx={{ ...commonStyles, borderRadius: 1,padding:"1rem "}}  >
        <Container>
          <Row>

          <FormControl sx={{ mt: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label"> Repeating Option</InputLabel>
        <SelectMUI
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={RepeatOption}
          label="Post Repeating Option"
          onChange={handleChange}
        >
          <MenuItem value={1}>Weekly</MenuItem>
          <MenuItem value={2}>Monthly</MenuItem>
          <MenuItem value={3}>Yearly</MenuItem>
        </SelectMUI>

      </FormControl>
          </Row>

          <Row style={{margin:"1rem"}}>
            <Col><p style={{marginTop:"1.3rem"}}>Repeat Every </p></Col>
            <Col><TextField id="outlined-basic" variant="outlined" /></Col>
            <Col style={{marginTop:"1.3rem"}} >Days</Col>
          </Row>
          
          <Row style={{margin:"1rem"}}>
                      <FormControl>
            <FormLabel>End Repeat</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <Row style={{margin:"1rem"}}><Col xs={4}>
              <FormControlLabel style={{marginTop:"0.4rem"}} value="1" control={<Radio />} label="Never" defaultChecked />
              </Col>
              <Col xs={6}></Col>
              <Col></Col>
              </Row>
            <Row style={{margin:"1rem"}}>
            <Col xs={4}><FormControlLabel style={{marginTop:"0.4rem"}} value="2" control={<Radio />} label="On" /></Col>
            <Col xs={6}><TextField id="outlined-basic" variant="outlined" /></Col>
            <Col style={{marginTop:"1.3rem"}} >Occurences</Col>
          </Row>

          <Row style={{margin:"1rem"}}>
            <Col xs={4}><FormControlLabel style={{marginTop:"0.4rem"}} value="3" control={<Radio />} label="After" /></Col>
            <Col xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDateTimePicker label="Post Date" defaultValue={dayjs('2022-04-17T15:30')} />  
         </LocalizationProvider></Col>
         <Col></Col>
            
          </Row>
              
            </RadioGroup>
          </FormControl>
          </Row>
       
      </Container>
      </Box>
      
      
      </div>}
                  </div> 
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>
      </Col>


      <MDBBtn rounded className='mx-2 m-3' color='primary'>Schedule Post </MDBBtn>

                <div className="mb-3">
               
                  </div>
                  </div>
              </Row>
            </Container>
          </div>
          <div className="pane-content" >
          <div className="card-header d-flex justify-content-center">
                  Scheduled Post Preview
                </div>
                <div className="card-body text-center">
                <Container>
                {!LivePreview&&<row><MDBBtn outline rounded className='mx-2 m-1' color='success' onClick={()=>{setLivePreview(true)}}> Enable Live preview</MDBBtn></row>}
                {LivePreview&&<row><MDBBtn outline rounded className='mx-2 m-1' color='danger' onClick={()=>{setLivePreview(false)}}> Disable Live preview</MDBBtn></row>}
                <row><MDBBtn outline rounded className='mx-2 m-1' color='dark' onClick={()=>{const content = editorRef.current.getContent(); SetTextCode(content)}} >View Changes</MDBBtn></row>
               </Container>
         
                </div>
                <div className="card-body text-center m-1" style={{ backgroundColor: "#f3f4f4",height: "700px",borderRadius:"3%"}}>
               
       
                  <FacebookPostClone Text={TextCode}/>
                


                
          </div>
          </div>
        </Splitter>

      
    </div>
   
      
        
        
        
      

       
        
     
      
      

 
     
      
      
      
      
      
      
      
      
 

  

</>
  );
}