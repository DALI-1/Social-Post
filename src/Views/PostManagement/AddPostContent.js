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
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import SelectMUI from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import FacebookPostClone from "../../components/FacebookComps/FBPostBoxClone"
import AddMentionDialog from "../../components/AddPostComps/AddMentionDialog"
import AddTargetDialog from "../../components/AddPostComps/AddTargetDialog"
import AddLocationDialog from "../../components/AddPostComps/AddLocationDialog"
import AddDynamicFieldDialog from "../../components/AddPostComps/AddDynamicFieldDialog"
import AddAssetsDialog from "../../components/AddPostComps/AddAssetsDialog"
import SendIcon from '@mui/icons-material/Send';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import ImageDeleter from "../../components/PostAssetsManagement/ImageDeleter"

import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Filter1Icon from '@mui/icons-material/Filter1';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {hashRandom } from 'react-hash-string'
import ImageTagDialog from "../../components/AddPostComps/AddImageTagDialog"
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IconButton from '@mui/material/IconButton';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
export const FirstPane=React.forwardRef(({handleEditorChange,handlePageSelectionChange,handleAssetSelectionChange},ref)=> {
  
  //--------------------Variables specific the posting options------------------------------//
  const editorRef =React.useRef(null)
  const Post_DateInput=React.useRef(dayjs(variables.PostGlobalVariables.POST_Scheduler_Selected_DateTime))
  const Post_RepeatCheckbox=React.useRef(false)
  const Post_RepeatingOptionDropDownList=React.useRef(1)
  //const Post_Repeat_EveryInput=React.useRef(null)
  const Post_EndRepeatRadioBox=React.useRef(1)
  const Post_EndRepeatOnNbOfOccurencesInput=React.useRef(null)
  const Post_EndRepeatAfterDateInput=React.useRef(null)
  ///-----------------------------------End of variabiles specific to Posting options--------------------///
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
  //----------------------------------------Variables related to the Options, DynamicField, Assets, mentions--------------------///
  const {GlobalState,Dispatch}=React.useContext(AppContext)
   //States related to showing the Dialogs
   const [ShowAddMentionDialog,SetShowAddMentionDialog]=React.useState(false)
   const [ShowAddLocationDialog,SetShowAddLocationDialog]=React.useState(false)
   const [ShowAddTargetDialog,SetShowAddTargetDialog]=React.useState(false)
   const [ShowAssetsDialog,SetShowAssetsDialog]=React.useState(false)
   const [ShowDynamicFieldDialog,SetShowDynamicFieldDialog]=React.useState(false)
   const [Assets,SetAssets]=React.useState([])
   const [SelectedAssets,SetSelectedAssets]=React.useState([])
   const [ShowImageTagDialog,SetShowImageTagDialog]=React.useState(false)
   const [InfoTag,SetInfoTag]=React.useState(false)
   //----------------------------------------End of Variables related to the Options, DynamicField, Assets, mentions--------------------///
   React.useEffect(()=>{
    variables.PostGlobalVariables.POST_SelectedAssetsInfo=Assets
    handleAssetSelectionChange()
   },[Assets])

   
   
  const HandlePostSchedule=(()=>{

    let EditorContent=editorRef.current.getContent()
    let Post_Date=Post_DateInput.current
    let Repeat=Post_RepeatCheckbox.current
    let RepeatDropDownListSelection=Post_RepeatingOptionDropDownList.current
    //let Repeat_Every=Post_Repeat_EveryInput.current
    let EndRepeatRadioBoxValue=Post_EndRepeatRadioBox.current
    let EndRepeatOnNbOfOccurencesValue=Post_EndRepeatOnNbOfOccurencesInput.current
    let EndRepeatAfterDate=Post_EndRepeatAfterDateInput.current
    let INSTAGRAM_Page_Exist_InSelection_Flag=false
    let POST_Txt=EditorContent.toString().split("<p>").join("").split("</p>").join("")
    if(Post_Date!=null)
    {
      if(EditorContent!="")
      {

        
        let ListOfPages=[]
        variables.PostGlobalVariables.POST_SelectedPageInfo.map((page)=>
        {
          if(page.PageType==2)
          {INSTAGRAM_Page_Exist_InSelection_Flag=true}
        ListOfPages=[...ListOfPages,{"pageID": page.id}]
        })
      
        if(ListOfPages.length!=0)
        {

          var AssetsList=[]

          Assets.map((Asset)=>{
            AssetsList=[...AssetsList,{ 
              assetID: Asset.AssetId
            }]
          })
         
          if(AssetsList.length==0 &&INSTAGRAM_Page_Exist_InSelection_Flag)
          {
            toast.info("You cannot create an Instagram Post without at least having picture added to it", {
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
          else
          {
            let ReFormatedTargetedLanguages=[]
            let ReFormatedTargetedLocations=[]
            let ReFormatedTargetedRegions=[]
            let ReFormatedTargetedCountries=[]
            let ReFormatedTargetedInterests=[]
        variables.PostGlobalVariables.POST_TargetedLanguages.map((Language)=>{
          ReFormatedTargetedLanguages=[...ReFormatedTargetedLanguages,
            {
            language_Name: Language.name,
            languagePlatform_Key: Language.key
          }]       
        })  
          //Reformating Location
        variables.PostGlobalVariables.POST_TargetedLocations.map((Location)=>{
          ReFormatedTargetedLocations=[...ReFormatedTargetedLocations,
            {
              location_Name: Location.name,
              location_Type: Location.type,
              location_PlatformCode: Location.key,
              location_RegionId:Location.region_id
          }]
        })      
          //Reformating Regions
        variables.PostGlobalVariables.POST_TargetedRegions.map((Region)=>{
          ReFormatedTargetedRegions=[...ReFormatedTargetedRegions,
            {    
              region_Name: Region.name,
              country_PlatformId: Region.country_code,
              region_PlatformCode: Region.key
          }]

        })   
          //Reformating Countries
        variables.PostGlobalVariables.POST_TargetedCountries.map((Country)=>{    
          ReFormatedTargetedCountries=[...ReFormatedTargetedCountries,
            {
             
              country_Name: Country.name,
              country_Key: Country.key,
              country_PlatformCode: Country.country_code
          }]
        })
         //Reformating Interests
        variables.PostGlobalVariables.POST_TargetedInterests.map((Interest)=>{
          ReFormatedTargetedInterests=[...ReFormatedTargetedInterests,
            {
              interest_Name:Interest.name,
              interest_PlatformCode:Interest.id ,
              interest_Description: Interest.description,
              interest_Topic: Interest.topic
            
          }]
        })

              //-------------------------NOTE: Formating the Mentions for the backened--------------------------//
        // 1- Adding the platformaccounts to a list
        //2- Changing the Text and formating like this @[12345]  1235 is an example, it should be a platformaccountID
        let Formated_listOfMentionedPlatformAccounts=[]         
        variables.PostGlobalVariables.POST_Mentions.map((MentionedUser)=>{
          Formated_listOfMentionedPlatformAccounts=[...Formated_listOfMentionedPlatformAccounts,{mentionedPlatformAccount_ID:MentionedUser.MentionedUserID}]
          POST_Txt=POST_Txt.replace(MentionedUser.MentionText,"@["+MentionedUser.MentionedUserID+"]")
        })
         console.log(Formated_listOfMentionedPlatformAccounts)

        //-------------------------NOTE: END OF Formating the Mentions for the backened--------------------------//
            var JsonObject = {  
              postGroupID: GlobalState.SelectedGroup.id,
              postText: POST_Txt,
              repeatPost: Repeat,
              repeatOption: RepeatDropDownListSelection==1?"Hourly":RepeatDropDownListSelection==2?"Daily":RepeatDropDownListSelection==3?"Weekly":RepeatDropDownListSelection==4?"Monthly":RepeatDropDownListSelection==5?"Yearly":"BUG_IMPOSSIBLE_TO_REACH",
              endRepeatPost: EndRepeatRadioBoxValue==1?false:true,
              endRepeatOption: EndRepeatRadioBoxValue==1?"NoEnd":EndRepeatRadioBoxValue==2?"EndOccOption":"EndDateOption",
              endRepeatOnOccurence: EndRepeatRadioBoxValue==2?EndRepeatOnNbOfOccurencesValue:0,
              endRepeatAfterDate: EndRepeatRadioBoxValue==3?EndRepeatAfterDate:"2023-04-12T23:00:00.000Z",
              postDate: Post_DateInput.current,
              listOfPages:ListOfPages,
              listOfAssets: AssetsList,
              listOfTags:variables.PostGlobalVariables.POST_AssetsTags,
              listOfDynamicFields: variables.PostGlobalVariables.POST_AddedDynamicFields,

              listOfMentionedPlatformAccounts:Formated_listOfMentionedPlatformAccounts,
              target_AgeFrom: variables.PostGlobalVariables.POST_TargetedAgeRange.FromAge,
              target_AgeTo: variables.PostGlobalVariables.POST_TargetedAgeRange.ToAge,
              target_Gender: variables.PostGlobalVariables.POST_TargetedGenderId ,
              target_PlatformId: variables.PostGlobalVariables.POST_TargetSelectedPlatform,
              targeted_Countries: ReFormatedTargetedCountries,
              targeted_Regions: ReFormatedTargetedRegions,
              targeted_Locations: ReFormatedTargetedLocations,
              targeted_Languages: ReFormatedTargetedLanguages,
              targeted_Interests: ReFormatedTargetedInterests,
           };  
          let JsonObjectToSend = JSON.stringify(JsonObject);
          let url2 =
            process.env.REACT_APP_BACKENDURL + 
            process.env.REACT_APP_ADDPOST;
          let UserToken = window.localStorage.getItem("AuthToken");
          let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
          APIResult.then((result) => {
            if (result.errorCode == undefined) {
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
                Dispatch({type:variables.PostSelectedTabActions.SelectManagePosts})
              }
              
              
            }
          });
          }
        }
        else
        {
          toast.info("You cannot create a post without associating at least one page", {
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
      else
      {
        toast.info("You cannot create a post with an empty content", {
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
    else
    {
      toast.info("Post date for scheduled Posts cannot be empty, use Post Now instead if you don't want to specify the Post date", {
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

   
 
  })

  const HandlePostNow=(()=>{

    let EditorContent=editorRef.current.getContent()
    let Post_Date=Post_DateInput.current
    let Repeat=Post_RepeatCheckbox.current
    let RepeatDropDownListSelection=Post_RepeatingOptionDropDownList.current
    //let Repeat_Every=Post_Repeat_EveryInput.current
    let EndRepeatRadioBoxValue=Post_EndRepeatRadioBox.current
    let EndRepeatOnNbOfOccurencesValue=Post_EndRepeatOnNbOfOccurencesInput.current
    let EndRepeatAfterDate=Post_EndRepeatAfterDateInput.current
    let INSTAGRAM_Page_Exist_InSelection_Flag=false
    let POST_Txt=EditorContent.toString().split("<p>").join("").split("</p>").join("")
    if(Post_Date!=null)
    {
      if(EditorContent!="")
      {

        
        let ListOfPages=[]
        variables.PostGlobalVariables.POST_SelectedPageInfo.map((page)=>
        {
          if(page.PageType==2)
          {INSTAGRAM_Page_Exist_InSelection_Flag=true}
        ListOfPages=[...ListOfPages,{"pageID": page.id}]
        })
      
        if(ListOfPages.length!=0)
        {

          var AssetsList=[]

          Assets.map((Asset)=>{
            AssetsList=[...AssetsList,{ 
              assetID: Asset.AssetId
            }]
          })
         
          if(AssetsList.length==0 &&INSTAGRAM_Page_Exist_InSelection_Flag)
          {
            toast.info("You cannot create an Instagram Post without at least having picture added to it", {
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
          else
          {
            let ReFormatedTargetedLanguages=[]
            let ReFormatedTargetedLocations=[]
            let ReFormatedTargetedRegions=[]
            let ReFormatedTargetedCountries=[]
            let ReFormatedTargetedInterests=[]
        variables.PostGlobalVariables.POST_TargetedLanguages.map((Language)=>{
          ReFormatedTargetedLanguages=[...ReFormatedTargetedLanguages,
            {
            language_Name: Language.name,
            languagePlatform_Key: Language.key
          }]       
        })  
          //Reformating Location
        variables.PostGlobalVariables.POST_TargetedLocations.map((Location)=>{
          ReFormatedTargetedLocations=[...ReFormatedTargetedLocations,
            {
              location_Name: Location.name,
              location_Type: Location.type,
              location_PlatformCode: Location.key,
              location_RegionId:Location.region_id
          }]
        })      
          //Reformating Regions
        variables.PostGlobalVariables.POST_TargetedRegions.map((Region)=>{
          ReFormatedTargetedRegions=[...ReFormatedTargetedRegions,
            {    
              region_Name: Region.name,
              country_PlatformId: Region.country_code,
              region_PlatformCode: Region.key
          }]

        })   
          //Reformating Countries
        variables.PostGlobalVariables.POST_TargetedCountries.map((Country)=>{    
          ReFormatedTargetedCountries=[...ReFormatedTargetedCountries,
            {
             
              country_Name: Country.name,
              country_Key: Country.key,
              country_PlatformCode: Country.country_code
          }]
        })
         //Reformating Interests
        variables.PostGlobalVariables.POST_TargetedInterests.map((Interest)=>{
          ReFormatedTargetedInterests=[...ReFormatedTargetedInterests,
            {
              interest_Name:Interest.name,
              interest_PlatformCode:Interest.id ,
              interest_Description: Interest.description,
              interest_Topic: Interest.topic
            
          }]
        })
          //-------------------------NOTE: Formating the Mentions for the backened--------------------------//
        // 1- Adding the platformaccounts to a list
        //2- Changing the Text and formating like this @[12345]  1235 is an example, it should be a platformaccountID
          let Formated_listOfMentionedPlatformAccounts=[]         
        variables.PostGlobalVariables.POST_Mentions.map((MentionedUser)=>{
          Formated_listOfMentionedPlatformAccounts=[...Formated_listOfMentionedPlatformAccounts,{mentionedPlatformAccount_ID:MentionedUser.MentionedUserID}]
          POST_Txt=POST_Txt.replace(MentionedUser.MentionText,"@["+MentionedUser.MentionedUserID+"]")
        })
         

        //-------------------------NOTE: END OF Formating the Mentions for the backened--------------------------//
            var JsonObject = {  
              postGroupID: GlobalState.SelectedGroup.id,
              postText:POST_Txt ,
              repeatPost: Repeat,
              repeatOption: RepeatDropDownListSelection==1?"Hourly":RepeatDropDownListSelection==2?"Daily":RepeatDropDownListSelection==3?"Weekly":RepeatDropDownListSelection==4?"Monthly":RepeatDropDownListSelection==5?"Yearly":"BUG_IMPOSSIBLE_TO_REACH",
              endRepeatPost: EndRepeatRadioBoxValue==1?false:true,
              endRepeatOption: EndRepeatRadioBoxValue==1?"NoEnd":EndRepeatRadioBoxValue==2?"EndOccOption":"EndDateOption",
              endRepeatOnOccurence: EndRepeatRadioBoxValue==2?EndRepeatOnNbOfOccurencesValue:0,
              endRepeatAfterDate: EndRepeatRadioBoxValue==3?EndRepeatAfterDate:"2023-04-12T23:00:00.000Z",
              postDate: new Date(),
              listOfMentionedPlatformAccounts:Formated_listOfMentionedPlatformAccounts,
              listOfPages:ListOfPages,
              listOfAssets: AssetsList,
              listOfDynamicFields: variables.PostGlobalVariables.POST_AddedDynamicFields,
              listOfTags:variables.PostGlobalVariables.POST_AssetsTags,
              target_AgeFrom: variables.PostGlobalVariables.POST_TargetedAgeRange.FromAge,
              target_AgeTo: variables.PostGlobalVariables.POST_TargetedAgeRange.ToAge,
              target_Gender: variables.PostGlobalVariables.POST_TargetedGenderId ,
              target_PlatformId: variables.PostGlobalVariables.POST_TargetSelectedPlatform,
              targeted_Countries: ReFormatedTargetedCountries,
              targeted_Regions: ReFormatedTargetedRegions,
              targeted_Locations: ReFormatedTargetedLocations,
              targeted_Languages: ReFormatedTargetedLanguages,
              targeted_Interests: ReFormatedTargetedInterests,
           };
      
          let JsonObjectToSend = JSON.stringify(JsonObject);
          let url2 =
            process.env.REACT_APP_BACKENDURL + 
            process.env.REACT_APP_ADDPOST;
          let UserToken = window.localStorage.getItem("AuthToken");
          let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
          APIResult.then((result) => {
            if (result.errorCode == undefined) {
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
                //Dispatch({type:variables.PostSelectedTabActions.SelectManagePosts})
              }
              
              
            }
          });
          }
        }
        else
        {
          toast.info("You cannot create a post without associating at least one page", {
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
      else
      {
        toast.info("You cannot create a post with an empty content", {
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
    else
    {
      toast.info("Post date for scheduled Posts cannot be empty, use Post Now instead if you don't want to specify the Post date", {
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

   
   
  })

  
  //this is related to tiny mce custom buttons
  const LocationIcon=`<svg width="24" height="24" viewBox="-3 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="Dribbble-Light-Preview" transform="translate(-223.000000, -5439.000000)" fill="#000000">
          <g id="icons" transform="translate(56.000000, 160.000000)">
              <path d="M176,5286.219 C176,5287.324 175.105,5288.219 174,5288.219 C172.895,5288.219 172,5287.324 172,5286.219 C172,5285.114 172.895,5284.219 174,5284.219 C175.105,5284.219 176,5285.114 176,5286.219 M174,5296 C174,5296 169,5289 169,5286 C169,5283.243 171.243,5281 174,5281 C176.757,5281 179,5283.243 179,5286 C179,5289 174,5296 174,5296 M174,5279 C170.134,5279 167,5282.134 167,5286 C167,5289.866 174,5299 174,5299 C174,5299 181,5289.866 181,5286 C181,5282.134 177.866,5279 174,5279" id="pin_sharp_circle-[#624]">

</path>
          </g>
      </g>
  </g>
</svg>`
  const TargetIcon=`<svg fill="#000000" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 8c0-4.418 3.59-8 8-8 4.418 0 8 3.59 8 8 0 4.418-3.59 8-8 8-4.418 0-8-3.59-8-8zm2 0c0 3.307 2.686 6 6 6 3.307 0 6-2.686 6-6 0-3.307-2.686-6-6-6-3.307 0-6 2.686-6 6zm2 0c0-2.21 1.795-4 4-4 2.21 0 4 1.795 4 4 0 2.21-1.795 4-4 4-2.21 0-4-1.795-4-4zm2 0c0 1.112.895 2 2 2 1.112 0 2-.895 2-2 0-1.112-.895-2-2-2-1.112 0-2 .895-2 2z" fill-rule="evenodd"/>
</svg>`
  const MentionIcon = `<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="ic_fluent_mention_24_regular" fill="#212121" fill-rule="nonzero">
          <path d="M22,12 L22,13.75 C22,15.8210678 20.3210678,17.5 18.25,17.5 C16.7458289,17.5 15.4485014,16.6143971 14.8509855,15.3361594 C14.032894,16.3552078 12.8400151,17 11.5,17 C8.99236936,17 7,14.7419814 7,12 C7,9.25801861 8.99236936,7 11.5,7 C12.6590052,7 13.7079399,7.48235986 14.5009636,8.27192046 L14.5,7.75 C14.5,7.33578644 14.8357864,7 15.25,7 C15.6296958,7 15.943491,7.28215388 15.9931534,7.64822944 L16,7.75 L16,13.75 C16,14.9926407 17.0073593,16 18.25,16 C19.440864,16 20.4156449,15.0748384 20.4948092,13.9040488 L20.5,13.75 L20.5,12 C20.5,7.30557963 16.6944204,3.5 12,3.5 C7.30557963,3.5 3.5,7.30557963 3.5,12 C3.5,16.6944204 7.30557963,20.5 12,20.5 C13.032966,20.5 14.0394669,20.3160231 14.9851556,19.9612482 C15.3729767,19.8157572 15.8053117,20.0122046 15.9508027,20.4000257 C16.0962937,20.7878469 15.8998463,21.2201818 15.5120251,21.3656728 C14.3985007,21.7834112 13.2135869,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 C17.4292399,2 21.8479317,6.32667079 21.9961582,11.7200952 L22,12 L22,13.75 L22,12 Z M11.5,8.5 C9.86549502,8.5 8.5,10.047561 8.5,12 C8.5,13.952439 9.86549502,15.5 11.5,15.5 C13.134505,15.5 14.5,13.952439 14.5,12 C14.5,10.047561 13.134505,8.5 11.5,8.5 Z" id="🎨-Color">

</path>
      </g>
  </g>
</svg>`
const DynamicFIeldIcon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><path d="M0 96C0 60.7 28.7 32 64 32h96c123.7 0 224 100.3 224 224s-100.3 224-224 224H64c-35.3 0-64-28.7-64-64V96zm160 0H64V416h96c88.4 0 160-71.6 160-160s-71.6-160-160-160z"/></svg>'
const AssetsIcon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 576 512"><path d="M160 32c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H328 280 200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120z"/></svg>'

  const HandleAddMention = () => {
    SetShowAddMentionDialog(true)
    
  };
  const HandleAddLocation = () => {
    SetShowAddLocationDialog(true)
    
  };
  const HandleAddTarget = () => {
    SetShowAddTargetDialog(true)
    
  };

  const handleDynamicField = () => {
    SetShowDynamicFieldDialog(true)
  };

  const handleAssets = () => {
    SetShowAssetsDialog(true)
  };
  const toolbar = `
  undo redo | AddMention AddDynamicFIeld AddAssets AddTarget AddLocation emoticons |
`;
const init = {
  content_script: [
    '../../libs/tinymce/js/tinymce/tinymce.min.js'
  ],
  force_br_newlines:false,
  menubar: false,
  selector: '#my-editor',
  plugins: [
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
    editor.ui.registry.addIcon('Mention',MentionIcon)
    editor.ui.registry.addIcon('Assets',AssetsIcon)
    editor.ui.registry.addIcon('Target',TargetIcon)
    editor.ui.registry.addIcon('Location',LocationIcon)
     //adding the Add Target persona button on the menu
     editor.ui.registry.addButton('AddTarget', {
      icon:'Target',
      tooltip: 'Specify your post targets',
      onAction: HandleAddTarget
    })
    //adding the Add location button on the menu
    editor.ui.registry.addButton('AddLocation', {
      icon:'Location',
      tooltip: 'Specify your post targets',
      onAction: HandleAddLocation
    })
    //adding the Add mention button on the menu
    editor.ui.registry.addButton('AddMention', {
      icon:'Mention',
      tooltip: 'Add Mentions to your Post',
      onAction: HandleAddMention
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

const handlePageValueChange = (newValue) => {
let SelectedPagesInfos=[]
newValue.map((v)=>{

  console.log(v)
  //here we will be itterating through the List of Pages to grab each page's info
  PagesList.map((p)=>{
   if(p.id===v.id)
   {
    SelectedPagesInfos=[...SelectedPagesInfos,p]
   }
   
  })
})
variables.PostGlobalVariables.POST_SelectedPageInfo=SelectedPagesInfos
variables.PostGlobalVariables.POST_SelectedPageIds=newValue
variables.PostGlobalVariables.POST_AddedDynamicFields.map((DynamicField)=>{

variables.PostGlobalVariables.POST_PatternsInfo.map((Pattern)=>{

  if(Pattern.id==DynamicField.patternID)
  {
   RemoveDynamicFieldText(Pattern.patternText)
  }
})
})

CreateDefaultDynamicFields()
handlePageSelectionChange()
SetInfoTag(!InfoTag)
};


const CreateDefaultDynamicFields=()=>{

  let DefaultDynamicFields=[1,2,3,4]
 let LocalDynamicFieldList=[]
  DefaultDynamicFields.map((e)=>{

    //Handling the Name default dynamicfield
    if(e==1)
    {
       let locallistOfPagesDynamicFieldsValues=[]
       variables.PostGlobalVariables.POST_SelectedPageInfo.map((page)=>{
       locallistOfPagesDynamicFieldsValues=[...locallistOfPagesDynamicFieldsValues,{pageID:page.id,dynamicFieldValue:page.label}]
       })     
       LocalDynamicFieldList=[...LocalDynamicFieldList,{listOfPagesDynamicFieldValues:locallistOfPagesDynamicFieldsValues,patternID:e}]
    }
    //Handling the website default dynamicfield
    else if(e==2)
    {let locallistOfPagesDynamicFieldsValues=[]
      variables.PostGlobalVariables.POST_SelectedPageInfo.map((page)=>{
        locallistOfPagesDynamicFieldsValues=[...locallistOfPagesDynamicFieldsValues,{pageID:page.id,dynamicFieldValue:page.Website}]
        })     
        LocalDynamicFieldList=[...LocalDynamicFieldList,{listOfPagesDynamicFieldValues:locallistOfPagesDynamicFieldsValues,patternID:e}]
    }
    //handling the location default dynamic field
    else if(e==3)
    {let locallistOfPagesDynamicFieldsValues=[]
      variables.PostGlobalVariables.POST_SelectedPageInfo.map((page)=>{
        locallistOfPagesDynamicFieldsValues=[...locallistOfPagesDynamicFieldsValues,{pageID:page.id,dynamicFieldValue:page.location}]
        })     
        LocalDynamicFieldList=[...LocalDynamicFieldList,{listOfPagesDynamicFieldValues:locallistOfPagesDynamicFieldsValues,patternID:e}]
    }
    //handling the Number default dynamic field
    else if (e==4)
    {let locallistOfPagesDynamicFieldsValues=[]
      variables.PostGlobalVariables.POST_SelectedPageInfo.map((page)=>{
        locallistOfPagesDynamicFieldsValues=[...locallistOfPagesDynamicFieldsValues,{pageID:page.id,dynamicFieldValue:page.Number}]
        })     
        LocalDynamicFieldList=[...LocalDynamicFieldList,{listOfPagesDynamicFieldValues:locallistOfPagesDynamicFieldsValues,patternID:e}]

    }

  })
 variables.PostGlobalVariables.POST_AddedDynamicFields=LocalDynamicFieldList
}

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
      result.result.map((page)=>{
        {PageListFormatedForMultiSelect=[...PageListFormatedForMultiSelect,{id:page.platformPageID,label:page.cachedData_PageName,PagePic:page.cachedData_PictureURL,PageType:page.platformID,location:page.cachedData_Location,Number:page.cachedData_PhoneNumber,Website:page.cachedData_WebsiteURL
        }] }     
      })
     setPagesList(PageListFormatedForMultiSelect);
     SetPagesLoaded(true)
    }
  });
 


},[])

//This is used to appened text to TinyMCEEditor
function appendText(Text) {
  editorRef.current.execCommand('mceInsertContent', false, Text+" ")
}

//Old Version of AppenedAssets, it ads them directly to the HTML
/*function AppenedAsset(Asset)
{
  editorRef.current.execCommand('mceInsertContent', false,Asset) 
}*/
function AppenedAsset(NewAssetsList)
{  
  let localNewAssetsList=[...Assets]
  NewAssetsList.map((Asset)=>{
    //We just adding unique randomlly generated ID for the picture since the Assets can use the same image multiple times
    let NewAsset={src:Asset.src,value:hashRandom(),AssetId:Asset.value}
    localNewAssetsList=[...localNewAssetsList,NewAsset]
  })
  SetAssets(localNewAssetsList)
}



//This is used to Remove the Dynamic Field  text from TinyMCEEditor in case the Dynamic FIeld is deleted
function RemoveDynamicFieldText(Text) {
  const editor = editorRef.current; // get a reference to the editor
  const content = editor.getContent(); // get the current content of the editor
  const regex = new RegExp(Text, 'g'); // create a regular expression with the global 'g' flag to replace all instances
  const newText = ""; // the text to insert
  const replacedContent = content.replace(regex, newText); // replace all instances of the 'Text' variable with 'newText'
  editor.setContent(replacedContent); // set the new content of the edito
  SetInfoTag(!InfoTag)
}

//This is used to Remove the mentionedUsers  text from TinyMCEEditor in case the mentionedUsers list is updated
function RemoveMentionedUserText(Text) {
  const editor = editorRef.current; // get a reference to the editor
  const content = editor.getContent(); // get the current content of the editor
  const regex = new RegExp(Text, 'g'); // create a regular expression with the global 'g' flag to replace all instances
  const newText = ""; // the text to insert
  const replacedContent = content.replace(regex, newText); // replace all instances of the 'Text' variable with 'newText'
  editor.setContent(replacedContent); // set the new content of the edito
  SetInfoTag(!InfoTag)
}

const HandleAssetUnAssign=(()=>{

  const filteredGallery = Assets.filter(AssetItem =>!SelectedAssets.some(SelectedAssetItem => SelectedAssetItem.value === AssetItem.value))
  //Updating the Tags 
  variables.PostGlobalVariables.POST_AssetsTags = variables.PostGlobalVariables.POST_AssetsTags.filter(AssetItem =>!SelectedAssets.some(SelectedAssetItem => SelectedAssetItem.value === AssetItem.Id))  
  SetAssets(filteredGallery) 
})

// This function count the default dynamic fields
const DefaultDynamicFieldCount=(()=>{
  let DefaultdfCount=0;
  variables.PostGlobalVariables.POST_AddedDynamicFields.map((dyf)=>{
    if(dyf.patternID==1 ||dyf.patternID==2 || dyf.patternID==3 || dyf.patternID==4)
    {
      DefaultdfCount++
    }
  })
  return DefaultdfCount;
})
// This function count the custom dynamic fields
const CustomDynamicFIeldCount=(()=>{
  let CustomdfCount=0;
  variables.PostGlobalVariables.POST_AddedDynamicFields.map((dyf)=>{
    if(dyf.patternID!=1 && dyf.patternID!=2 && dyf.patternID!=3 && dyf.patternID!=4)
    {
      CustomdfCount++
    }
  })
  return CustomdfCount;
})
//-------------This is used to update the Info Tag when assets change-----------//
React.useEffect(()=>{
  SetInfoTag(!InfoTag)
},[Assets])

const HandleImageTag=(()=>{

  if(SelectedAssets.length!=1)
  {
    toast.info("You need to select One Image to modify's tagging", {
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
  else
  {
    SetShowImageTagDialog(true)
  }

})
  return (
    <div className="pane-content">
            <Container>   
              <Row>
              <div className="card-header d-flex justify-content-center">
              Scheduled Post informations
                </div>
                <div className="card-body text-center">
                <Col>

                <Accordion className='m-2' defaultActiveKey="0" style={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Pages</Accordion.Header>
        <Accordion.Body>
        <div>

          {!PagesLoaded&&<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <CircularProgress />
    </Box>}
      {PagesLoaded&&
          <Autocomplete
          onChange={(event, newValue)=>{
            handlePageValueChange(newValue)
          }}
          key={"MultiPageSelect"}
          ref={FirstPaneRef}
          multiple
          id="checkboxes-tags-demo"
          options={PagesList}
          disableCloseOnSelect
          getOptionLabel={(option) => option.label}
          renderOption={(props, option, { selected }) => {
            return(
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />


          <img
            loading="lazy"
            width="20"
            src={option.PagePic}
            srcSet={option.PagePic}
            alt=""
          />
          {option.label}          
            </Box>
          )}}
          style={{ width: "auto" }}
          renderInput={(params) => (
            <TextField {...params} label="Selected Pages" placeholder="Select your Facebook & instagram Pages" />
          )}
          />
}
        
         
                  </div>
        </Accordion.Body>
      </Accordion.Item>

     
    </Accordion>           
       
           <div  style={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',margin:"0.5rem"}}>
           
           <Editor
          onInit={(evt, editor) => editorRef.current = editor}
           key={"Editor"}
           onEditorChange={handleEditorChange}
          apiKey={process.env.REACT_APP_TINYMCEJWTAPIKEY}
          init={init}
        />
           
            </div>

            {Assets.length!=0&&
                    <Accordion className='m-2' defaultActiveKey="0" style={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Selected Assets</Accordion.Header>
                      <Accordion.Body>
                        {SelectedAssets.length>0&& <div style={{  float: "right"}}>
                          {/*This Gonna tag ppl in the pictures */}
      <IconButton color="primary" aria-label="Tag" size="large" onClick={HandleImageTag} >
        <LocalOfferIcon fontSize="inherit" />
      </IconButton>
                          
                          <IconButton color="error" aria-label="delete" size="large" onClick={HandleAssetUnAssign}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      
      </div>
                        }
                       
                      <ImageDeleter Gallery={Assets} SetSelectedAssets={SetSelectedAssets} />
                      </Accordion.Body>
                    </Accordion.Item>
              
                   
                  </Accordion> 
            
            }
          
      <Accordion className='m-2' defaultActiveKey="0" style={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
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
          <MobileDateTimePicker label="Post Date" defaultValue={dayjs(variables.PostGlobalVariables.POST_Scheduler_Selected_DateTime).add(-1,"day")}  onChange={handlePostDateChange}  /> 
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
              name="radio-buttons-group"
              defaultValue={1}
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

 {/*-----------------------NOTE: Here we tell a user about the Used dynamic fields, tag, assets--------------------*/}

 <MuiAlert elevation={3}   severity="info" variant="outlined">
  Your post is currently using {DefaultDynamicFieldCount()}  Default Dynamic fields, {CustomDynamicFIeldCount()} Custom Dynamic fields, {variables.PostGlobalVariables.POST_SelectedAssetsInfo.length} Assets, {variables.PostGlobalVariables.POST_AssetsTags.length} tagged Assets,
  {variables.PostGlobalVariables.POST_TargetedAgeRange.FromAge!="" || variables.PostGlobalVariables.POST_TargetedAgeRange.ToAge!="" || variables.PostGlobalVariables.POST_TargetedCountries.length!=0 || variables.PostGlobalVariables.POST_TargetedInterests.length!=0  || variables.PostGlobalVariables.POST_TargetedLanguages.length!=0 || variables.PostGlobalVariables.POST_TargetedGenderId!=3?<> Audience Targetting Enabled</> : <> Audience Targetting Disabled</> }
 </MuiAlert>
            {/*-----------------------NOTE: NOTE END--------------------*/}
<Container>
  <Row>
  <Col><Button variant="outlined"color="primary" startIcon={<ScheduleSendIcon/>}  className='mx-2 m-3' onClick={HandlePostSchedule}>Schedule Post </Button></Col>
  <Col><Button variant="outlined"color="primary" startIcon={<SendIcon/>}  className='mx-2 m-3' onClick={HandlePostNow}>Post Now </Button></Col>
  </Row>
</Container>
      

                <div className="mb-3">
               
                  </div>
                  </div>
              </Row>
            </Container>
            {/*-----------------------------This Part here handles Dialog showing------------------------------------------*/}
          {ShowAddMentionDialog&&<AddMentionDialog SetShowAddMentionDialog={SetShowAddMentionDialog} appendText={appendText} RemoveMentionedUserText={RemoveMentionedUserText}/>}
          {ShowAssetsDialog&&<AddAssetsDialog AppenedAsset={AppenedAsset} SetShowAssetsDialog={SetShowAssetsDialog}/>}
          {ShowDynamicFieldDialog&&<AddDynamicFieldDialog appendText={appendText} RemoveDynamicFieldText={RemoveDynamicFieldText} SetShowDynamicFieldDialog={SetShowDynamicFieldDialog}/>} 
          {ShowAddLocationDialog&&<AddLocationDialog SetShowAddLocationDialog={SetShowAddLocationDialog}/>}
          {ShowAddTargetDialog&&<AddTargetDialog SetShowAddTargetDialog={SetShowAddTargetDialog}/>} 
          {ShowImageTagDialog&&<ImageTagDialog ShowImageTagDialog={ShowImageTagDialog} SetShowImageTagDialog={SetShowImageTagDialog} SelectedAssets={SelectedAssets}/>}
            {/*-----------------------------End Of the Part that handles Dialog showing------------------------------------------*/}
          </div>
  )
})


 export const SecondPane=React.forwardRef(({LivePreview,TextCode,SamplePreview},ref)=> {
  let [LivePreviewStatus,SetLivePreview]=React.useState(false)
  let [SamplePreviewStatus,SetSamplePreview]=React.useState(true)
  let [Text,SetText]=React.useState(TextCode)
  const [ReRender,setReRender]=React.useState(false)
  let ListOfPagePosts=React.useRef([])
  let List_Of_Samples=React.useRef([])
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
List_Of_Samples.current=[]
ListOfPagePosts.current=[]
//We first iteratte through our pages so we added the required modifications
  variables.PostGlobalVariables.POST_SelectedPageInfo.map((Page)=>{
    let LocalText=Text

    variables.PostGlobalVariables.POST_Mentions.map((mentionedUser)=>{
      LocalText=LocalText.replace(mentionedUser.MentionText,mentionedUser.Preview_Name)
    })

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

         //Checking if the Facebook sample is already added or not
    let Facebook_SampleFlag=false  
    let INSTA_SampleFlag=false  
    List_Of_Samples.current.forEach((element)=>{

      if(element.props.PageInfo.PageType=="1")
      {
        Facebook_SampleFlag=true
      }
    })

    List_Of_Samples.current.forEach((element)=>{

      if(element.props.PageInfo.PageType=="2")
      {
        INSTA_SampleFlag=true
      }
    })
    if(!Facebook_SampleFlag && Page.PageType=="1")
    {
     List_Of_Samples.current=[...List_Of_Samples.current,<FacebookPostClone  ref={SecondPane} Text={LocalText} PageInfo={Page}/>]
    }
    //Checking if the Instagram sample is already added or not
    if(!INSTA_SampleFlag && Page.PageType=="2" )
    {
     List_Of_Samples.current=[...List_Of_Samples.current,<FacebookPostClone  ref={SecondPane} Text={LocalText} PageInfo={Page}/>]
    }
      
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
          <Container>  {!SamplePreview.current&&<row><Button variant="outlined"color="primary" startIcon={<Filter1Icon/>}  className='mx-2 m-1' onClick={()=>{ SamplePreview.current=true; SetSamplePreview(!SamplePreviewStatus)}}> Disable Sample preview</Button></row>}
          {SamplePreview.current&&<row><Button variant="outlined"color="primary" startIcon={<Filter1Icon/>} className='mx-2 m-1'  onClick={()=>{ SamplePreview.current=false;SetSamplePreview(!SamplePreviewStatus)}}> Enable Sample preview</Button></row>}
          {!LivePreview.current&&<row><Button variant="outlined"color="primary" startIcon={<VisibilityOffIcon/>}  className='mx-2 m-1' onClick={()=>{LivePreview.current=true; SetLivePreview(!LivePreviewStatus)}}> Enable Live preview</Button></row>}
          {LivePreview.current&&<row><Button variant="outlined"color="primary" startIcon={<VisibilityIcon/>} className='mx-2 m-1'  onClick={()=>{LivePreview.current=false; SetLivePreview(!LivePreviewStatus)}}> Disable Live preview</Button></row>}
         </Container>
          </div>
          <div className="card-body text-center m-1" style={{ backgroundColor: "#f3f4f4",borderRadius:"3%"}}>
            {ListOfPagePosts.current.length==0&&<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><p>No Pages Selected to Preview</p></Box>}
               
               {SamplePreview.current?
                 ListOfPagePosts.current.slice(startIndex, endIndex).map((item,index) => (
                  <Row key={"R"+index}><Col md={12}>
                    {item}</Col></Row>
                ))
               :
                List_Of_Samples.current.slice(startIndex, endIndex).map((item,index) => 
                
                {
                  
                  return(
                  
                    <Row key={"S"+index}><Col md={12}>
                      {item}</Col></Row>  
                  )
                }
                )
               }
             
               
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
   let SamplePreview=React.useRef(false)
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

  function handleAssetSelectionChange() {
    if(LivePreview.current)
    {
      const SecondPaneReRenderer= SecondPaneRef.current.getSecondPaneReRenderer;
      SecondPaneReRenderer()
    }
    
  }
  function handlePageSelectionChange() {
    if(LivePreview.current)
    {
      const SecondPaneReRenderer= SecondPaneRef.current.getSecondPaneReRenderer;
      SecondPaneReRenderer()      
    }
    
  }
 
  React.useEffect(()=>{
    //initializing the variables, so that old data from previous posts are not saved
    variables.PostGlobalVariables.POST_AddedDynamicFields=[]
    variables.PostGlobalVariables.POST_PatternsInfo=[]
    variables.PostGlobalVariables.POST_SelectedPageIds=[]
    variables.PostGlobalVariables.POST_AssetsTags=[]
    variables.PostGlobalVariables.POST_Mentions=[]
    //initializing the POST variables in /variables.js
        //initializing Age
        variables.PostGlobalVariables.POST_TargetedAgeRange.FromAge=""
        variables.PostGlobalVariables.POST_TargetedAgeRange.ToAge=""
        //Updating Gender
        variables.PostGlobalVariables.POST_TargetedGenderId=3
        //initializing Language
        variables.PostGlobalVariables.POST_TargetedLanguages=[]
        //initializing Caching LanguageOptionList
        variables.PostGlobalVariables.POST_CachedLanguageOptions=[]
          //initializing Location
        variables.PostGlobalVariables.POST_TargetedLocations=[]
        // initializing Caching LocationOptionList
        variables.PostGlobalVariables.POST_CachedLocationOptions=[]
          //initializing Regions
        variables.PostGlobalVariables.POST_TargetedRegions=[]
        // initializing Caching RegionOptionList
        variables.PostGlobalVariables.POST_CachedRegionOptions=[]
          //initializing Countries
        variables.PostGlobalVariables.POST_TargetedCountries=[]
        // initializing Caching CountriesoptionList
        variables.PostGlobalVariables.POST_CachedCountryOptions=[]
         //initializing Interests
        variables.PostGlobalVariables.POST_TargetedInterests=[]
        // initializing Caching InterestsoptionList
        variables.PostGlobalVariables.POST_CachedInterestOptions=[]

  },[])
  


  return (
    <>  
       <Paper sx={{ width: "100%", height:"100%", m: 1, p: 2, textAlign: "center" }} style={{margin:"1rem",padding:"1rem",boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)'}}>

<SplitterComponent id="splitter" height="100%" width="100%" separatorSize={5} >
   <PanesDirective>
   <PaneDirective  min='20%' content={()=>{return(<FirstPane ref={FirstPaneRef} handleAssetSelectionChange={handleAssetSelectionChange}  handleEditorChange={handleEditorChange} handlePageSelectionChange={handlePageSelectionChange} />)}} />

   
     <PaneDirective min='20%' content={()=>{return(<SecondPane  ref={SecondPaneRef} SamplePreview={SamplePreview} LivePreview={LivePreview} TextCode={TextCode} />)}} />
     
   </PanesDirective>
</SplitterComponent> 


    </Paper>

      
        
        
        
      

       
        
     
      
      

 
     
      
      
      
      
      
      
      
      
 

  

</>
  );
}

