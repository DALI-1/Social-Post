import * as React from 'react';
import { Loader } from "@progress/kendo-react-indicators";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import "./ManagePageContent.css"
import PageManagementTable from "../../components/Table/PageManagementTable"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { MDBBtn } from 'mdb-react-ui-kit';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import SelectPlatformModal from "../../components/PlatformModal/SelectPlatformModal"
import SelectFacebookPagesModal from "../../components/FacebookComps/SelectFacebookPagesModal"
import SelectInstagramPagesModal from "../../components/InstagramComps/SelectInstagramPagesModal"
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)
    const [SelectFBPageModalFlag,SetSelectFBPageModalFlag]=React.useState(false);
    const [SelectINSTAPageModalFlag,SetSelectINSTAPageModalFlag]=React.useState(false);
    const [SelectPlatformModalFlag,SetSelectPlatformModalFlag]=React.useState(false);
    const [DataLoaded,SetDataLoaded]=React.useState(false);

const handlePageModify=(()=>{
  if(variables.Pages.ListOfSelectedPages.length==0||variables.Pages.ListOfSelectedPages.length>1)
  {
    toast.info("You must select One Page to modify", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      }); 
  }else
  {

  }
})
     
   useEffect (()=>{
    //intializing the Checkbox selection list
    variables.Pages.ListOfSelectedPages=[]
      
   if(GlobalState.SelectedGroup.group_Name!="Loading...") 
   {
    var JsonObject={
      "groupID": GlobalState.SelectedGroup.id
    }
    let JsonObjectToSend=JSON.stringify(JsonObject)  
    let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETGROUPPAGES
    let UserToken=window.localStorage.getItem("AuthToken")
    let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
    Dispatch({type:variables.HeaderSpinnerActions.TurnOnRequestSpinner})
    APIResult.then((result)=>
    {
      console.log(result)
                  variables.Pages.CurrentGroupPages=[]
                  result.result[0].map((Page,index)=>{  
                      variables.Pages.CurrentGroupPages=[...variables.Pages.CurrentGroupPages,{"PageDetails":Page.value ,"PageOwnerDetails":result.result[1][0].value,"PagePlatformDetails":result.result[2][index],"OtherPlatformAccountsDetails":result.result[3][index]}] 
                    })    

                    SetDataLoaded(true)                                    
    })
    .catch((e)=>{

      console.log(e)
    })
    
    Dispatch({type:variables.HeaderSpinnerActions.TurnOffRequestSpinner})
   }
   
   },[])

  
  return (
    <>
      
      
      <Container>
        <Row>
          <Col>
          <Paper sx={{ width: '100%', mb: 2 ,textAlign: "right" }}>
          <div style={{ textAlign: "right" }}>
      <MDBBtn outline className='mx-2 m-2' color='secondary' onClick={()=>{ SetSelectPlatformModalFlag(true) }}>Add New Page</MDBBtn>
      <MDBBtn outline className='mx-2 m-2' color='secondary'onClick={handlePageModify} > Modifty Page</MDBBtn>
      <MDBBtn outline className='mx-2 m-2' color='secondary' >Delete Page </MDBBtn>
       </div>
       </Paper>
          </Col>
        </Row>
      </Container>
       
       <Container>
       <Row>
        <Col>
        <Paper sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
        {!DataLoaded&&<Loader  themeColor="info" size="large" type="converging-spinner" />}
        {console.log(variables.Pages.CurrentGroupPages)}
       {DataLoaded&&<PageManagementTable  data={variables.Pages.CurrentGroupPages}/>}       
        </Paper>
        </Col>  
      </Row>
       
       </Container>
    
{SelectPlatformModalFlag&&<SelectPlatformModal  SetSelectPlatformModalFlag={SetSelectPlatformModalFlag} SetSelectFBPageModalFlag={SetSelectFBPageModalFlag} SetSelectINSTAPageModalFlag={SetSelectINSTAPageModalFlag} />}
{/*Here is  a popup that's gonna show when the user chooses to use Facebook platform to load a page */}
{SelectFBPageModalFlag&&<SelectFacebookPagesModal SetSelectFBPageModalFlag={SetSelectFBPageModalFlag} />}
{/*Here is  a popup that's gonna show when the user chooses to use Instagram platform to load a page */}
{SelectINSTAPageModalFlag&&<SelectInstagramPagesModal SelectINSTAPageModalFlag={SetSelectINSTAPageModalFlag} />}


</>
  );
}