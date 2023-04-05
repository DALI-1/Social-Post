import * as React from 'react';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddSubGroupContent.css';
import {CALL_API_With_JWTToken,CALL_API_With_JWTToken_GET} from '../../libs/APIAccessAndVerification'
import {AppContext} from "../../context/Context"
import * as variables from "../../variables/variables"
import Container from 'react-bootstrap/Container';
import { Tree, TreeNode } from 'react-organizational-chart';
import { MDBRadio,MDBContainer} from 'mdb-react-ui-kit';
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import AdjustSharpIcon from '@mui/icons-material/AdjustSharp';
import {hashRandom } from 'react-hash-string'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import {HeaderSpinnerActions,GroupSelectedTabActions}  from '../../variables/variables'
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
                                   
                                   if( property==="GROUPDELETED")
                                   {
                                    toast.success("The Group and all of's childs has been deleted successfully!", {
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
                                  //Updatng our local values
                                  let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETPERSONALINFO
                                        let UserToken=window.localStorage.getItem("AuthToken")
                                        let APIResult=CALL_API_With_JWTToken_GET(url,UserToken)
                                        
                                        APIResult.then(result=>{ 
                                                 variables.UserInformations.info=result
                                                 variables.UserInformations.info.passwordHash=null
                                                 variables.UserInformations.info.passwordSalt=null
                                                 
                                                 Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner})
                                                 Dispatch({type:GroupSelectedTabActions.SelectManageGroup})
                                               handleClose()
                                          })    
                                  
                                  
                                  

                                  
  })
  .catch(()=>{
   
Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
  })
}

  const handleClose = () => {
    setOpen(false);
    props.SetDeleteModal(false)
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
                    {subGroups.map((group,index) => 

                    {
                      CheckboxList.current=[...CheckboxList.current,{"CheckboxID":"GROUP"+group.id}]
                      return(<TreeNode key={"GROUPTREEKEY"+group.id} label={<div><Groups2SharpIcon/> <p>{group.group_Name}</p> {group.id===variables.Group.SelectedGroup?<MDBRadio disabled key={"GROUPK"+group.id} id={"GROUP"+group.id} onClick={HandlePermissionShow} name="SubGroup" style={{margin:"0px"}}/>:<MDBRadio key={"GROUPK"+group.id} id={"GROUP"+group.id} onClick={HandlePermissionShow} name="SubGroup" style={{margin:"0px"}}/>}</div>}>
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
          
          variables.Group.GroupMenuItems=ListOfVisibleMenuItemsForTheSelection


          let JsonObjectToSend="{\"groupId\":"+"\""+GetParentID(variables.UserInformations.info.joinedGroups,variables.Group.SelectedGroup)+"\"}"
          
          let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_GETGROUPINFO
          let UserToken=window.localStorage.getItem("AuthToken")
          let APIResult=CALL_API_With_JWTToken(url2,JsonObjectToSend,UserToken)
          Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})
         
          APIResult.then((res)=>{
           SetSelectedParentGroupMenuItems(res[0].menuItems)
           SetSelectedParentGroupActions(res[0].menuActions)
         
           Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
          
          })
          .catch(()=>{
      
            Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
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
if(checkbox.clicked===true)
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
            if(action.clicked===true)
            {
             
                JsonObject.newSubGroupActions=[...JsonObject.newSubGroupActions,{id:action.Actionid.toString(),menuItemId:action.menuItemId.toString()}]
            }
          })

         console.log(JsonObject)
        JsonObject=JSON.stringify(JsonObject)
         let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_MOVEGROUP
         let UserToken=window.localStorage.getItem("AuthToken")
         let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
         Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})
        
         APIResult.then((result)=>
         {
           for( var property in result)
                               {
                                   
                                   if( property==="GROUPMOVED")
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
                                               if(RenderValue===true)
                                               ReRender(false)
                                               else
                                               ReRender(true)
                                        })
                                   }
                                   if( property==="SELECTEDGROUPDOESNTEXIST")
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
                                   if( property==="CANNOTCREATEGROUPWITHOUTACTIONS")
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
                                  
                                   if( property==="ParentGroupDoesntExist")
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
                                   if( property==="DESTINATIONISTHESELECTEDGROUP")
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
                                   
                                   if( property==="GROUPMOVEDUNDERHISOWNCHILD")
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
       
                               
              Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
      }).catch(()=>{
       
Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
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
     

      let destinationselected=false
      
      var SelectedCbox
         CheckboxList.current.map((CB)=>{
        
          var Cbox=document.getElementById(CB.CheckboxID)
          if(Cbox.checked)
          {
            SelectedCbox=Cbox
            destinationselected=true
          }})
          if(!destinationselected)
          {
            
          
      var SelectedGroupID=variables.Group.SelectedGroup
          

          var JsonObject={"groupId":SelectedGroupID,"newSubGroupActions":[]}
          ListOfActionSelection.current.map((action)=>{
            if(action.clicked===true)
            {
              JsonObject.newSubGroupActions=[...JsonObject.newSubGroupActions,{id:action.Actionid.toString(),menuItemId:action.menuItemId.toString()}]
            }
           }) 
        JsonObject=JSON.stringify(JsonObject)
         let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CHANGEGROUPPERMISSION
         let UserToken=window.localStorage.getItem("AuthToken")
         let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
         Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})

         APIResult.then((result)=>
         {
           for( var property in result)
                               {
                                   
                                   if( property==="GROUPPERMISSIONCHANGED")
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
                                   if(property==="GROUPDOESNTEXIST")
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

                                   if(property==="GROUPNEEDMOREPERMISSIONS")
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
  

                              
                               Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
  }).catch(()=>{

   
    Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
  })
}
else
{
  
   toast.error('Please Cancel the group move before saving the permissions !', {
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
    
const HandleChangeName=()=>{

  var SelectedGroupID=variables.Group.SelectedGroup
  var JsonObject={"groupId":SelectedGroupID,"group_Name":GroupNameInput.current.value}
          
        JsonObject=JSON.stringify(JsonObject)
         let url2=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_CHANGEGROUPNAME
         let UserToken=window.localStorage.getItem("AuthToken")
         let APIResult=CALL_API_With_JWTToken(url2,JsonObject,UserToken)
         Dispatch({type:HeaderSpinnerActions.TurnOnRequestSpinner})

         APIResult.then((result)=>
         {
           for( var property in result)
                               {
                                   
                                   if( property==="GROUPNAMECHANGED")
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
                                            if(RenderValue===true)
                                            ReRender(false)
                                            else
                                            ReRender(true)
                                     })
                                  }
                                }
                                
                                Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
         }).catch(()=>{
         
          Dispatch({type:HeaderSpinnerActions.TurnOffRequestSpinner}) 
         })

}
  return (
    <>
        
        <Row className="d-flex">
         
           
            <Col className="d-flex">
            <div className="card mb-4 ">
               <div className="card-header d-flex justify-content-center">Group permissions</div>
               <div className="card-body ">
                {GlobalState.RequestSpinner===true?<p className="d-flex justify-content-center">Please wait, loading your group permissions....</p>:
                
                <Container>
                <Row className="d-flex">
                {ListOfViewsToShow.length>0&&<>
                 {ListOfViewsToShow.map((view,index)=>{

                   return(
                     <Col key={index} className="d-flex">
                    <div className="card mb-4">
                    <div className="card-header d-flex justify-content-center" style={{minWidth:"250px"}}>{view.menuItemName}</div>
                    <div className="card-body">
                    

                     {ListOfPermToShow.map((action)=>{
                       //Showing the action if the action is in the proper menu
                       if(action.menuItemId===view.id)
                       {
                         let UserGotThePerm=false
                         variables.Group.SelectedGroupPermissions.map((SelectedGroupAction)=>{
                           if(SelectedGroupAction.id===action.id)
                           {
                           
                             UserGotThePerm=true}
                           
                         })
                         if(UserGotThePerm===true)
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
                               if(ListOfActionSelection.current[action.id].clicked===true)
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
                               if(ListOfActionSelection.current[action.id].clicked===true)
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
                   
                    {ListOfViewsToShow.length===0&&<>
                    
                 {SelectedParentGroupMenuItems.map((view,index)=>{

                   return(
                     <Col key={index} className="d-flex">
                    <div className="card mb-4">
                     
                    <div className="card-header d-flex justify-content-center" style={{minWidth:"250px"}}>{view.menuItemName}</div>
                    <div className="card-body ">
                       {SelectedParentGroupActions.map((action)=>{
                         //Showing the action if the action is in the proper menu
                         if(action.menuItemId===view.id)
                         {
                           let UserGotThePerm=false
                           variables.Group.SelectedGroupPermissions.map((SelectedGroupAction)=>{
                             if(SelectedGroupAction.id===action.id)
                             {
                             
                               UserGotThePerm=true}
                             
                           })
                           if(UserGotThePerm===true)
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
                                 if(ListOfActionSelection.current[action.id].clicked===true)
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
                                 if(ListOfActionSelection.current[action.id].clicked===true)
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
                
                }
                  
                   
               </div>
               <input className="btn btn-primary"style={{margin:"1rem"}} onClick={HandlePermissionSave} type="submit" value="Save Permissions"/> 
           </div>
            
            
            </Col>

            <Col className="d-flex">
          
          <div className="card mb-4" style={{margin:"2px"}}>   
                  <div className="card-header d-flex justify-content-center">
                    Select where you wanna move the group {variables.Group.SelectedGroupName} under
                  </div>
                  <div className="card-body text-center">
                  <div className="mb-3">
                   <MDBContainer breakpoint="sm">
                  <Tree key={"MOVETREE"} label={<p><AdjustSharpIcon/></p>}>
                     {generateList(variables.UserInformations.info.joinedGroups)}
                        </Tree> 
     
                              </MDBContainer> 
                             
                          </div>
                  </div>
                  <input className="btn btn-primary"style={{margin:"1rem"}} onClick={MoveGroup} type="submit" value="Move Group"/>
                  <input className="btn btn-primary"style={{margin:"1rem"}} onClick={CancelGroupMove} type="submit" value="Cancel Group Move"/>
              </div>
              </Col>
        
      </Row>

      <Row>
      <Col className="d-flex">
      <div className="card mb-4 mb-xl-0 mt-2" style={{margin:"2px"}}>   
                <div className="card-header d-flex justify-content-center">
                  Change Group Name
                </div>
                <div className="card-body text-center">
                <div className="mb-3">
                 <label className="small mb-1" htmlFor="inputUsername">Modify Group Name</label>
                 <input ref={GroupNameInput}  className="form-control" name="GroupName"  type="text" placeholder="Enter your Group Name" required={true}/>           
                        </div>
             
                </div>
                <input  onClick={HandleChangeName} style={{margin:"1rem"}} className="btn btn-primary" type="submit" value="Change Group Name"/>
            </div>
        </Col>

        <Col  className="d-flex">
        <div className="card mb-4 mb-xl-0 mt-2" style={{margin:"2px"}}>   
                <div className="card-header d-flex justify-content-center">
                 Delete Group
                </div>
                <div className="card-body text-center">
                <div className="mb-3">
                
                     <p>If you want to delete the group from the hiearchy click her, Be careful, if the group is deleted, there is no come back, this is permanent!</p>      
                        {DeleteModal&&<AlertDialog SetDeleteModal={SetDeleteModal} GroupName={variables.Group.SelectedGroupName} GroupID={variables.Group.SelectedGroup}/> }
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