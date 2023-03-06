import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
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

function TRow (parameter){
  let [open, setOpen] = React.useState(false);
  let props=parameter.Group
      if (props!=undefined)
      {
       
          return (
            <React.Fragment>
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                
                <TableCell align="left">{props.group_Name}
                
               
                
                </TableCell>
                <TableCell align="left">
                <IconButton color="primary" aria-label="Add sub group">
                <AddCircleSharpIcon/>
                </IconButton>
               
                
                </TableCell>  
                <TableCell> <IconButton color="primary" aria-label="delete sub group">
                <SettingsApplicationsSharpIcon/>
                </IconButton></TableCell>
                <TableCell><IconButton color="primary" aria-label="delete sub group">
                <HighlightOffSharpIcon/>
                </IconButton></TableCell>
              </TableRow>
              
              
                  <Collapse in={open} timeout="auto" unmountOnExit>
                  <TableRow  sx={{ '& > *': { borderBottom: 'unset' }}}>
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
                        return(<TRow Group={grp}/>)
                      })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                :<TableHead>
                
                
                  <p>No SubGroups found</p>
                  
               
                
              </TableHead> 
                  }
                     </TableCell>
              </TableRow>
                  </Collapse>
                  
                 
            </React.Fragment>
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
   
    let ListOfActionSelection=React.useRef([])
    let GroupNameInput=React.useRef()
    let ListOfRadioButtons=React.useRef([])
   
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
                    {subGroups.map((group) => ( 
                      <TreeNode   label={<div id={"DIVGROUP"+group.id}
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
                        <IconButton className='m-0' id={"DELETE"+group.Id} aria-label="delete sub group">
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
       {ViewMode=="Tabular"&&
       <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="left">Group Name</TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {
            variables.UserInformations.info.joinedGroups[0].subGroups.map((Group)=>{
            return(<TRow Group={Group}/>)
            })
          }   
        </TableBody>
      </Table>
    </TableContainer>
}

{ViewMode=="Tree"&&
        <div className="card mb-4 mb-xl-0">      
                <div className="card-header d-flex justify-content-center"> List Of Groups</div>
                <div className="card-body text-center">
                <div className="mb-3">
                 <MDBContainer breakpoint="sm">
                <Tree label={<p><AdjustSharpIcon/></p>}>
                   {(generateList(variables.UserInformations.info.joinedGroups))}
                      </Tree> 
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