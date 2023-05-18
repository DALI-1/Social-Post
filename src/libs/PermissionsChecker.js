
import { APIStatuses } from '../variables/variables';
import {ServerInternalError,ServerConnectionLostError}from "../Exceptions/Exceptions" ;
import  {APIStatus}from "../variables/variables"
import {toast } from 'react-toastify';
import * as variables from "../variables/variables"
import {AppContext} from "../context/Context"
import * as React from 'react';
//This is an Async method which will call our API, url is the API path, data is the json data, the format should follow our DTO format in the backend
export  const  ValidateAction =  (MenuItemID,MenuItemActionID)=>
  {
    const {GlobalState}=React.useContext(AppContext)
    var SelectedGroupInfo=null
    var Selected_GroupID=GlobalState.SelectedGroup.id
    var MenuItemExist_Flag=false
    var MenuItemActionExist_Flag=false
    if(variables.UserInformations.info!=null)
    {
  
          //We iterate through the groups till we find the group we in and their permissions
          variables.UserInformations.info.joinedGroups.map((Group)=>{
            if(Group.id==Selected_GroupID)
            {
              SelectedGroupInfo=Group
            }
          })
          if(SelectedGroupInfo!=null)
          {
            SelectedGroupInfo.menuItems.map((mItem)=>{
              if(mItem.id==MenuItemID)
              {
                MenuItemExist_Flag=true
              }
            })
          }
          //If the menu item exist, we dig deeper for the menu action if it exists
          if(MenuItemExist_Flag)
          {
            SelectedGroupInfo.menuActions.map((permission)=>{
                if(permission.id==MenuItemActionID)
                  {
                    MenuItemActionExist_Flag=true
                  }
            })
          }

          if(MenuItemExist_Flag&&MenuItemActionExist_Flag)
          {
          return true 
          }
          else
          {
            return false
          } 
    }else
    {
      
      return false
    }
  }
  export  const  ValidateMenuItem =  (MenuItemID)=>
  {
    const {GlobalState}=React.useContext(AppContext)
    var Selected_GroupID=GlobalState.SelectedGroup.id
    var SelectedGroupInfo=null
    var MenuItemExist_Flag=false
    if(variables.UserInformations.info!=null)
    {
          //We iterate through the groups till we find the group we in and their permissions
          variables.UserInformations.info.joinedGroups.map((Group)=>{

            if(Group.id==Selected_GroupID)
            {
              SelectedGroupInfo=Group
            }
          })

          if(SelectedGroupInfo!=null)
          {
            SelectedGroupInfo.menuItems.map((mItem)=>{

              if(mItem.id==MenuItemID)
              {
                MenuItemExist_Flag=true
              }
            })
          }



          if(MenuItemExist_Flag)
          {
          return true 
          }
          else
          {
            return false
          }
    }
    else
    {
      return false
    }
    
      

  }
