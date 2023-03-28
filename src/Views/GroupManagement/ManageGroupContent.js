import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { ToastContainer, toast } from 'react-toastify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import {HeaderSpinnerActions,HeaderSpinner}  from '../../variables/variables'
import * as ReactDOMServer from 'react-dom/server';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import 'react-toastify/dist/ReactToastify.css';
import './AddSubGroupContent.css';
import { ProfileSelectedTabActions,ProfileTabs,GroupSelectedTabActions,GroupTabs } from '../../variables/variables';
import TocSharpIcon from '@mui/icons-material/TocSharp';
import AccountTreeSharpIcon from '@mui/icons-material/AccountTreeSharp';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import SettingsApplicationsSharpIcon from '@mui/icons-material/SettingsApplicationsSharp';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Tree, TreeNode } from 'react-organizational-chart';
import { MDBRadio,MDBContainer, MDBRow, MDBCol,MDBCheckbox } from 'mdb-react-ui-kit';
import { Card, CardBody, CardFooter,Checkbox, CheckboxGroup } from '@chakra-ui/react'
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import AdjustSharpIcon from '@mui/icons-material/AdjustSharp';
import {hashString,hashRandom } from 'react-hash-string'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function AlertDialog(props) {
  const [open, setOpen] = React.useState(true);
  const {GlobalState,Dispatch}=React.useContext(AppContext)

  let handleGroupDelete=()=>{
 let GroupID=props.GroupID;


 var JsonObject={"groupId":GroupID.toString()}

        JsonObject=JSON.stringify(JsonObject)
        
         let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_DELETEGROUP
         let UserToken=window.localStorage.getItem("AuthToken")
         let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
         Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})

         APIResult.then((result)=>
         {
           for( var property in result)
                               {
                                   
                                   if( property=="GROUPDELETED")
                                   {
                                    toast.success("The Group and all of its childs has been deleted successfully!", {
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

                                    if(property=="IMPOSSIBLETODELETEGROUPUNDERROOT")
                                    {
                                      toast.info("You cant delete the campaign group !", {
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
                               //Updating our SubGroups info
                               let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETPERSONALINFO
                               let UserToken=window.localStorage.getItem("AuthToken")
                               let APIResult=CALL_API_With_JWTToken_GET(url,UserToken)
                               Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})
                               APIResult.then(result=>{ 
                                        variables.UserInformations.info=result
                                        variables.UserInformations.info.passwordHash=null
                                        variables.UserInformations.info.passwordSalt=null
                                        
                                        Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})
                                 })
                                 
                                  Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
                                  handleClose()
                                  
  })
  .catch(()=>{
   
Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
  })
}

  const handleClose = () => {
    setOpen(false);
    props.SetDeleteModal(!props.DeleteShow)
    
  };

  return (
    <>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Group"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete the Group {props.GroupName} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>No</Button>
          <Button variant="outlined" color="error" onClick={handleGroupDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function TRow (parameter){
  let [open, setOpen] = React.useState(false);
  let props=parameter.Group
      if (props!=undefined)
      {
       
          return (
            <>
              <TableRow key={hashRandom()} sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                
                <TableCell align="left">
                <Groups2SharpIcon style={{Margin:"1rem"}}/>
                  {"                  "+props.group_Name}
                </TableCell>
                <TableCell align="left">
                <IconButton color="primary" aria-label="Add sub group" onClick={()=>{parameter.HandleGroupAdd(props.id,props.group_Name)}}>
                <AddCircleSharpIcon/>
                </IconButton>
               
                
                </TableCell>  
                <TableCell> <IconButton color="primary" aria-label="Edit sub group" onClick={()=>{parameter.HandleGroupEdit(props.id,props.group_Name)}}> 
                <SettingsApplicationsSharpIcon/>
                </IconButton></TableCell>
                <TableCell><IconButton color="primary" aria-label="delete sub group"onClick={()=>{
                  parameter.SetGroupID.current=props.id
                  parameter.SetGroupName.current=props.group_Name
                  parameter.SetDeleteModal(true)
                  }}>
                <HighlightOffSharpIcon/>
                </IconButton></TableCell>
              </TableRow>
              
              
                  <Collapse key={hashRandom()} in={open} timeout="auto" unmountOnExit>
                  <TableRow key={hashRandom()}  sx={{ '& > *': { borderBottom: 'unset' }}}>
              <TableCell></TableCell>
              <TableCell>
                  {props.subGroups.length>0?
                  <Box sx={{ margin: 1 }}>
                  <Typography className=" m-1" variant="h7" gutterBottom component="div">
                    Sub Groups
                  </Typography>
                                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                    
                      <TableBody>
                      {props.subGroups.map((grp)=>{
                        return(<TRow key={hashRandom()} HandleGroupAdd={parameter.HandleGroupAdd} HandleGroupEdit={parameter.HandleGroupEdit}  SetGroupName={parameter.SetGroupName} SetGroupID={parameter.SetGroupID} SetDeleteModal={parameter.SetDeleteModal} Group={grp}/>)
                      })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                : <>
                <TableRow key={hashRandom()}  sx={{ '& > *': { borderBottom: 'unset' }}}>
                <p>No SubGroups found</p>
                </TableRow>
                
                </>
                 
               
                  }
                     </TableCell>
              </TableRow>
                  </Collapse>
                  
                 
            </>
          )

       
        
      }
      else
      {
        
           return <></>
      }

}
export default function Content() {
  React.useEffect(()=>{
    //Saving all the checkboxes Ids in the table so later we can access the checkbox buttons and know which one is selected
    //ListOfRadioButtons.current=[...ListOfRadioButtons.current,"GROUP"+variables.UserInformations.info.joinedGroups[0].id]
    GenerateRadioBoxList(variables.UserInformations.info.joinedGroups)
  },[])
    const {GlobalState,Dispatch}=React.useContext(AppContext)

    const [ListOfViewsToShow,SetListOfViewsToShow]=React.useState([]);
    const [ListOfPermToShow,SetListOfPermToShow]=React.useState([]);
   
    let SelectedGroupName=React.useRef("")
    let SelectedGroupID=React.useRef("")
    let ListOfRadioButtons=React.useRef([])
   
    let [DeleteShow,SetDeleteShow]=React.useState(false)
    let [RenderValue,ReRender]=React.useState(false)
    let[ViewMode,SetViewMode]=React.useState("Tabular");

    //This recurssive function save the radio boxes IDs in a table so later it be used to identify which subgroup we under
    function GenerateRadioBoxList(subGroups) {
           if(subGroups!=null)
           {
             if(subGroups.length!=0)
             {
                  subGroups.map((group) => {
                  //Saving the Ids of the groups to the list ListOfRadioButtons.current
                  ListOfRadioButtons.current=[...ListOfRadioButtons.current,"GROUP"+group.id]
                  GenerateRadioBoxList(group.subGroups)

            })
          }
        }
        return null
    }
    // This is a recurrsive function that generate the tree based on the user data and how many subgroups in the hiearchy 
           function generateList(subGroups) {
            if(subGroups!=null)
           {
             if(subGroups.length!=0)
             {
                return (
                  <>
                    {subGroups.map((group,index) => ( 
                      <TreeNode key={index}  label={<div id={"DIVGROUP"+group.id}
                       ><Groups2SharpIcon/> <p>{group.group_Name}</p>

                    <IconButton className='m-0' id={"ADD"+group.id}  aria-label="Add sub group"
                   onClick={()=>{HandleGroupAdd(group.id,group.group_Name)}}
                    >
                        <AddCircleSharpIcon />
                        </IconButton>
                          <IconButton className='m-0' id={"MODIFY"+group.id} aria-label="delete sub group"
                          onClick={()=>{HandleGroupEdit(group.id,group.group_Name)}}
                          >
                        <SettingsApplicationsSharpIcon/>
                        </IconButton>
                        <IconButton className='m-0' id={"DELETE"+group.Id} aria-label="delete sub group" onClick={
                          ()=>{
                            SelectedGroupID.current=group.id
                            SelectedGroupName.current=group.group_Name
                            SetDeleteShow(true)
                          }
                        }>
                        <HighlightOffSharpIcon/>
                        </IconButton>
                        </div>}>
                      {generateList(group.subGroups)}  
                      </TreeNode>
                    ))}
                  </>
                )
              }
          }
          return(<></>)
            }

    const HandleGroupAdd=(groupid,name)=>
    {
      variables.Group.SelectedGroup=groupid
      variables.Group.SelectedGroupName=name
      Dispatch({type:GroupSelectedTabActions.SelectAddGroup})
     
    } 
    
    const HandleGroupEdit=(groupid,name)=>
    {
      variables.Group.SelectedGroup=groupid
      variables.Group.SelectedGroupName=name
      Dispatch({type:GroupSelectedTabActions.SelectEditGroup}) 
    } 
    
    let handleAddNewGroup=()=>{
      variables.Group.SelectedGroup=variables.UserInformations.info.joinedGroups[0].id
      variables.Group.SelectedGroupName=variables.UserInformations.info.joinedGroups[0].group_Name
      Dispatch({type:GroupSelectedTabActions.SelectAddGroup})
    }
    let handleModifyParentGroup=()=>{
      variables.Group.SelectedGroup=variables.UserInformations.info.joinedGroups[0].id
      variables.Group.SelectedGroupName=variables.UserInformations.info.joinedGroups[0].group_Name
      Dispatch({type:GroupSelectedTabActions.SelectEditGroup})
    }
  return (
    <>
      
      <Row>
      <FormControlLabel className='mb-3'
          control={
            <Switch  name="ViewMode" onClick={()=>{ViewMode=="Tabular"?SetViewMode("Tree"):SetViewMode("Tabular")}} />
          }
          label={ViewMode+" Mode"}
        />
      </Row>
      
      
      
      
       <Row>
       {ViewMode=="Tabular"&&<>
       <Paper sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
        <div style={{ textAlign: "right" }}>
      <MDBBtn outline className='mx-2 m-2' color='secondary' onClick={handleAddNewGroup}> Add New SubGroup</MDBBtn>
      <MDBBtn outline className='mx-2 m-2' color='secondary' onClick={handleModifyParentGroup}>Modifty Group</MDBBtn>
      <MDBBtn outline className='mx-2 m-2' color='secondary' onClick={()=>{
        SelectedGroupID.current=variables.UserInformations.info.joinedGroups[0].id
        SelectedGroupName.current=variables.UserInformations.info.joinedGroups[0].group_Name
        SetDeleteShow(true)}}> Delete Group </MDBBtn>
       </div>
       </Paper>
       <Paper sx={{ width: '100%', m: 1,p:2 ,textAlign: "center" }}>
       <TableContainer>
       <div style={{ textAlign: "center", margin:"1rem" }}>
       <Groups2SharpIcon style={{Margin:"1rem"}}/>
        <h1>{"Groups Of "+variables.UserInformations.info.joinedGroups[0].group_Name}</h1>
        </div>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
           <TableCell></TableCell> 
            <TableCell align="left"></TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
            
          </TableRow>
        </TableHead>
        <TableBody>
        {DeleteShow&&<AlertDialog SetDeleteModal={SetDeleteShow} GroupName={SelectedGroupName.current} GroupID={SelectedGroupID.current} DeleteShow={DeleteShow}/> }
          {
            
            variables.UserInformations.info.joinedGroups[0].subGroups.map((Group)=>{
            return(<TRow key={hashRandom()} HandleGroupAdd={HandleGroupAdd} HandleGroupEdit={HandleGroupEdit}  SetGroupName={SelectedGroupName} SetGroupID={SelectedGroupID} SetDeleteModal={SetDeleteShow} Group={Group}/>)
            })

            
          }  
          {variables.UserInformations.info.joinedGroups[0].subGroups.length==0&&<><TableRow>
            <TableCell> </TableCell>
            
            <TableCell><div className="card-body text-center"><p >You don't have any sub groups</p></div> </TableCell>
            <TableCell> </TableCell>
            
          </TableRow></>} 
        </TableBody>
      </Table>
      
    </TableContainer>
    </Paper>
    </>
}

{ViewMode=="Tree"&&
        <div className="card mb-4 mb-xl-0">      
                <div className="card-header d-flex justify-content-center"> List Of Groups</div>
                <div className="card-body text-center">
                <div className="mb-3">
                 <MDBContainer breakpoint="sm">
                <Tree  key={"NAVTREE"} label={<p><AdjustSharpIcon/></p>}>
                   {(generateList(variables.UserInformations.info.joinedGroups))}
                      </Tree> 
                      {DeleteShow&&<AlertDialog SetDeleteModal={SetDeleteShow} GroupName={SelectedGroupName.current} GroupID={SelectedGroupID.current} DeleteShow={DeleteShow}/> }
                            </MDBContainer> 
                        </div>
                    
                    <div className="small font-italic text-muted mb-4">
                    </div>  
                </div>
                
        </div> }
        </Row>  
    
 

  

</>
  );
}