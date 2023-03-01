import * as React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddSubGroupContent.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import Container from 'react-bootstrap/Container';
import { Tree, TreeNode } from 'react-organizational-chart';
import { MDBRadio,MDBContainer, MDBRow, MDBCol,MDBCheckbox } from 'mdb-react-ui-kit';
import { Card, CardBody, CardFooter,CardHeader,Checkbox, CheckboxGroup } from '@chakra-ui/react'
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import AdjustSharpIcon from '@mui/icons-material/AdjustSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import {hashString,hashRandom } from 'react-hash-string'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
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
      console.log(ListOfActions)
      AllMenuItems=variables.UserInformations.info.joinedGroups[0].menuItems
     let ListOfVisibleMenuItemsForTheSelection=[]
   
      if(ListOfActions!=null)
      {
        ListOfActions.forEach((action)=>
        {
           var MenuItemExist=false
          //Search through the List if we already added it from previous actions
          if(ListOfVisibleMenuItemsForTheSelection.length>0)
          {
            ListOfVisibleMenuItemsForTheSelection.forEach((MenuItem)=>
            {
              if(MenuItem.id==action.menuItemId)
              {
               MenuItemExist=true
              }
            })
          }
           //If we didnt add it, we go to the list of all MenuItems and we add it to the List of VissibleMenuItems
           if(MenuItemExist==false)
           { 
            AllMenuItems.forEach((mi)=>
            {
              if(mi.id==action.menuItemId)
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
                      <TreeNode   label={<div><Groups2SharpIcon/> <p>{group.group_Name}</p> <MDBRadio  key={"GROUPK"+group.id} id={"GROUP"+group.id} onClick={HandlePermissionShow} name="SubGroup" style={{margin:"0px"}}/></div>}>
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
          
          if(subGroups[i].id.toString()!=id)
          {      
            if(subGroups[i].subGroups!=null)
             { {if(subGroups[i].subGroups.length!=0)                
                  localres=GetPermissionList(subGroups[i].subGroups,id)
                  if(localres!=null)
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
      GenerateRadioBoxList(variables.UserInformations.info.joinedGroups)
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
      if(action.clicked==true)
      {
        JsonObject.subGroupActions=[...JsonObject.subGroupActions,{id:action.Actionid.toString(),menuItemId:action.menuItemId.toString()}]
      }
     }) 

      let JsonObjectToSend=JSON.stringify(JsonObject)
      let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CREATESUBGROUP
      let UserToken=window.localStorage.getItem("AuthToken")
      let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
      APIResult.then((result)=>
      {
        for( var property in result)
                            {
                                
                                if( property=="SubGroupNameAlreadyUsed")
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
                                if( property=="ParentGroupDoesntExist")
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
                                if( property=="CANNOTCREATEGROUPWITHOUTACTIONS")
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
                                if( property=="SubGroupCreated")
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
                                        APIResult.then(result=>{ 
                                                 variables.UserInformations.info=result
                                                 variables.UserInformations.info.passwordHash=null
                                                 variables.UserInformations.info.passwordSalt=null
                                                 if(RenderValue==true)
                                                 ReRender(false)
                                                 else
                                                 ReRender(true)
                                          })
                                }
                                
                                
                                
                            }

      })
      .catch((error)=>{

      })
    }
  return (
    <>
        
        <Row>
          <Col>
          
        <div className="card mb-4 mb-xl-0" style={{margin:"2px"}}>   
                <div className="card-header d-flex justify-content-center">
                  Selected Group to Modify
                </div>
                <div className="card-body text-center">
                <div className="mb-3">
                 <MDBContainer breakpoint="sm">
                <Tree label={<p><AdjustSharpIcon/></p>}>
                   {generateList(variables.UserInformations.info.joinedGroups)}
                      </Tree> 
   
                            </MDBContainer> 
                        </div>
                </div>
            </div>
            </Col>
            <Col>
          
          <div className="card mb-4 mb-xl-0" style={{margin:"2px"}}>   
                  <div className="card-header d-flex justify-content-center">
                    Move Group To
                  </div>
                  <div className="card-body text-center">
                  <div className="mb-3">
                   <MDBContainer breakpoint="sm">
                  <Tree label={<p><AdjustSharpIcon/></p>}>
                     {generateList(variables.UserInformations.info.joinedGroups)}
                        </Tree> 
     
                              </MDBContainer> 
                          </div>
                  </div>
              </div>
              </Col>
            <Col>
            <div className="card mb-4 mb-xl-0 " style={{margin:"2px"}}>   
                <div className="card-header d-flex justify-content-center">
                  Change Group Name
                </div>
                <div className="card-body text-center">
                <div className="mb-3">

                 <label className="small mb-1" htmlFor="inputUsername">Modify Group Name</label>
                 <input  className="form-control" name="GroupName" id="inputUsername" type="text" placeholder="Enter your Group Name" required />           
                    <input className="btn btn-primary"style={{marginTop:"1rem"}} type="submit" value="Change Group Name"/>
                    <input className="btn btn-primary"style={{marginTop:"1rem"}} type="submit" value="Move Group"/>
                        </div>
             
                </div>
            </div>
            
            </Col>
        
      </Row>

      <Row>
      <Col>
            <div className="card mb-4 mt-5">
               <div className="card-header d-flex justify-content-center"> Sub Group permissions</div>
               <div className="card-body ">
                   <Container>
                   <Row>
                   {ListOfViewsToShow.length==0&&<p className='d-flex justify-content-center'>Select a group to view the possible permissions under that group</p>}
                    {ListOfViewsToShow.map((view)=>{

                      return(
                        <Col>
                       <div className="card mb-4">
                       <div className="card-header d-flex justify-content-center" style={{minWidth:"250px"}}>{view.menuItemName}</div>
                       <div className="card-body">
                       

                        {ListOfPermToShow.map((action)=>{
                          
                          if(action.menuItemId==view.id)
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
                                if(ListOfActionSelection.current[action.id].clicked==true)
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
                       </div>
                       </Col>
                      )
                    })}
                       
                   </Row>
                   
                   </Container>
               </div>
               
           </div>
        </Col>
      </Row>

  

</>
  );
}