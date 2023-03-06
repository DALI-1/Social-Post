import * as React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddSubGroupContent.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import Container from 'react-bootstrap/Container';
import { Tree, TreeNode } from 'react-organizational-chart';
import { MDBRadio,MDBContainer, MDBRow, MDBCol,MDBCheckbox,MDBModal,MDBBtn,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter, } from 'mdb-react-ui-kit';
import { Card, CardBody, CardFooter,CardHeader,Checkbox, CheckboxGroup } from '@chakra-ui/react'
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import AdjustSharpIcon from '@mui/icons-material/AdjustSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import {hashString,hashRandom } from 'react-hash-string'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';



export  function Modal(props) {
  const [basicModal, setBasicModal] = React.useState(true);

  const toggleShow = () => {setBasicModal(!basicModal);
props.DeleteState(!basicModal)
  }
  return (
    <>
      
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Modal title</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>Modal body text goes here.</MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
export default function Content() {

    const {GlobalState,Dispatch}=React.useContext(AppContext)

    const [ListOfViewsToShow,SetListOfViewsToShow]=React.useState([]);
    const [ListOfPermToShow,SetListOfPermToShow]=React.useState([]);
    let [SelectedGroupMenuItems,SetSelectedGroupMenuItems]=React.useState([]);
    let [SelectedGroupActions,SetSelectedGroupActions]=React.useState([]);
    
    let [SelectedParentGroupMenuItems,SetSelectedParentGroupMenuItems]=React.useState([]);
    let [SelectedParentGroupActions,SetSelectedParentGroupActions]=React.useState([]);

    let [DeleteModal,SetDeleteModal]=React.useState(false);

    let GroupNameInput=React.useRef()
    let CheckboxList=React.useRef([])
    let ListOfActionSelection=React.useRef([])

    let ListOfRadioButtons=React.useRef([])
    let [RenderValue,ReRender]=React.useState(false)
     //This gonna call a recurssive function to get the permissions that it should show for selected radio Button
    const HandlePermissionShow=(props)=>{
      ListOfActionSelection.current=[]
      let ListOfActions=[]
      let AllMenuItems=[]
      let IDOfGroup=props.target.id.replace("GROUP","")
      ListOfActions= GetPermissionList(variables.UserInformations.info.joinedGroups,IDOfGroup)
      
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
                    {subGroups.map((group) => 

                    {
                      CheckboxList.current=[...CheckboxList.current,{"CheckboxID":"GROUP"+group.id}]
                      return(<TreeNode   label={<div><Groups2SharpIcon/> <p>{group.group_Name}</p> {group.id==variables.Group.SelectedGroup?<MDBRadio disabled key={"GROUPK"+group.id} id={"GROUP"+group.id} onClick={HandlePermissionShow} name="SubGroup" style={{margin:"0px"}}/>:<MDBRadio key={"GROUPK"+group.id} id={"GROUP"+group.id} onClick={HandlePermissionShow} name="SubGroup" style={{margin:"0px"}}/>}</div>}>
                      {generateList(group.subGroups)}  
                      </TreeNode>)
                    }
                      
                    )}
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

    function GetParentID(subGroups,id) {
      var res=null
      var localres=null
      for(let i=0;i<subGroups.length;i++)
      {
        
        if(subGroups[i].id.toString()!=id)
        {      
          if(subGroups[i].subGroups!=null)
           { {if(subGroups[i].subGroups.length!=0)                
                localres=GetParentID(subGroups[i].subGroups,id)
                if(localres!=null)
                res=localres
            }}
        }
        else
        {
          res=subGroups[i].parentGroupId
          break
        } 
      } 
        return res
  }
    React.useEffect(()=>{
      //Saving all the checkboxes Ids in the table so later we can access the checkbox buttons and know which one is selected
      //ListOfRadioButtons.current=[...ListOfRadioButtons.current,"GROUP"+variables.UserInformations.info.joinedGroups[0].id]
      GenerateRadioBoxList(variables.UserInformations.info.joinedGroups)
     let ListOfActions= GetPermissionList(variables.UserInformations.info.joinedGroups,variables.Group.SelectedGroup)
     //Calculating the menu items that this group can see
        variables.Group.SelectedGroupPermissions=ListOfActions
       var AllMenuItems=variables.UserInformations.info.joinedGroups[0].menuItems
       
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
          
          variables.Group.GroupMenuItems=ListOfVisibleMenuItemsForTheSelection


          let JsonObjectToSend="{\"groupId\":"+"\""+GetParentID(variables.UserInformations.info.joinedGroups,variables.Group.SelectedGroup)+"\"}"
          
          let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETGROUPINFO
          let UserToken=window.localStorage.getItem("AuthToken")
          let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
          APIResult.then((res)=>{
           SetSelectedParentGroupMenuItems(res[0].menuItems)
           SetSelectedParentGroupActions(res[0].menuActions)
          
          })


          SetSelectedGroupMenuItems(ListOfVisibleMenuItemsForTheSelection)
          SetSelectedGroupActions(ListOfActions)
        }
    },[])
    //This function update the status of the switch button if its selected
    const UpdateActionSelection=(id,clickstatus)=>{
      ListOfActionSelection.current[id].clicked=clickstatus
    }
    const CancelGroupMove=()=>{

ListOfActionSelection.current.map((checkbox)=>{
if(checkbox.clicked==true)
{
  checkbox.clicked=false
 CheckboxList.current.map((CB)=>{

  var Cbox=document.getElementById(CB.CheckboxID)
  if(Cbox.checked)
  {
    Cbox.checked=false
  }
 })
}
})
SetListOfViewsToShow([])
SetListOfPermToShow([])
    }

    let MoveGroup=()=>
    {
 
      //Checking if the user selected a destination hiearchy or not
      let destinationselected=false
      
      var SelectedCbox
         CheckboxList.current.map((CB)=>{
        
          var Cbox=document.getElementById(CB.CheckboxID)
          if(Cbox.checked)
          {
            SelectedCbox=Cbox
            destinationselected=true
          }})
         
        if(destinationselected)
        {

          var DestGroupID=SelectedCbox.id.replace("GROUP","")
          var SelectedGroupID=variables.Group.SelectedGroup
          

          var JsonObject={"parentGroupId":DestGroupID,"groupId":SelectedGroupID,"newSubGroupActions":[]}
          ListOfActionSelection.current.map((action)=>{
            if(action.clicked==true)
            {
                JsonObject.newSubGroupActions=[...JsonObject.newSubGroupActions,{id:action.Actionid.toString(),menuItemId:action.menuItemId.toString()}]
            }
          })

         
        JsonObject=JSON.stringify(JsonObject)
         let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_MOVEGROUP
         let UserToken=window.localStorage.getItem("AuthToken")
         let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
         APIResult.then((result)=>
         {
           for( var property in result)
                               {
                                   
                                   if( property=="GROUPMOVED")
                                   {
                                    toast.success('Group Successsfully moved!', {
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
                                   if( property=="SELECTEDGROUPDOESNTEXIST")
                                   {
                                    toast.error(' The group you selected doesnt exist anymore', {
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
                                   if( property=="CANNOTCREATEGROUPWITHOUTACTIONS")
                                   {
                                    toast.error('You must select some actions for the group!', {
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
                                  
                                   if( property=="ParentGroupDoesntExist")
                                   {
                                    toast.error('The parent group doesnt exist anymore', {
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
                                   if( property=="DESTINATIONISTHESELECTEDGROUP")
                                   {
                                    toast.error('Invalid destination, please select an other destination!', {
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
                                   
                                   if( property=="GROUPMOVEDUNDERHISOWNCHILD")
                                   {
                                    toast.error('You cant move the group under its own child!', {
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
      })
    }
        else
        {
          toast.error('Select where you want your group at !', {
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
    
    let HandlePermissionSave=()=>{
     

      var SelectedGroupID=variables.Group.SelectedGroup
          

          var JsonObject={"groupId":SelectedGroupID,"newSubGroupActions":[]}
          ListOfActionSelection.current.map((action)=>{
            if(action.clicked==true)
            {
              JsonObject.newSubGroupActions=[...JsonObject.newSubGroupActions,{id:action.Actionid.toString(),menuItemId:action.menuItemId.toString()}]
            }
           }) 
        JsonObject=JSON.stringify(JsonObject)
         let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CHANGEGROUPPERMISSION
         let UserToken=window.localStorage.getItem("AuthToken")
         let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
         APIResult.then((result)=>
         {
           for( var property in result)
                               {
                                   
                                   if( property=="GROUPPERMISSIONCHANGED")
                                   {
                                    toast.success('Group Permissions Successfully updated!', {
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
                                               GenerateRadioBoxList(variables.UserInformations.info.joinedGroups)
                                               let ListOfActions= GetPermissionList(variables.UserInformations.info.joinedGroups,variables.Group.SelectedGroup)
                                               //Calculating the menu items that this group can see
                                                  variables.Group.SelectedGroupPermissions=ListOfActions
                                                 var AllMenuItems=variables.UserInformations.info.joinedGroups[0].menuItems
                                                 
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
                                                    
                                                    variables.Group.GroupMenuItems=ListOfVisibleMenuItemsForTheSelection
                                          
                                          
                                                    let JsonObjectToSend="{\"groupId\":"+"\""+GetParentID(variables.UserInformations.info.joinedGroups,variables.Group.SelectedGroup)+"\"}"
                                                    
                                                    let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETGROUPINFO
                                                    let UserToken=window.localStorage.getItem("AuthToken")
                                                    let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
                                                    APIResult.then((res)=>{
                                                     SetSelectedParentGroupMenuItems(res[0].menuItems)
                                                     SetSelectedParentGroupActions(res[0].menuActions)
                                                    
                                                    })
                                          
                                          
                                                    SetSelectedGroupMenuItems(ListOfVisibleMenuItemsForTheSelection)
                                                    SetSelectedGroupActions(ListOfActions)
                                                  }
                                        })
                                   }
                                   if(property=="GROUPDOESNTEXIST")
                                   {
                                    toast.error('The selected group doesnt exist anymore, permission update ', {
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

                                   if(property=="GROUPNEEDMOREPERMISSIONS")
                                   {
                                    toast.error('You need at least 1 permission per group!', {
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
  })
}
    
const HandleChangeName=()=>{

  var SelectedGroupID=variables.Group.SelectedGroup
  var JsonObject={"groupId":SelectedGroupID,"group_Name":GroupNameInput.current.value}
          
        JsonObject=JSON.stringify(JsonObject)
         let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CHANGEGROUPNAME
         let UserToken=window.localStorage.getItem("AuthToken")
         let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
         APIResult.then((result)=>
         {
           for( var property in result)
                               {
                                   
                                   if( property=="GROUPNAMECHANGED")
                                   {
                                    toast.success('The name of the group Successfully updated!', {
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

}
  return (
    <>
        
        <Row>
          <Col>
          
        <div className="card mb-4 mb-xl-0" style={{margin:"2px"}}>   
                <div className="card-header d-flex justify-content-center">
                  Select where you wanna move the group {variables.Group.SelectedGroupName} under
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
                <input className="btn btn-primary"style={{margin:"1rem"}} onClick={MoveGroup} type="submit" value="Move Group"/>
                <input className="btn btn-primary"style={{margin:"1rem"}} onClick={CancelGroupMove} type="submit" value="Cancel Group Move"/>
            </div>
            </Col>
           
            <Col>
            <div className="card mb-4 ">
               <div className="card-header d-flex justify-content-center">Group permissions</div>
               <div className="card-body ">
                   <Container>
                   <Row>
                   {ListOfViewsToShow.length>0&&<>
                    {ListOfViewsToShow.map((view)=>{

                      return(
                        <Col>
                       <div className="card mb-4">
                       <div className="card-header d-flex justify-content-center" style={{minWidth:"250px"}}>{view.menuItemName}</div>
                       <div className="card-body">
                       

                        {ListOfPermToShow.map((action)=>{
                          //Showing the action if the action is in the proper menu
                          if(action.menuItemId==view.id)
                          {
                            let UserGotThePerm=false
                            variables.Group.SelectedGroupPermissions.map((SelectedGroupAction)=>{
                              if(SelectedGroupAction.id==action.id)
                              {
                              
                                UserGotThePerm=true}
                              
                            })
                            if(UserGotThePerm==true)
                            {
                              ListOfActionSelection.current[action.id]={Actionid:action.id,menuItemName:view.menuItemName,menuItemId:action.menuItemId,clicked:true}
                              return ( 
                              <Form.Check 
                                key={hashRandom()}
                                type="switch"
                                defaultChecked={true}
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
                            else
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
                           
                          }
                          
                        })}

                       </div>
                       </div>
                       </Col>
                      )
                    })}
                       </>}
                      
                       {ListOfViewsToShow.length==0&&<>
                       
                    {SelectedParentGroupMenuItems.map((view)=>{

                      return(
                        <Col>
                       <div className="card mb-4">
                        
                       <div className="card-header d-flex justify-content-center" style={{minWidth:"250px"}}>{view.menuItemName}</div>
                       <div className="card-body ">
                          {SelectedParentGroupActions.map((action)=>{
                            //Showing the action if the action is in the proper menu
                            if(action.menuItemId==view.id)
                            {
                              let UserGotThePerm=false
                              variables.Group.SelectedGroupPermissions.map((SelectedGroupAction)=>{
                                if(SelectedGroupAction.id==action.id)
                                {
                                
                                  UserGotThePerm=true}
                                
                              })
                              if(UserGotThePerm==true)
                              {
                                ListOfActionSelection.current[action.id]={Actionid:action.id,menuItemName:view.menuItemName,menuItemId:action.menuItemId,clicked:true}
                                return ( 
                                <Form.Check 
                                  key={hashRandom()}
                                  type="switch"
                                  defaultChecked={true}
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
                              else
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
                             
                            }
                            
                          
                          
                          })}

                       </div>
                       </div>
                       
                       </Col>
                      )
                    })}
                       </>}
                   </Row>
                   
                   </Container>
                   
               </div>
               <input className="btn btn-primary"style={{margin:"1rem"}} onClick={HandlePermissionSave} type="submit" value="Save Permissions"/> 
           </div>
            
            
            </Col>
        
      </Row>

      <Row>
      <Col>
      <div className="card mb-4 mb-xl-0 mt-2" style={{margin:"2px"}}>   
                <div className="card-header d-flex justify-content-center">
                  Change Group Name
                </div>
                <div className="card-body text-center">
                <div className="mb-3">
                 <label className="small mb-1" htmlFor="inputUsername">Modify Group Name</label>
                 <input ref={GroupNameInput}  className="form-control" name="GroupName"  type="text" placeholder="Enter your Group Name" required />           
                        </div>
             
                </div>
                <input  onClick={HandleChangeName} style={{margin:"1rem"}} className="btn btn-primary" type="submit" value="Change Group Name"/>
            </div>
        </Col>

        <Col>
        <div className="card mb-4 mb-xl-0 mt-2" style={{margin:"2px"}}>   
                <div className="card-header d-flex justify-content-center">
                 Delete Group
                </div>
                <div className="card-body text-center">
                <div className="mb-3">
                
                     <p>If you want to delete the group from the hiearchy click her, Be careful, if the group is deleted, there is no come back, this is permanent!</p>      
                        {DeleteModal&&<Modal DeleteState={SetDeleteModal}/> }
                        </div>
                </div>
               
                <input className="btn btn-danger"style={{margin:"1rem"}} onClick={()=>{
                
                  SetDeleteModal(!DeleteModal)
                }} type="submit" value="Delete Group"/>
            </div>
            </Col>
        
      </Row>

     

  

</>
  );
}