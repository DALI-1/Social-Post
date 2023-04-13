import * as React from 'react';
import './ManagePostContent.css';
import {AppContext} from "../../context/Context"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { MDBBtn } from 'mdb-react-ui-kit';
import Paper from '@mui/material/Paper';
import { Editor } from "@tinymce/tinymce-react";
import { PaneDirective, PanesDirective, SplitterComponent } from '@syncfusion/ej2-react-layouts';
import "./AddPostContent.css";
import * as variables from "../../variables/variables"
import * as APILib from "../../libs/APIAccessAndVerification"
import dayjs from 'dayjs';
import {  toast } from 'react-toastify';
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
import { Box, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import SelectMUI from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import FacebookPostClone from "../../components/FacebookComps/FBPostBoxClone"
import AddHashTagDialog from "../../components/AddPostComps/AddHashTagsDialog"
import AddDynamicFieldDialog from "../../components/AddPostComps/AddDynamicFieldDialog"
import AddAssetsDialog from "../../components/AddPostComps/AddAssetsDialog"
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
export const FirstPane=React.forwardRef(({handleEditorChange,handlePageSelectionChange},ref)=> {
  const editorRef =React.useRef(null)
  const Post_DateInput=React.useRef(null)
  const Post_RepeatCheckbox=React.useRef(false)
  const Post_RepeatingOptionDropDownList=React.useRef(null)
  //const Post_Repeat_EveryInput=React.useRef(null)
  const Post_EndRepeatRadioBox=React.useRef(null)
  const Post_EndRepeatOnNbOfOccurencesInput=React.useRef(null)
  const Post_EndRepeatAfterDateInput=React.useRef(null)

  const handlePostDateChange = (date) => {
    //dayjs(date.$d)
    Post_DateInput.current=date.$d
  }
  const HandlePost_RepeatCheckbox=(v)=>
  {
    Post_RepeatCheckbox.current=v.target.checked
  }
  const HandlePost_RepeatingOptionDropDownList=(e)=>
  {
    Post_RepeatingOptionDropDownList.current=e.target.value
  }
  /*const HandlePost_Repeat_EveryInput=(e)=>
  {
      Post_Repeat_EveryInput.current=e.target.value
  }*/
  const HandlePost_EndRepeatRadioBox=(e)=>
  {
    Post_EndRepeatRadioBox.current=e.target.value
  }
  const HandlePost_EndRepeatOnNbOfOccurencesInput=(e)=>
  {
    Post_EndRepeatOnNbOfOccurencesInput.current=e.target.value
  }
  const HandlePost_EndRepeatAfterDateInput=(date)=>
  {
    //dayjs(date.$d)
    Post_EndRepeatAfterDateInput.current=date.$d
  }
  const {GlobalState,Dispatch}=React.useContext(AppContext)
   //States related to showing the Dialogs
   const [ShowAddHashTagDialog,SetShowAddHashTagDialog]=React.useState(false)
   const [ShowAssetsDialog,SetShowAssetsDialog]=React.useState(false)
   const [ShowDynamicFieldDialog,SetShowDynamicFieldDialog]=React.useState(false)


  const HandlePostSchedule=(()=>{

    let EditorContent=editorRef.current.getContent()
    let Post_Date=Post_DateInput.current
    let Repeat=Post_RepeatCheckbox.current
    let RepeatDropDownListSelection=Post_RepeatingOptionDropDownList.current
    //let Repeat_Every=Post_Repeat_EveryInput.current
    let EndRepeatRadioBoxValue=Post_EndRepeatRadioBox.current
    let EndRepeatOnNbOfOccurencesValue=Post_EndRepeatOnNbOfOccurencesInput.current
    let EndRepeatAfterDate=Post_EndRepeatAfterDateInput.current


   let ListOfPages=[]
    variables.PostGlobalVariables.POST_SelectedPageInfo.map((page)=>
    {
    ListOfPages=[...ListOfPages,{"pageID": page.id}]
    })
    var JsonObject = {  
        postGroupID: GlobalState.SelectedGroup.id,
        postText: EditorContent,
        repeatPost: Repeat,
        repeatOption: RepeatDropDownListSelection==1?"Hourly":RepeatDropDownListSelection==2?"Daily":RepeatDropDownListSelection==3?"Weekly":RepeatDropDownListSelection==4?"Monthly":RepeatDropDownListSelection==5?"Yearly":"NO_REPEAT",
        endRepeatPost: EndRepeatRadioBoxValue==1?false:true,
        endRepeatOption: EndRepeatRadioBoxValue==1?"NoEnd":EndRepeatRadioBoxValue==2?"EndOccOption":"EndDateOption",
        endRepeatOnOccurence: EndRepeatRadioBoxValue==2?EndRepeatRadioBoxValue:0,
        endRepeatAfterDate: EndRepeatRadioBoxValue==3?EndRepeatAfterDate:"2023-04-12T23:00:00.000Z",
        postDate: Post_DateInput.current,
        listOfPages:ListOfPages,
        listOfAssets: [],
        listOfDynamicFields: variables.PostGlobalVariables.POST_AddedDynamicFields
    };

   
  
    let JsonObjectToSend = JSON.stringify(JsonObject);
    console.log(JsonObjectToSend)
    let url2 =
      process.env.REACT_APP_BACKENDURL + 
      process.env.REACT_APP_ADDPOST;
    let UserToken = window.localStorage.getItem("AuthToken");
    let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
    APIResult.then((result) => {
      if (result.errorCode == undefined) {
        console.log(result)
        if(result.successCode=="Post_Scheduleded")
        {

          toast.success("Post Scheduleded Successfully!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        
        
      }
    });

 
  })
  //this is related to tiny mce custom buttons
  const customHashTagIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24"">
  <path xmlns="http://www.w3.org/2000/svg" d="m256 30.995c-107.476 0-203.979 59.927-240.146 149.121-9.859 24.302-15.854 49.834-15.854 75.879 0 124.072 115.39 225 256 225 37.646 0 74.077-7.236 108.398-21.519l98.452 21.182c5.339 1.203 11.349-.747 15-5.479 3.545-4.556 4.146-10.737 1.567-15.894l-29.106-58.198c39.229-40.575 61.689-91.684 61.689-145.092 0-124.072-115.39-225-256-225zm120 255c8.291 0 15 6.709 15 15s-6.709 15-15 15h-61.538l-14.033 49.116c-2.223 7.756-10.292 12.596-18.545 10.313-7.969-2.285-12.583-10.591-10.313-18.545l11.68-40.884h-88.79l-14.033 49.116c-2.223 7.756-10.292 12.596-18.545 10.313-7.969-2.285-12.583-10.591-10.313-18.545l11.68-40.884h-27.25c-8.291 0-15-6.709-15-15s6.709-15 15-15h35.825l17.142-60h-52.967c-8.291 0-15-6.709-15-15s6.709-15 15-15h61.538l14.033-49.116c2.285-7.983 10.664-12.466 18.545-10.313 7.969 2.285 12.583 10.591 10.313 18.545l-11.68 40.884h88.79l14.033-49.116c2.285-7.983 10.693-12.466 18.545-10.313 7.969 2.285 12.583 10.591 10.313 18.545l-11.68 40.884h27.25c8.291 0 15 6.709 15 15s-6.709 15-15 15h-35.825l-17.142 60z"/>
  </svg>`
const DynamicFIeldIcon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><path d="M0 96C0 60.7 28.7 32 64 32h96c123.7 0 224 100.3 224 224s-100.3 224-224 224H64c-35.3 0-64-28.7-64-64V96zm160 0H64V416h96c88.4 0 160-71.6 160-160s-71.6-160-160-160z"/></svg>'
const AssetsIcon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 576 512"><path d="M160 32c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H328 280 200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120z"/></svg>'

  const handleAddTag = () => {
    SetShowAddHashTagDialog(true)
    
  };

  const handleDynamicField = () => {
    SetShowDynamicFieldDialog(true)
  };

  const handleAssets = () => {
    SetShowAssetsDialog(true)
  };
  const toolbar = `
  undo redo | AddTag mentions AddDynamicFIeld AddAssets emoticons charmap formatselect |
  bold italic underline |
  forecolor backcolor | 
  alignleft aligncenter alignright alignjustify |
  bullist numlist outdent indent |
  code preview wordcount 
 // Add your custom button here
`;
const init = {
  content_script: [
    '../../libs/tinymce/js/tinymce/tinymce.min.js'
  ],
  height: 300,
  menubar: false,
  mentions: {
    source: [
        { name: 'Facebook', items: ['John Doe', 'Jane Smith', 'Facebook Page'] },
        { name: 'Twitter', items: ['@twitterhandle1', '@twitterhandle2'] }
    ]
  },
  selector: '#my-editor',
  plugins: [
    'lists',
    'link',
    'image',
    'code',
    'preview',
    'wordcount',
    'emoticons',
  ],
  toolbar_location: "top",
  menubar: false,
  statusbar: true,
  toolbar: toolbar,
  setup: (editor) => {
    //Adding the icons for the SVG files
    editor.ui.registry.addIcon('DynamicField',DynamicFIeldIcon)
    editor.ui.registry.addIcon('HashTag',customHashTagIcon)
    editor.ui.registry.addIcon('Assets',AssetsIcon)
    //adding the Add tag button on the menu
    editor.ui.registry.addButton('AddTag', {
      icon:'HashTag',
      tooltip: 'Add HashTags',
      onAction: handleAddTag
    })
    //Adding the the add Dynamic FIeld
    editor.ui.registry.addButton('AddDynamicFIeld', {
      icon:'DynamicField',
      tooltip: 'Add Dynamic field',
      onAction: handleDynamicField
    })

    //Adding the assets button
    editor.ui.registry.addButton('AddAssets', {
      icon:'Assets',
      tooltip: 'Add Assets',
      onAction: handleAssets
    })
  }
};

  
  //this is used for the splitte 
  const FirstPaneRef = React.useRef(null);
  //gets the custom ref for the component
  React.useImperativeHandle(ref, () => ({
    getFirstPaneRef: () => FirstPaneRef.current
  }));

let [PagesList,setPagesList]=React.useState([])
const fields = { value: 'id', text: 'label' };
const handlePageValueChange = (e) => {
let SelectedPagesInfos=[]

e.value.map((v)=>{

  //here we will be itterating through the List of Pages to grab each page's info
  PagesList.map((p)=>{
   if(p.id===v)
   SelectedPagesInfos=[...SelectedPagesInfos,p]
  })
})
variables.PostGlobalVariables.POST_SelectedPageInfo=SelectedPagesInfos
variables.PostGlobalVariables.POST_SelectedPageIds=e.value
variables.PostGlobalVariables.POST_AddedDynamicFields=[]
handlePageSelectionChange()
};




  //this is related to scheduling
  const [Repeat,setRepeat] = React.useState(false);
  const [PagesLoaded,SetPagesLoaded] = React.useState(false);
    //repeat things
 
const commonStyles = {
  bgcolor: 'background.paper',
  m: 1,
  border: "0.5px solid #3498db",
 padding:1
};

//here we will be making calls to the backened to retrieve the List Of Pages
React.useEffect(()=>{


 var JsonObject = {
    groupID: GlobalState.SelectedGroup.id,
  };

  let JsonObjectToSend = JSON.stringify(JsonObject);
  let url2 =
    process.env.REACT_APP_BACKENDURL + 
    process.env.REACT_APP_GETGROUPPAGES;
  let UserToken = window.localStorage.getItem("AuthToken");
  let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
  APIResult.then((result) => {
    if (result.errorCode == undefined) {
      let PageListFormatedForMultiSelect=[]
      result.result[0].map((page)=>{
        if(page.value.picture!==undefined)
        {PageListFormatedForMultiSelect=[...PageListFormatedForMultiSelect,{id:page.value.id,label:page.value.name,PagePic:page.value.picture.data.url }] }     
        else
        {PageListFormatedForMultiSelect=[...PageListFormatedForMultiSelect,{id:page.value.id,label:page.value.name,PagePic:page.value.profile_picture_url }]}
      })
      
     setPagesList(PageListFormatedForMultiSelect);
     SetPagesLoaded(true)
    }
  });
 


},[])

//This is used to appened text to TinyMCEEditor
function appendText(Text) {
  editorRef.current.execCommand('mceInsertContent', false, Text)
}

//This is used to Remove the Dynamic Field  text from TinyMCEEditor in case the Dynamic FIeld is deleted
function RemoveDynamicFieldText(Text) {
  const editor = editorRef.current; // get a reference to the editor
  const content = editor.getContent(); // get the current content of the editor
  const regex = new RegExp(Text, 'g'); // create a regular expression with the global 'g' flag to replace all instances
  const newText = ""; // the text to insert
  const replacedContent = content.replace(regex, newText); // replace all instances of the 'Text' variable with 'newText'
  editor.setContent(replacedContent); // set the new content of the edito

}
  return (
    <div className="pane-content">
            <Container>   
              <Row>
              <div className="card-header d-flex justify-content-center">
              Scheduled Post informations
                </div>
                <div className="card-body text-center">
                <Col>

                <Accordion className='m-2' defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Pages</Accordion.Header>
        <Accordion.Body>
        <div>

          {!PagesLoaded&&<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <CircularProgress />
    </Box>}
      {PagesLoaded&&<MultiSelectComponent 
      key={"MultiPageSelect"} 
      ref={FirstPaneRef}
       id="mtselement" 
       dataSource={PagesList}
        popupHeight="250px"
        popupWidth="250px"
        fields={fields}
        value={variables.PostGlobalVariables.POST_SelectedPageIds} 
        onChange={(e)=>{handlePageValueChange(e)}}
        placeholder="Select the pages you want the post to show at"
        
        />}
        
         
                  </div>
        </Accordion.Body>
      </Accordion.Item>

     
    </Accordion>           
       
           <div style={{margin:"0.5rem"}}>
           
           <Editor
          onInit={(evt, editor) => editorRef.current = editor}
           key={"Editor"}
           onEditorChange={handleEditorChange}
          apiKey={process.env.REACT_APP_TINYMCEJWTAPIKEY}
          init={init}
        />
           
            </div>
            <Accordion className='m-2' defaultActiveKey="0">
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
        {/* defaultValue={dayjs(new Date())}*/}
          <MobileDateTimePicker label="Post Date"   onChange={handlePostDateChange}  /> 
      </DemoContainer>
    </LocalizationProvider>

    <FormControlLabel control={<Checkbox checked={Repeat} onChange={(e)=>{HandlePost_RepeatCheckbox(e);setRepeat(!Repeat)}} />} label="Repeat" />
<br></br>

      {Repeat&&<div className='fade-in'> 
      <Box sx={{ ...commonStyles, borderRadius: 1,padding:"1rem "}}  >
        <Container>
          <Row>

          <FormControl sx={{ mt: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label"> Repeating Option</InputLabel>

        <SelectMUI
          onChange={HandlePost_RepeatingOptionDropDownList}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          label="Post Repeating Option"
         defaultValue={1}
        >
          <MenuItem value={1}>Hourly</MenuItem>
          <MenuItem value={2}>Daily</MenuItem>
          <MenuItem value={3}>Weekly</MenuItem>
          <MenuItem value={4}>Monthly</MenuItem>
          <MenuItem value={5}>Yearly</MenuItem>
        </SelectMUI>

      </FormControl>
          </Row>

          {/*<Row style={{margin:"1rem"}}>
            <Col><p style={{marginTop:"1.3rem"}}>Repeat Every </p></Col>
            <Col><TextField onChange={HandlePost_Repeat_EveryInput} id="outlined-basic" variant="outlined" /></Col>
            <Col style={{marginTop:"1.3rem"}} >Days</Col>
      </Row>*/}
          
          <Row style={{margin:"1rem"}}>
                      <FormControl>
            <FormLabel>End Repeat</FormLabel>
            <RadioGroup
             onChange={HandlePost_EndRepeatRadioBox}
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
            <Col xs={6}><TextField onChange={HandlePost_EndRepeatOnNbOfOccurencesInput} id="outlined-basic" variant="outlined" /></Col>
            <Col style={{marginTop:"1.3rem"}} >Occurences</Col>
          </Row>

          <Row style={{margin:"1rem"}}>
            <Col xs={4}><FormControlLabel style={{marginTop:"0.4rem"}} value="3" control={<Radio />} label="After" /></Col>
            <Col xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDateTimePicker onChange={HandlePost_EndRepeatAfterDateInput} label="Post Date"/>  
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

<Container>
  <Row>
  <Col><MDBBtn  className='mx-2 m-3' color='primary' onClick={HandlePostSchedule}>Schedule Post </MDBBtn></Col>
  <Col><MDBBtn  className='mx-2 m-3' color='primary'>Post Now </MDBBtn></Col>
  </Row>
</Container>
      

                <div className="mb-3">
               
                  </div>
                  </div>
              </Row>
            </Container>
            {/*This is related to Dialog showing*/}
          {ShowAddHashTagDialog&&<AddHashTagDialog SetShowAddHashTagDialog={SetShowAddHashTagDialog}/>}
          {ShowAssetsDialog&&<AddAssetsDialog SetShowAssetsDialog={SetShowAssetsDialog}/>}
          {ShowDynamicFieldDialog&&<AddDynamicFieldDialog appendText={appendText} RemoveDynamicFieldText={RemoveDynamicFieldText} SetShowDynamicFieldDialog={SetShowDynamicFieldDialog}/>}  
          </div>
  );
})


 export const SecondPane=React.forwardRef(({LivePreview,TextCode},ref)=> {
  let [LivePreviewStatus,SetLivePreview]=React.useState(false)
  let [Text,SetText]=React.useState(TextCode)
  const [ReRender,setReRender]=React.useState(false)
  let ListOfPagePosts=React.useRef([])
  const SecondPane = React.useRef(null);
  //gets the custom ref for the component
  React.useImperativeHandle(ref, () => ({
    getSecondPaneRef: updateFBPostClone,
    getSecondPaneReRenderer:HandleRerender
  }));

  const updateFBPostClone = (newPost) => {
   SetText(newPost)
  };
  const HandleRerender = () => {
    setReRender(!ReRender)
   };
  
ListOfPagePosts.current=[]
//We first iteratte through our pages so we added the required modifications
  variables.PostGlobalVariables.POST_SelectedPageInfo.map((Page)=>{
    let LocalText=Text
//Then we iterate through every dynamic field
       variables.PostGlobalVariables.POST_AddedDynamicFields.map((DF)=>{
         let PatternTextValue=null
        
         //Here we go through all the patterns that we have and we search which one has the ID related to the Dynamic field and we extract the TextValue so when we replace our text we know which to replace  
         variables.PostGlobalVariables.POST_PatternsInfo.map((Pattern)=>{
            if(Pattern.id===DF.patternID)
            {
             PatternTextValue=Pattern.patternText
            }
         })
         
         DF.listOfPagesDynamicFieldValues.map((DFPage)=>{

             if (DFPage.pageID===Page.id)
             {
               LocalText = LocalText.replace(PatternTextValue, DFPage.dynamicFieldValue);
             }
         })
         
         
       })
    
     
       ListOfPagePosts.current=[...ListOfPagePosts.current,<FacebookPostClone  ref={SecondPane} Text={LocalText} PageInfo={Page}/>]   
   })


   const itemsPerPage = 2;
  const [page, setPage] = React.useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const startIndex = (page-1)* itemsPerPage;
  const endIndex = ((startIndex) + itemsPerPage);
   
  return (
    <div className="pane-content"   >
    <div className="card-header d-flex justify-content-center">
            Scheduled Post Preview
          </div>
          <div className="card-body text-center">
          <Container>
          {!LivePreview.current&&<row><MDBBtn outline rounded className='mx-2 m-1' color='success' onClick={()=>{LivePreview.current=true; SetLivePreview(!LivePreviewStatus)}}> Enable Live preview</MDBBtn></row>}
          {LivePreview.current&&<row><MDBBtn outline rounded className='mx-2 m-1' color='danger' onClick={()=>{LivePreview.current=false; SetLivePreview(!LivePreviewStatus)}}> Disable Live preview</MDBBtn></row>}
          
         </Container>
          </div>
          <div className="card-body text-center m-1" style={{ backgroundColor: "#f3f4f4",height: "700px",borderRadius:"3%"}}>
            {ListOfPagePosts.current.length==0&&<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><p>No Pages Selected to Preview</p></Box>}
               {ListOfPagePosts.current.slice(startIndex, endIndex).map((item,index) => (
        <Row key={index}><Col md={12}>
          {item}</Col></Row>
       
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <Pagination count={Math.ceil(ListOfPagePosts.current.length / itemsPerPage)} page={page} color="primary" onChange={handleChangePage} />
       
      </Box>
    </div>
    </div>
  )
})
export default function Content() {

  const FirstPaneRef=React.useRef(null)
  const SecondPaneRef=React.useRef(null)
   //Preview Related
   let LivePreview=React.useRef(true)
  //TinyMce Related
  let [TextCode,SetTextCode]=React.useState("")
  const editorRef=React.useRef(null)
  function handleEditorChange(EditorText) {
    if(LivePreview.current)
    {
      const UpdateSecondPane= SecondPaneRef.current.getSecondPaneRef;
      UpdateSecondPane(EditorText)
    }
    
  }
  function handlePageSelectionChange() {
    if(LivePreview.current)
    {
      const SecondPaneReRenderer= SecondPaneRef.current.getSecondPaneReRenderer;
      SecondPaneReRenderer()      
    }
    
  }

  


  return (
    <>  
       <Paper sx={{ width: "100%", height:"100%", m: 1, p: 2, textAlign: "center" }} style={{margin:"1rem",padding:"1rem",boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)'}}>

<SplitterComponent id="splitter" height="100%" width="100%" separatorSize={5} >
   <PanesDirective>
   <PaneDirective content={()=>{return(<FirstPane ref={FirstPaneRef} handleEditorChange={handleEditorChange} handlePageSelectionChange={handlePageSelectionChange} />)}} />

   
     <PaneDirective content={()=>{return(<SecondPane  ref={SecondPaneRef} LivePreview={LivePreview} TextCode={TextCode} />)}} />
     
   </PanesDirective>
</SplitterComponent> 


    </Paper>

      
        
        
        
      

       
        
     
      
      

 
     
      
      
      
      
      
      
      
      
 

  

</>
  );
}