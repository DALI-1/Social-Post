import * as React from 'react';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddSubGroupContent.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'

import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Tree, TreeNode } from 'react-organizational-chart';
import { MDBRadio,MDBContainer} from 'mdb-react-ui-kit';
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import AdjustSharpIcon from '@mui/icons-material/AdjustSharp';
import {hashRandom } from 'react-hash-string'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {HeaderSpinnerActions}  from '../../variables/variables'
import MainCard from "../../components/UI/cards/MainCard"
import Button from '@mui/material/Button';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Fade from '@mui/material/Fade'; 
import IconButton from '@mui/material/IconButton';
import Accordion from 'react-bootstrap/Accordion';
import { Avatar } from "@nextui-org/react";
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)

    const [ListOfViewsToShow,SetListOfViewsToShow]=React.useState([]);
    const [ListOfPermToShow,SetListOfPermToShow]=React.useState([]);
    
    let ListOfActionSelection=React.useRef([])
    let GroupNameInput=React.useRef()
    let ListOfRadioButtons=React.useRef([])
    let [RenderValue,ReRender]=React.useState(false)
     //This gonna call a recurssive function to get the permissions that it should show for selected radio Button
    const HandlePermissionShow=(props)=>{
      ListOfActionSelection.current=[]
      let ListOfActions=[]
      let AllMenuItems=[]
      let IDOfGroup=props.target.id.replace("GROUP","")
      ListOfActions= GetPermissionList(variables.UserInformations.info.joinedGroups,IDOfGroup)
      
      AllMenuItems=variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0].menuItems
     let ListOfVisibleMenuItemsForTheSelection=[]
   
      if(ListOfActions!==null)
      {
        ListOfActions.forEach((action)=>
        {
           var MenuItemExist=false
          //Search through the List if we already added it from previous actions
          if(ListOfVisibleMenuItemsForTheSelection.length>0)
          {
            ListOfVisibleMenuItemsForTheSelection.forEach((MenuItem)=>
            {
              if(MenuItem.id===action.menuItemId)
              {
               MenuItemExist=true
              }
            })
          }
           //If we didnt add it, we go to the list of all MenuItems and we add it to the List of VissibleMenuItems
           if(MenuItemExist===false)
           { 
            AllMenuItems.forEach((mi)=>
            {
              if(mi.id===action.menuItemId)
              ListOfVisibleMenuItemsForTheSelection=[...ListOfVisibleMenuItemsForTheSelection,mi]
            })
           }
        })  
        SetListOfPermToShow(ListOfActions)
        SetListOfViewsToShow(ListOfVisibleMenuItemsForTheSelection)
      }
      else
      {
        SetListOfPermToShow([])
        SetListOfViewsToShow([])
      }
    }
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
                      <TreeNode key={index}  label={<div><Groups2SharpIcon/> <p>{group.group_Name}</p> <MDBRadio  key={"GROUPK"+group.id} id={"GROUP"+group.id} onClick={HandlePermissionShow} name="SubGroup" style={{margin:"0px"}}/></div>}>
                      {generateList(group.subGroups)}  
                      </TreeNode>
                    ))}
                  </>
                )
              }
          }
          return(<></>)
            }
//This recurssive function is gonna go through the tree recurssively till she finds the group with the same id and returns the menu actions that it got
    function GetPermissionList(subGroups,id) {
        var res=null
        var localres=null
        for(let i=0;i<subGroups.length;i++)
        {
          
          if(subGroups[i].id.toString()!==id)
          {      
            if(subGroups[i].subGroups!==null)
             { {if(subGroups[i].subGroups.length!==0)                
                  localres=GetPermissionList(subGroups[i].subGroups,id)
                  if(localres!==null)
                  res=localres
              }}
          }
          else
          {
            res=subGroups[i].menuActions 
            break
          } 
        } 
          return res
    }
    React.useEffect(()=>{
      //Saving all the checkboxes Ids in the table so later we can access the checkbox buttons and know which one is selected
      //ListOfRadioButtons.current=[...ListOfRadioButtons.current,"GROUP"+variables.UserInformations.info.joinedGroups[0].id]
      GenerateRadioBoxList([variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0]])
      var defaultselectedGroup=document.getElementById("GROUP"+variables.Group.SelectedGroup)
         defaultselectedGroup.click()
    },[])
    //This function update the status of the switch button if its selected
    const UpdateActionSelection=(id,clickstatus)=>{
      ListOfActionSelection.current[id].clicked=clickstatus
    }
    const CreateSubGroup=(props)=>
    {
      props.preventDefault()
      let JsonObject={parentGroupId:"",groupName:GroupNameInput.current.value,subGroupActions:[]}
     ListOfRadioButtons.current.forEach((RadioButton)=>{

if(document.getElementById(RadioButton).checked)
{
  JsonObject.parentGroupId=document.getElementById(RadioButton).id.replace("GROUP","") 
}
     })
     JsonObject.groupName=GroupNameInput.current.value;
     ListOfActionSelection.current.map((action)=>{
      if(action.clicked===true)
      {
        JsonObject.subGroupActions=[...JsonObject.subGroupActions,{id:action.Actionid.toString(),menuItemId:action.menuItemId.toString()}]
      }
     }) 
          
      let JsonObjectToSend=JSON.stringify(JsonObject)
      
      let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CREATESUBGROUP
      let UserToken=window.localStorage.getItem("AuthToken")
      let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
      Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})
      
      APIResult.then((result)=>
      {
        for( var property in result)
                            {
                              
                                
                                if( property==="SubGroupNameAlreadyUsed")
                                {
                                    
                                    toast.error('The SubGroup Name already exist, please use an other one', {
                                        position: "bottom-left",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                        });  
                                    break
                                }
                                if( property==="ParentGroupDoesntExist")
                                {
                                    toast.error('The  Group Parent Just got deleted by someone, SubGroup creation failed', {
                                        position: "bottom-left",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                        });
                                        break
                                }
                                if( property==="CANNOTCREATEGROUPWITHOUTACTIONS")
                                {
                                    toast.error('You cannot create a group with zero permissions, minimum is view for at least one menu', {
                                        position: "bottom-left",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                        });
                                        break
                                }
                                if( property==="SubGroupCreated")
                                {
                                    toast.success('Sub Group successfully created!', {
                                        position: "bottom-left",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                        });
                                        //Updating our SubGroups info
                                        let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETPERSONALINFO
                                        let UserToken=window.localStorage.getItem("AuthToken")
                                        let APIResult=CALL_API_With_JWTToken_GET(url,UserToken)
                                        Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})
                                        APIResult.then(result=>{ 
                                                 variables.UserInformations.info=result
                                                 variables.UserInformations.info.passwordHash=null
                                                 variables.UserInformations.info.passwordSalt=null
                                                 if(RenderValue===true)
                                                 ReRender(false)
                                                 else
                                                 ReRender(true)
                                                 Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})
                                          })
                                }
                                
                                
                                
                            }

                           
                            Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})                  
      })
      .catch((error)=>{
  
        Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
      })
    }
  return (
    <>

       <Row >
        <Col >
        <MainCard>

        <Accordion  defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col>
              <Avatar size="xl" style={{marginRight:"0.5rem"}} src="https://firebasestorage.googleapis.com/v0/b/socialpost-58454.appspot.com/o/PlatformsLogo%2Fgroup-icon-png-15.png?alt=media&token=a5459dd5-4176-49bf-a4b7-95a559dd93cf" color="primary" zoomed/>
              </Col>              
            
            
            
            <Col>
               <p style={{marginTop:"1rem"}}>Group Details & Location.</p>
              </Col>
              <Col >
              <Tooltip style={{marginTop:"0.5rem"}} title="Here you can choose where to create the sub-group within the hiearchy and input the group name" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
          </Accordion.Header>
        <Accordion.Body>
        <form onSubmit={CreateSubGroup}>
                
               
                <div className="mb-3">
                 <MDBContainer breakpoint="sm">
                <Tree key={"ADDTREE"} label={<p><AdjustSharpIcon/></p>}>
                   {generateList([variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0]])}
                      </Tree> 
                      {GenerateRadioBoxList([variables.UserInformations.info.joinedGroups.filter((p)=>p.id==GlobalState.SelectedGroup.id)[0]])}
                      
                            <label  className="small m-2" htmlFor="GroupName">Sub Group Name</label>
                            <input ref={GroupNameInput} className="form-control" name="GroupName" id="inputUsername" type="text" placeholder="Enter your Group Name" required />
                            </MDBContainer> 
                        </div>
                    
                    <Button variant="outlined" color='primary' className="m-1 form-control"type="submit" startIcon={<GroupAddIcon />}>Create Sub Group</Button>
                   
              
                </form>

        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion>  
               
            </MainCard>
        </Col>
        <Col>
        <MainCard>
               
        <Accordion  defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
        <Container style={{display:"flex",justifyContent:"left",alignItems:"center"}}>
            <Row>
              <Col>
              <Avatar size="xl" style={{marginRight:"0.5rem"}} src="https://firebasestorage.googleapis.com/v0/b/socialpost-58454.appspot.com/o/PlatformsLogo%2FCyber-Security-Logo-PNG.png?alt=media&token=86492f23-f2b2-4786-ae38-06b922d017f6" color="primary" zoomed/>
              </Col>              
            
            
            
            <Col >
               <p style={{marginTop:"1rem"}}> Group Permissions</p>
              </Col>
              <Col >
              <Tooltip style={{marginTop:"0.5rem"}} title="Here is the permissions you want your sub-group to have.
                    NOTE: The permissions that you can see depend heavily on the parent group's permissions, if it doesn't have a permission, so is this, it won't have it as an option , you need to change the parent's permissions in order for it to be available for all of the subgroups." TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}><IconButton> <HelpOutlineIcon /></IconButton></Tooltip> 
              </Col>
            </Row>
          </Container>
          </Accordion.Header>
        <Accordion.Body>

        <Container>
                   <Row >
                   {ListOfViewsToShow.length===0&&<p className='d-flex justify-content-center'>Select a group to view the possible permissions under that group</p>}
                    {ListOfViewsToShow.map((view,index)=>{

                      return(
                        <Col   key={index} >
                       <MainCard className="mb-4">
                       <div>{view.menuItemName}</div>
                       <div className="card-body">
                        {ListOfPermToShow.length===0&&<p>Select a group to view the possible permissions under that group</p>}

                        {ListOfPermToShow.map((action)=>{
                          
                          if(action.menuItemId===view.id)
                          {
                            ListOfActionSelection.current[action.id]={Actionid:action.id,menuItemName:view.menuItemName,menuItemId:action.menuItemId,clicked:false}
                            return ( 
                            <Form.Check 
                              key={hashRandom()}
                              type="switch"
                              defaultChecked={false}
                              autoComplete="off"
                              autoSave="off"
                              label={action.actionName}
                              onClick={()=>{
                                if(ListOfActionSelection.current[action.id].clicked===true)
                                {UpdateActionSelection(action.id,false)}
                                else
                                {
                                  UpdateActionSelection(action.id,true)
                                }

                              }}
                              
                              />)
                          }
                          
                        })}

                       </div>
                       </MainCard>
                       </Col>
                      )
                    })}
                       
                   </Row>
                   
                   </Container>
        </Accordion.Body>
      </Accordion.Item>
     
    </Accordion> 
                   
               
               
           </MainCard>
        </Col>
      
      </Row>  
  

    
 

  

</>
  );
}