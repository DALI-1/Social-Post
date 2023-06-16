import * as React from 'react';
import './ManagePostContent.css';
import {AppContext} from "../../context/Context"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Paper from '@mui/material/Paper';
import "./AddPostContent.css";
import * as variables from "../../variables/variables"
import * as APILib from "../../libs/APIAccessAndVerification"
import dayjs from 'dayjs';
import { Box, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import FacebookPostClone from "../../components/PostManagementComps/PostCloneComps/Clone_Generator"
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import * as SearchLib from "../../libs/Facebook_Search"
import MainCard from "../../components/UI/cards/MainCard"
import LinearUncertainSpinner from "../../components/UI/SpinnerComps/LinearLoadingSpinner"
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const Preview=({TextCode})=> {
 
console.log(TextCode)
  let ListOfPagePosts=React.useRef([])
ListOfPagePosts.current=[]
console.log(variables.PostGlobalVariables.POST_SelectedPageInfo)
//We first iteratte through our pages so we added the required modifications
  variables.PostGlobalVariables.POST_SelectedPageInfo.map((Page)=>{
    let LocalText=TextCode
    variables.PostGlobalVariables.POST_Mentions.map((mentionedUser)=>{
      LocalText=LocalText.replaceAll(mentionedUser.MentionText,mentionedUser.Preview_Name)
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
               LocalText = LocalText.replaceAll(PatternTextValue, DFPage.dynamicFieldValue);
             }
         })
         
         
       })    
       ListOfPagePosts.current=[...ListOfPagePosts.current,<FacebookPostClone Text={LocalText} PageInfo={Page}/>]   
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
          <div className="card-body text-center m-1" style={{ backgroundColor: "#f3f4f4",borderRadius:"3%"}}>
            {ListOfPagePosts.current.length==0&&<Box><p>No Pages Selected to Preview</p></Box>}               
            <Container >
            <Row className="d-flex">
                 {ListOfPagePosts.current.slice(startIndex, endIndex).map((item,index) => {
                  return(<Col className="d-flex">
                      {item}</Col>)
                })} 
             </Row>
            </Container>           
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <Pagination count={Math.ceil(ListOfPagePosts.current.length / itemsPerPage)} page={page} color="primary" onChange={handleChangePage} />       
      </Box>
    </div>
    </div>
  )
}
export default function Content() {
  const { GlobalState, Dispatch } = React.useContext(AppContext);
  const [ReadyToDisplay, SetReadyToDisplay] = React.useState(false);
  var DefaultPostText=React.useRef("Empty")

  async function InitializeData(){
 
    //initializing the variables, so that old data from previous posts are not saved
    variables.PostGlobalVariables.POST_AddedDynamicFields=[]
    variables.PostGlobalVariables.POST_PatternsInfo=[]
    variables.PostGlobalVariables.POST_SelectedPageIds=[]
    variables.PostGlobalVariables.POST_AssetsTags=[]
    variables.PostGlobalVariables.POST_Mentions=[]
     variables.PostGlobalVariables.POST_SelectedPageInfo=[]
     variables.PostGlobalVariables.POST_SelectedVideoThumbnail=""
     variables.PostGlobalVariables.POST_SelectedVideoAssetsInfo=null
     variables.PostGlobalVariables.POST_SelectedAssetsInfo=[]
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

    //--------NOTE: THE intialiazing should be done after the pages are loaded and configured properly to avoid early buggy clicks--------
    var JsonObject = {  
      postID:variables.PostGlobalVariables.EDITPOST_SelectedPostID
    }
  let JsonObjectToSend = JSON.stringify(JsonObject);
  let url2 =
    process.env.REACT_APP_BACKENDURL + 
    process.env.REACT_APP_GETPOSTINFO;
  let UserToken = window.localStorage.getItem("AuthToken");
  var response = await APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);

    if (response.errorCode == undefined) {
      if(response.successCode=="PostInfo_Reterived")
      {

        //-------------------------------NOTE: TEMP VARIABLES that will be used to initialize the POST INFO--------------------//
       
      let Temp_Formated_SelectedPagesList=[]
      let Temp_Formated_DynamicFieldList=[]
      let ListOfPlatformPageID_ID=[]
                 //-------------------------------END NOTE--------------------//
               
    
      //------TASK:preparing selected pages,Temp_Formated_SelectedPagesList-----//
      response.result.pages.map((page)=>{
        Temp_Formated_SelectedPagesList=[...Temp_Formated_SelectedPagesList,{
          "id": page.platformPageID,
        "label": page.cachedData_PageName,
        "PagePic": page.cachedData_PictureURL,
        "PageType": page.platformID,
        "location": page.cachedData_Location,
        "Number": page.cachedData_PhoneNumber,
        "Website": page.cachedData_WebsiteURL
        }]
        ListOfPlatformPageID_ID=[...ListOfPlatformPageID_ID,{"platformPageID":page.platformPageID,"PageID":page.id}]
      })
      variables.PostGlobalVariables.POST_SelectedPageIds=Temp_Formated_SelectedPagesList
      variables.PostGlobalVariables.POST_SelectedPageInfo=Temp_Formated_SelectedPagesList
    
      //------END TASK-----//

      //------TASK:preparing  the dynamicfields & Patterns-----//

      let Passed_DyfPatterns=[]
      Temp_Formated_DynamicFieldList=[]
      response.result.postDynamicFields.map((dyf)=>{
        if(!Passed_DyfPatterns.includes(dyf.patternId))
        {
          let temp_dyf={"listOfPagesDynamicFieldValues":[],"patternID":dyf.patternId}
          //We filter  the dynamicfields by Patterns
          let Temp_listOfPagesDynamicFieldValues=[]
          //itterating through every dynamic field within a specific pattern
          response.result.postDynamicFields.filter((p)=>p.patternId==temp_dyf.patternID).map((Filtered_dyf)=>{ 
            //Getting the correct PagePlatformID for the PageID
            ListOfPlatformPageID_ID.map((page)=>{
              if(page.PageID==Filtered_dyf.pageID)
              {
                //Updating the Page value
                Temp_listOfPagesDynamicFieldValues=[...Temp_listOfPagesDynamicFieldValues,
                  {
                      "pageID": page.platformPageID,
                      "dynamicFieldValue": Filtered_dyf.value  
                  }]
              }
            })
            })
            //Updating the Dynamic values list with the pages
          temp_dyf.listOfPagesDynamicFieldValues=Temp_listOfPagesDynamicFieldValues
          //Setting the dynamicfield as passed to avoid going through it in next itterations
          Passed_DyfPatterns=[...Passed_DyfPatterns,dyf.patternId]
          //Adding the Dynamicfield to the temporary dynamicfield list
          Temp_Formated_DynamicFieldList=[...Temp_Formated_DynamicFieldList,temp_dyf]
        }
       
      })
      //Updating the Dynamicfield List with the formated one
       variables.PostGlobalVariables.POST_AddedDynamicFields=Temp_Formated_DynamicFieldList
      
      //Calling the API to fetch the group patterns so we load the patterns by default and have our dynamic fields shown properly
      var JsonObject = {
        groupID: GlobalState.SelectedGroup.id,
        };
        let JsonObjectToSend = JSON.stringify(JsonObject);
        let url2 =process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_GETGROUPATTERNS;
        let UserToken = window.localStorage.getItem("AuthToken");
        let result = await APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
        if (result.ErrorCode == undefined) {
         //updating Patterns info, this will be used in the preview to replace the pattern values with their specific values
        variables.PostGlobalVariables.POST_PatternsInfo=result.result
        }
       

      //------END TASK-----//

      //------TASK:preparing  the Assets & tags -----//
      
      let Temp_Formated_AssetsList=[]
      let Temp_Formated_TagsList=[]
      let Temp_Formated_Video=null
      let Temp_ThumbnailURL=""
      response.result.usedAssets.filter((Asset)=>Asset.asset.assetType=="image/jpeg").map((Asset)=>{
        Temp_Formated_AssetsList=[...Temp_Formated_AssetsList,{
          "src":Asset.asset.resourceURL,
        "value":Asset.id,
        "AssetId":Asset.asset.id
        }]
        //Preparing tags list 
        let Temp_CurrentAsset_Formated_TagsList=[]
        Asset.asset_Tags.map((tag)=>{
        Temp_CurrentAsset_Formated_TagsList=[...Temp_CurrentAsset_Formated_TagsList,{
          "TaggedUserID": tag.taggedPlatformAccount.platformAccountID,
            "Tag_X": parseInt(tag.taggedImage_X),
            "Tag_Y": parseInt(tag.taggedImage_Y),
            "Screen_x":  parseInt(tag.app_Screen_x),
            "Screen_y":  parseInt(tag.app_Screen_y),
            "ScrollTopValue": parseInt(tag.app_ScrollTopValue),
            "ScrollLeftValue": parseInt(tag.app_ScrollLeftValue),
            "TaggedPersonPic": tag.taggedPlatformAccount.cachedData_PictureURL,
            "TaggedPersonName": tag.taggedPlatformAccount.cachedData_Name
        }]
        })
        //Adding the tags to the temp list
        if(Temp_CurrentAsset_Formated_TagsList.length>0)
         {
          Temp_Formated_TagsList=[...Temp_Formated_TagsList,{
            "Id":Asset.id,
            "Asset_ID":Asset.asset.id,
            "Assetags":Temp_CurrentAsset_Formated_TagsList
          }]
         }
      })
      

      //=============Handling the video=============//
      
      response.result.usedAssets.filter((Asset)=>Asset.asset.assetType=="video/mp4").map((Asset)=>{
        Temp_Formated_Video=Asset.asset
        if(Asset.thumbnail!=null)
        {
          Temp_ThumbnailURL=Asset.thumbnail.resourceURL
        }
      });
      
      variables.PostGlobalVariables.POST_SelectedVideoThumbnail=Temp_ThumbnailURL;
      variables.PostGlobalVariables.POST_SelectedVideoAssetsInfo=Temp_Formated_Video;
      variables.PostGlobalVariables.POST_SelectedAssetsInfo=Temp_Formated_AssetsList
      variables.PostGlobalVariables.POST_AssetsTags=Temp_Formated_TagsList
   
      
      //------END TASK-----//

        //------TASK:preparing  the  Text and Mentions -----//

        if(response.result.postMentions.length>0)
        {
            //Case where there is mentions in the text
            let Temp_PostText=response.result.postText
            const regex = /\@\[(\d+)\]/g;
            const matches = Temp_PostText.match(regex);
            const userIds = matches.map(match => match.match(/\d+/)[0]);
            //Creating an empty mapping variable between the pattern and how the text should be shown to the user
            let MentionCode_Text=[]
            let Temp_FormatedMentions=[]
            
            response.result.postMentions.map((mention)=>{
              //Filling the mapping variable here
              userIds.map((userid,index)=>{
                if(mention.mentioned_PlatformAccount.platformAccountID==userid)
                {
                MentionCode_Text=[...MentionCode_Text,{"MentionCode":matches[index],"MentionText":"@"+mention.mentioned_PlatformAccount.cachedData_Name.replaceAll(" ","")}]
                Temp_FormatedMentions=[...Temp_FormatedMentions,{
                  "MentionedUserID":mention.mentioned_PlatformAccount.platformAccountID ,
                  "MentionText": "@"+mention.mentioned_PlatformAccount.cachedData_Name.replaceAll(" ",""),
                  "Preview_Name": mention.mentioned_PlatformAccount.cachedData_Name
                }]
                }
              })
                
            })
            // Using the mapping values to replace the string shown to the user
            MentionCode_Text.map((Mapping)=>{
              Temp_PostText=Temp_PostText.replaceAll(Mapping.MentionCode, Mapping.MentionText);
            })
            variables.PostGlobalVariables.POST_Mentions=Temp_FormatedMentions


            DefaultPostText.current=Temp_PostText
        }
        //Case there is no mentions, just plain text
        else
        {

          DefaultPostText.current=response.result.postText
        }
       

      //------END TASK-----//



      //------TASK:preparing  the  Targetting Options -----//
      //handling age
      //Case where the age is targetted
      if(response.result.posT_Targeted_AgeRange!=null)
      {
        variables.PostGlobalVariables.POST_TargetedAgeRange.FromAge=response.result.posT_Targeted_AgeRange.min_age   
        variables.PostGlobalVariables.POST_TargetedAgeRange.ToAge=response.result.posT_Targeted_AgeRange.max_age 
      }
      //Handling Gender
      //case there is targetted gende"rs
      if(response.result.posT_Targeted_Gender!=null)
      {
        variables.PostGlobalVariables.POST_TargetedGenderId=response.result.posT_Targeted_Gender.id
      }
      
      //Handling LANGUAGES
      //Case there is targetted languages
      if(response.result.posT_Targeted_Languages.length>0)
      {
        let Temp_FormatedLanguages=[]
        response.result.posT_Targeted_Languages.map((lang)=>{
          Temp_FormatedLanguages=[...Temp_FormatedLanguages,{
              "name": lang.language_Name,
              "key": lang.language_PlatformKey       
          }]
        })
        variables.PostGlobalVariables.POST_TargetedLanguages=Temp_FormatedLanguages
      }
      //Handling Interests
      //Case there is targetted Interests
      if(response.result.posT_Targeted_Interests.length>0)
      {
        let Temp_FormatedInterests=[]
        let Temp_CachedInterests=[]

        var InterestPromises=response.result.posT_Targeted_Interests.map( async (interest)=>{
          
          Temp_FormatedInterests=[...Temp_FormatedInterests,
          {
            "id": interest.id,
          "interest_Name": interest.interest_Name,
          "interest_PlatformCode": interest.interest_PlatformCode,
          "interest_Description": interest.interest_Description,
          "interest_Topic": interest.interest_Topic,
          "interest_Targeted_Posts": interest.interest_Targeted_Posts,
          "interest_PlatformId": interest.interest_PlatformId,
          "interest_Platform": interest.interest_Platform
          }]
          
          //Getting the List of interests with the same name
          let List_Of_Audience_Interests= await SearchLib.Facebook_Get_Audience_Interests(interest.interest_Name)
          //Filling the options list with the data, so that later it finds it and shows  it checked by default
               
            if(List_Of_Audience_Interests.length!==0)
            {
               Temp_CachedInterests= [...Temp_CachedInterests, ...List_Of_Audience_Interests].reduce((acc, curr) => {
                const found = acc.find(item => item.id === curr.id);
                if (!found) {
                  acc.push(curr);
                }
                return acc;
              }, [])     
            }
          
  
         })
         //Waiting for all the promises
         await Promise.all(InterestPromises)

         variables.PostGlobalVariables.POST_CachedInterestOptions=Temp_CachedInterests
         variables.PostGlobalVariables.POST_TargetedInterests=Temp_FormatedInterests
      }
    
       //Handling countries
       //Case there is countries in the list
       if(response.result.posT_Targeted_Countries.length>0)
       {
        
        let Temp_FormatedCountries=[]
        let Temp_CachedCountries=[]
       var CountryPromises=response.result.posT_Targeted_Countries.map( async (country)=>{
          Temp_FormatedCountries=[...Temp_FormatedCountries,
          {
            "id": country.id,
            "country_Name": country.country_Name,
            "country_Key": country.country_Key,
            "country_PlatformCode": country.country_PlatformCode,
          }]
          //Getting the List of interests with the same name
          let List_Of_Countries= await SearchLib.Facebook_Get_Audience_Countries(country.country_Name)
          //Filling the options list with the data, so that later it finds it and shows  it checked by default
            if(List_Of_Countries.length!==0)
            {
             Temp_CachedCountries= [...Temp_CachedCountries, ...List_Of_Countries].reduce((acc, curr) => {
                const found = acc.find(item => item.id === curr.id);
                if (!found) {
                  acc.push(curr);
                }
                return acc;
              }, [])     
            }
          
  
         })
        
         //Waiting for all the countries to Finish
         await Promise.all(CountryPromises)
         variables.PostGlobalVariables.POST_CachedCountryOptions=Temp_CachedCountries
         variables.PostGlobalVariables.POST_TargetedCountries=Temp_FormatedCountries
       }
       
       //Handling Regions
       //Case there is Regions in the list
       if(response.result.posT_Targeted_Regions.length>0)
       {
        
        let Temp_FormatedRegions=[]
        let Temp_CachedRegions=[]
        var RegionPromises=response.result.posT_Targeted_Regions.map( async (region)=>{
         Temp_FormatedRegions=[...Temp_FormatedRegions,
          {
           "id": region.id,
           "region_Name": region.region_Name,
           "region_PlatformCode": region.region_PlatformCode,
           "region_CountryId": region.region_CountryId,
           "region_PlatformId": region.region_PlatformId,
          }]
          //Getting the List of Regions with the same name
          let List_Of_Regions=await SearchLib.Facebook_Get_Audience_Regions([region.region_Country],region.region_Name)        
          //Filling the options list with the data, so that later it finds it and shows  it checked by default

          
            if(List_Of_Regions.length!==0)
            {
              Temp_CachedRegions= [...Temp_CachedRegions, ...List_Of_Regions].reduce((acc, curr) => {
                const found = acc.find(item => item.id === curr.id);
                if (!found) {
                  acc.push(curr);
                }
                return acc;
              }, []) 
              
            }
          
  
         })
         //Waiting for REgion promises
         await Promise.all(RegionPromises)
         
         variables.PostGlobalVariables.POST_CachedRegionOptions=Temp_CachedRegions
         variables.PostGlobalVariables.POST_TargetedRegions=Temp_FormatedRegions
       }
        //Handling Locations
        //case there is targetted locations
        
        
        if(response.result.posT_Targeted_Locations.length>0)
        {
          let Temp_FormatedLocations=[]
          let Temp_CachedLocations=[]
         var LocationPromises=response.result.posT_Targeted_Locations.map(async(Location)=>{
           Temp_FormatedLocations=[...Temp_FormatedLocations,
            {
             "id": Location.id,
             "location_Name": Location.location_Name,
             "location_Type": Location.location_Type,
             "location_PlatformCode": Location.location_PlatformCode,
            }]
            //Getting the List of Regions with the same name
   
            let List_Of_Locations=await SearchLib.Facebook_Get_Audience_Locations([Location.location_Region],Location.location_Name)  
             
            //Filling the options list with the data, so that later it finds it and shows  it checked by default

              if(List_Of_Locations.length!==0)
              {
               Temp_CachedLocations= [...Temp_CachedLocations, ...List_Of_Locations].reduce((acc, curr) => {
                  const found = acc.find(item => item.id === curr.id);
                  if (!found) {
                    acc.push(curr);
                  }
                  return acc;
                }, []) 
                
              }
           
    
           })
           await Promise.all(LocationPromises)
           variables.PostGlobalVariables.POST_CachedLocationOptions=Temp_CachedLocations
           variables.PostGlobalVariables.POST_TargetedLocations=Temp_FormatedLocations
        }
      
      //------END TASK-----//
      //-----------preparing the repeat options------------//
      //updating  post date
  
      variables.PostGlobalVariables.EDITPOST_Default_PostDate=dayjs(response.result.postDate)
      //updating repeat option
      variables.PostGlobalVariables.EDITPOST_Default_RepeatPost=response.result.repeatPost
      //If the post has repeat option on, we update the repeat options
      if(variables.PostGlobalVariables.EDITPOST_Default_RepeatPost)
      { 
        //We updating the repeat option, hourly, monthly
        switch (response.result.repeatOption) {
         case "Hourly":
           variables.PostGlobalVariables.EDITPOST_Default_RepeatingOption=1
           break;
         case "Daily":
           variables.PostGlobalVariables.EDITPOST_Default_RepeatingOption=2
           break;
         case "Weekly":
           variables.PostGlobalVariables.EDITPOST_Default_RepeatingOption=3
           break;
         case "Monthly":
           variables.PostGlobalVariables.EDITPOST_Default_RepeatingOption=4
           break;  
         case "Yearly":
           variables.PostGlobalVariables.EDITPOST_Default_RepeatingOption=5
           break;
         default:
           variables.PostGlobalVariables.EDITPOST_Default_RepeatingOption=1
       }
        //We update the Endrepeat option
       switch (response.result.endRepeatOption) {
         case "NoEnd":
           variables.PostGlobalVariables.EDITPOST_Default_EndRepeatOption=1
           break;
         case "EndOccOption":
           variables.PostGlobalVariables.EDITPOST_Default_EndRepeatOption=2
           variables.PostGlobalVariables.EDITPOST_Default_EndRepeatOnNbOfOccurences=response.result.endRepeatOnOccurence
           break;
         case "EndDateOption":
           variables.PostGlobalVariables.EDITPOST_Default_EndRepeatOption=3
           variables.PostGlobalVariables.EDITPOST_Default_EndRepeatAfterDate=dayjs(response.result.endRepeatAfterDate)
           break;
         default:
           variables.PostGlobalVariables.EDITPOST_Default_EndRepeatOption=2
           variables.PostGlobalVariables.EDITPOST_Default_EndRepeatOnNbOfOccurences=response.result.endRepeatOnOccurence   
       }
      }
      //------END TASK-----//

      }
    }
 
  }

 //This function is executed only once and before the component renders
  React.useLayoutEffect(()=>{
    new Promise(async (resolve,reject)=>{
      await InitializeData()
        resolve()
    }).then(()=>{
      
      SetReadyToDisplay(true)
    })
   },[])
  if(ReadyToDisplay)
  {

  
  return (
    <>  
      
       <MainCard sx={{ width: "100%", height:"100%", m: 1, p: 2, textAlign: "center" }} style={{margin:"1rem",padding:"1rem",boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)'}}> 
    
      {<Preview  TextCode={DefaultPostText.current} /> }   
    </MainCard>
</>
  );
  }
  else
{
  return(<MainCard sx={{ width: "100%", height:"100%", m: 1, p: 2, textAlign: "center" }} style={{margin:"1rem",padding:"1rem",boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)'}}>

  <strong>Loading the post preview, please wait.....</strong>
  <LinearUncertainSpinner/>
  
      </MainCard>)
}
}

