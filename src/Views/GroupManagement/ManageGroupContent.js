import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import {toast } from 'react-toastify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import {HeaderSpinnerActions}  from '../../variables/variables'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import 'react-toastify/dist/ReactToastify.css';
import './AddSubGroupContent.css';
import {GroupSelectedTabActions} from '../../variables/variables';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import SettingsApplicationsSharpIcon from '@mui/icons-material/SettingsApplicationsSharp';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Tree, TreeNode } from 'react-organizational-chart';
import {MDBContainer} from 'mdb-react-ui-kit';
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import AdjustSharpIcon from '@mui/icons-material/AdjustSharp';
import {hashRandom } from 'react-hash-string'
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import MainCard from "../../components/UI/cards/MainCard"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Accordion from 'react-bootstrap/Accordion';
import * as PermissionLib from "../../libs/PermissionsChecker"
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Fade from '@mui/material/Fade'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { Avatar } from "@nextui-org/react";
import GroupIcon from "../../Assets/Group.png"
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
                                   
                                   if( property==="GROUPDELETED")
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

                                    if(property==="IMPOSSIBLETODELETEGROUPUNDERROOT")
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
                                for( var property in result)
                                {
                                  if(property=="UserExistButNoGroup_deleting")
                                  {
                                   
                                    
                                    window.localStorage.removeItem("AuthToken")
                                    window.localStorage.setItem("IsRemembered",false)
                                    window.localStorage.removeItem('SelectedTab')                                          
                                    window.location.replace('/login')
                                    handleClose()
                                    
                                    
                                  } else
                                  {
                                    variables.UserInformations.info=result
                                    variables.UserInformations.info.passwordHash=null
                                    variables.UserInformations.info.passwordSalt=null
                                    Dispatch({type:variables.SelectGroupActions.SetSelectedGroup,value:0})
                                    Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})
                                    handleClose()
                                  }
                                }
                                        
                                       
                                        
                                 })
                                 
                                  
                                  
                                  
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
          <Button variant="outlined" color="error" onClick={handleGroupDelete}>
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
      if (props!==undefined)
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
                <Groups2SharpIcon color="primary" style={{Margin:"1rem"}}/>
                  {"         "+props.group_Name}
                </TableCell>
                <TableCell align="left">
                {PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Add_GroupAction)&&<IconButton color="primary" aria-label="Add sub group" onClick={()=>{parameter.HandleGroupAdd(props.id,props.group_Name)}}>
                <AddCircleSharpIcon/>
                </IconButton>}
               
                
                </TableCell>  
                <TableCell> {PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Edit_GroupAction)&&<IconButton color="primary" aria-label="Edit sub group" onClick={()=>{parameter.HandleGroupEdit(props.id,props.group_Name)}}> 
                <SettingsApplicationsSharpIcon/>
                </IconButton>}</TableCell>
                <TableCell>{PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Remove_GroupAction)&&<IconButton color="error" aria-label="delete sub group"onClick={()=>{
                  parameter.SetGroupID.current=props.id
                  parameter.SetGroupName.current=props.group_Name
                  parameter.SetDeleteModal(true)
                  }}>
                <HighlightOffSharpIcon/>
                </IconButton>}</TableCell>
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
    GenerateRadioBoxList([variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0]])
  },[])
    const {GlobalState,Dispatch}=React.useContext(AppContext)  
    let SelectedGroupName=React.useRef("")
    let SelectedGroupID=React.useRef("")
    let ListOfRadioButtons=React.useRef([])
   
    let [DeleteShow,SetDeleteShow]=React.useState(false)
    let[ViewMode,SetViewMode]=React.useState("Tabular");

    //This recurssive function save the radio boxes IDs in a table so later it be used to identify which subgroup we under
    function GenerateRadioBoxList(subGroups) {
           if(subGroups!==null)
           {
             if(subGroups.length!==0)
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
            if(subGroups!==null)
           {
             if(subGroups.length!==0)
             {
                return (
                  <>
                    {subGroups.map((group,index) => ( 
                      <TreeNode key={index}  label={<div id={"DIVGROUP"+group.id}
                       ><Groups2SharpIcon  /> <p>{group.group_Name}</p>


                   
                   {PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Add_GroupAction)&&<IconButton color="primary" className='m-0' id={"ADD"+group.id}  aria-label="Add sub group"
                   onClick={()=>{HandleGroupAdd(group.id,group.group_Name)}}
                    >
                        <AddCircleSharpIcon />
                        </IconButton>
                      }
                          {PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Edit_GroupAction)&&<IconButton color="primary"  className='m-0' id={"MODIFY"+group.id} aria-label="Modify sub group"
                          onClick={()=>{HandleGroupEdit(group.id,group.group_Name)}}
                          >
                        <SettingsApplicationsSharpIcon/>
                        </IconButton>}
                        {PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Remove_GroupAction)&&<IconButton color="error" className='m-0' id={"DELETE"+group.Id} aria-label="delete sub group" onClick={
                          ()=>{
                            SelectedGroupID.current=group.id
                            SelectedGroupName.current=group.group_Name
                            SetDeleteShow(true)
                          }
                        }>
                        <HighlightOffSharpIcon/>
                        </IconButton>}
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
      variables.Group.SelectedGroup=variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].id
      variables.Group.SelectedGroupName=variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].group_Name
      Dispatch({type:GroupSelectedTabActions.SelectAddGroup})
    }
    let handleModifyParentGroup=()=>{
      variables.Group.SelectedGroup=variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].id
      variables.Group.SelectedGroupName=variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].group_Name
      Dispatch({type:GroupSelectedTabActions.SelectEditGroup})
    }
 
   
  return (
    <>
       <Row>
       {ViewMode==="Tabular"&&<>
       <MainCard sx={{ width: '100%', m: 1 ,textAlign: "center",boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
        <div style={{ textAlign: "right" }}>
        
{PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Add_GroupAction)&&<Button  variant="outlined"color="primary"className="mx-2 m-2"startIcon={<AddIcon/>} onClick={handleAddNewGroup}> Add New SubGroup</Button>}

{PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Edit_GroupAction)&& <Button  variant="outlined"color="primary"className="mx-2 m-2"startIcon={<EditIcon/>} onClick={
  ()=>
  {
    if(variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].createdUserId==variables.UserInformations.info.id)
    {
      handleModifyParentGroup()
    }
    else
    {
      toast.error("You don't have the permission to Edit this group, you're not the owner.", {
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
  
  
  }>Modifty Group</Button>}
{PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Remove_GroupAction)&&<Button  variant="outlined"color="error"className="mx-2 m-2"startIcon={<DeleteIcon/>} onClick={()=>{
        if(variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].createdUserId==variables.UserInformations.info.id)
        {
          SelectedGroupID.current=variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].id
        SelectedGroupName.current=variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].group_Name
        SetDeleteShow(true)
        }
        else
        {
          toast.error("You don't have the permission to delete this group, you're not the owner.", {
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
        }}> Delete Group </Button>}

       </div>
       </MainCard>
       <MainCard sx={{ width: '100%', m: 1,p:2 ,textAlign: "center",boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>

       <Accordion  defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col>
              <Avatar size="xl" style={{marginRight:"0.5rem"}} src={GroupIcon} color="primary" zoomed/>
              </Col>              
            
            
            
            <Col>
               <p style={{marginTop:"1rem"}}>List Of SubGroups</p>
              </Col>
              <Col >
              <Tooltip style={{marginTop:"0.5rem"}} title="The is a Tabular visualization of your groups hiearchy." TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
          </Accordion.Header>
        <Accordion.Body>
        <TableContainer>
       <div style={{ textAlign: "center", margin:"1rem" }}>
       <Groups2SharpIcon   color="primary" style={{Margin:"1rem"}}/>
        <h4>{"Groups Of "+variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].group_Name}</h4>
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
            
            variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].subGroups.map((Group)=>{
            return(<TRow key={hashRandom()} HandleGroupAdd={HandleGroupAdd} HandleGroupEdit={HandleGroupEdit}  SetGroupName={SelectedGroupName} SetGroupID={SelectedGroupID} SetDeleteModal={SetDeleteShow} Group={Group}/>)
            })

            
          } 
           
          {variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].subGroups.length===0&&<><TableRow>
            <TableCell> </TableCell>
            
            <TableCell><div className="card-body text-center"><p >You don't have any sub groups</p></div> </TableCell>
            <TableCell> </TableCell>
            
          </TableRow></>} 
        </TableBody>
      </Table>
      
    </TableContainer>

        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>  
      
    </MainCard>
    </>
}

{ViewMode==="Tree"&&
<>
<MainCard sx={{ width: '100%', m: 1 ,textAlign: "center",boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
<div style={{ textAlign: "right" }}>

{PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Add_GroupAction)&&<Button  variant="outlined"color="primary"className="mx-2 m-2"startIcon={<AddIcon/>} onClick={handleAddNewGroup}> Add New SubGroup</Button>}

{PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Edit_GroupAction)&& <Button  variant="outlined"color="primary"className="mx-2 m-2"startIcon={<EditIcon/>} onClick={
  ()=>
  {
    if(variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].createdUserId==variables.UserInformations.info.id)
    {
      handleModifyParentGroup()
    }
    else
    {
      toast.error("You don't have the permission to Edit this group, you're not the owner.", {
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
  
  
  }>Modifty Group</Button>}
{PermissionLib.ValidateAction(variables.MenuItems.Group_MenuItem,variables.MenuItemActions.Remove_GroupAction)&&<Button  variant="outlined"color="error"className="mx-2 m-2"startIcon={<DeleteIcon/>} onClick={()=>{
        if(variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].createdUserId==variables.UserInformations.info.id)
        {
          SelectedGroupID.current=variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].id
        SelectedGroupName.current=variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].group_Name
        SetDeleteShow(true)
        }
        else
        {
          toast.error("You don't have the permission to delete this group, you're not the owner.", {
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
        }}> Delete Group </Button>}

</div>
</MainCard>
        <MainCard sx={{ width: '100%', m: 1 ,textAlign: "center",boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}> 

        <Accordion  defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col>
              <Avatar size="xl" style={{marginRight:"0.5rem"}} src={GroupIcon} color="primary" zoomed/>
              </Col>              
            
            
            
            <Col>
               <p style={{marginTop:"1rem"}}>List Of SubGroups</p>
              </Col>
              <Col >
              <Tooltip style={{marginTop:"0.5rem"}} title="The is a Tree visualization of your groups hiearchy." TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
          </Accordion.Header>
        <Accordion.Body>
        
              
        
               
                
                 <MDBContainer breakpoint="sm">
                <Tree  key={"NAVTREE"} label={<p><AdjustSharpIcon/></p>}>
                   {(generateList(variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].subGroups))}
                      </Tree> 
                      {DeleteShow&&<AlertDialog SetDeleteModal={SetDeleteShow} GroupName={SelectedGroupName.current} GroupID={SelectedGroupID.current} DeleteShow={DeleteShow}/> }
                            </MDBContainer> 
                        
                    
                    
                
                
              
        
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>     
                
        </MainCard></> }
        </Row>

        <Row>
      <FormControlLabel className='mb-3'
          control={
            <Switch  name="ViewMode" onClick={()=>{ViewMode==="Tabular"?SetViewMode("Tree"):SetViewMode("Tabular")}} />
          }
          label={ViewMode+" Mode"}
        />
      </Row>  
    
 

  

</>
  );
}