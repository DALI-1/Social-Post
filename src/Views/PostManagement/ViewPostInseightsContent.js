import * as React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './ViewPostInseightsContent.css';
import {AppContext} from "../../context/Context"
// project import
import Post_Inseights_Chart from '../../components/UI/Charts/PostInseightsChart';
import MainCard from '../../components/UI/cards/MainCard';
import AnalyticEcommerce from '../../components/UI/cards/statistics/AnalyticEcommerce';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';
import * as APILib from "../../libs/APIAccessAndVerification"
// material-ui
import {
    Box,
    Grid,
    Typography
} from '@mui/material';

export default function Content() {

const {GlobalState,Dispatch}=React.useContext(AppContext)  
const [Likes_slot, setLikes_slot] = useState('week');
const [Shares_slot, setShares_slot] = useState('week');
const [Comments_slot, setComments_slot] = useState('week');
const [Likes_diff, setLikes_diff] = useState(0);
const [Shares_diff, setShares_diff] = useState(0);
const [Comments_diff, setComments_diff] = useState(0);
const [Likes_Percentage, setLikes_Percentage] = useState(0);
const [Shares_Percentage, setShares_Percentage] = useState(0);
const [Comments_Percentage, setComments_Percentage] = useState(0);
const [Data,setData]=React.useState([])
const [IsDataLoading,setIsDataLoading]=React.useState(true)

React.useLayoutEffect(()=>{
  var JsonObject = {  
    group: GlobalState.SelectedGroup.id
 };

let JsonObjectToSend = JSON.stringify(JsonObject);
let url2 =
  process.env.REACT_APP_BACKENDURL + 
  process.env.REACT_APP_GETPOSTSINSEIGHTS
let UserToken = window.localStorage.getItem("AuthToken");
let APIResult = APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
APIResult.then((result) => {
  if (result.errorCode == undefined) {
    if(result.successCode=="Posts_Inseights_Retreieved")
    {
      setData(result.result)
      HandlePercentageDiffCalculation(result.result)
      setIsDataLoading(false)
    } 
  }
})
},[])

const HandlePercentageDiffCalculation=((Data)=>
{

var Total_RecentCommentValue=0
var Total_PreviousCommentValue=0
var Total_RecentSharesValue=0
var Total_PreviousSharesValue=0
var Total_RecentLikesValue=0
var Total_PreviousLikesValue=0

var RecentCommentValue=0
var PreviousCommentValue=0
var RecentSharesValue=0
var PreviousSharesValue=0
var RecentLikesValue=0
var PreviousLikesValue=0

var Temp_Likes_diff=0
var  Temp_Shares_diff=0
var Temp_Comments_diff=0
  //=======================Comments===================///
    Data.postsInseights.map((post)=>{
      
      //Case where we have mutliple readings from the post
      if(post.inseightsInfo[0].y_Values.length!=1 &&post.inseightsInfo[0].y_Values.length!=0)
      {
      
        post.inseightsInfo.map((Info)=>{
          //We search for the Y values of the Comments inseights for the post
         
           if(Info.type=='Comments')
           {
            RecentCommentValue= parseInt(Info.y_Values[(Info.y_Values.length)-1])
            PreviousCommentValue=parseInt(Info.y_Values[(Info.y_Values.length)-2])
           }
     //==============================Likes============================//
      
          
          //We search for the Y values of the Comments inseights for the post
         
           if(Info.type=='Likes')
           {
            RecentLikesValue= parseInt(Info.y_Values[(Info.y_Values.length)-1])
            PreviousLikesValue=parseInt(Info.y_Values[(Info.y_Values.length)-2])
           } 
      //===================Shares=================//
          //We search for the Y values of the Comments inseights for the post
         
           if(Info.type=='Shares')
           {
            RecentSharesValue= parseInt(Info.y_Values[(Info.y_Values.length)-1])
            PreviousSharesValue=parseInt(Info.y_Values[(Info.y_Values.length)-2])
           }
                     
           Temp_Likes_diff+=Temp_Likes_diff+RecentLikesValue-PreviousLikesValue
           Temp_Shares_diff+=Temp_Shares_diff+RecentSharesValue-PreviousSharesValue
           Temp_Comments_diff+=Temp_Comments_diff+RecentCommentValue-PreviousCommentValue
    
           Total_RecentCommentValue+=RecentCommentValue
           Total_PreviousCommentValue+=PreviousCommentValue
           Total_RecentSharesValue+=RecentSharesValue
           Total_PreviousSharesValue+=PreviousSharesValue
           Total_RecentLikesValue+=RecentLikesValue
           Total_PreviousLikesValue+=PreviousLikesValue
        
         
        })   
      }
      //The case where we have only one reading about the post
      else
      {
        if(post.inseightsInfo[0].y_Values.length==1)
        {
          console.log("Single 1")
          post.inseightsInfo.map((Info)=>{
            //We search for the Y values of the Comments inseights for the post
           
             if(Info.type=='Comments')
             {
              RecentCommentValue= parseInt(Info.y_Values[(Info.y_Values.length)-1])
             
             }
       //==============================Likes============================//
        
            
            //We search for the Y values of the Comments inseights for the post
           
             if(Info.type=='Likes')
             {
              RecentLikesValue= parseInt(Info.y_Values[(Info.y_Values.length)-1])
              
             } 
        //===================Shares=================//
            //We search for the Y values of the Comments inseights for the post
           
             if(Info.type=='Shares')
             {
              RecentSharesValue= parseInt(Info.y_Values[(Info.y_Values.length)-1])
              
             }
                       
             Temp_Likes_diff+=Temp_Likes_diff+RecentLikesValue
             Temp_Shares_diff+=Temp_Shares_diff+RecentSharesValue
             Temp_Comments_diff+=Temp_Comments_diff+RecentCommentValue
      
             Total_RecentCommentValue+=RecentCommentValue
            
             Total_RecentSharesValue+=RecentSharesValue
             
             Total_RecentLikesValue+=RecentLikesValue
             
          
           
          })  
        }

        if(post.inseightsInfo[0].y_Values.length==0)
        {
          console.log("Single 0")
          Temp_Likes_diff+=0
             Temp_Shares_diff+=0
             Temp_Comments_diff+=0
      
             Total_RecentCommentValue+=0
            
             Total_RecentSharesValue+=0
             
             Total_RecentLikesValue+=0
        }
        
      }
      
})

    //Updating the state with the calculated Diffs
    setLikes_diff(Temp_Likes_diff)
    setShares_diff(Temp_Shares_diff)
    setComments_diff(Temp_Comments_diff)
    //Updating percentage
    if(Total_PreviousLikesValue!=0)
{
setLikes_Percentage(((Total_RecentLikesValue-Total_PreviousLikesValue)*100/Total_PreviousLikesValue).toFixed(2))
}else
{
setLikes_Percentage((Total_RecentLikesValue)*100)
}

if(Total_PreviousSharesValue!=0)
{
setShares_Percentage(((Total_RecentSharesValue-Total_PreviousSharesValue)*100/Total_PreviousSharesValue).toFixed(2))
}else
{
setShares_Percentage(Total_RecentSharesValue*100)
}

if(Total_PreviousCommentValue!=0)
{
setComments_Percentage(((Total_RecentCommentValue-Total_PreviousCommentValue)*100/Total_PreviousCommentValue).toFixed(2))
}else
{
setComments_Percentage(Total_RecentCommentValue*100)
}


      
})
  return (
    <> 
     {
      IsDataLoading?<Box sx={{ backgroundColor:"white",width: '100%',padding:"0.5rem",boxShadow:"0 0 10px rgba(0, 0, 0, 0.3)",borderRadius:"15%" }}>
      <LinearProgress />
    </Box>:
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
    {/* row 1 */}
    <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Social Post Dashboard</Typography>
    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Posts" count={Data.total_Posts_Count.toString()} />
    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={3}>
      {Comments_diff>0?
      <AnalyticEcommerce title="Total Comments" count={Data.total_Comment_Count.toString()}  percentage={Comments_Percentage} isLoss={false} color="success" extra={Comments_diff} />
    :<AnalyticEcommerce title="Total Comments" count={Data.total_Comment_Count.toString()}  percentage={Comments_Percentage} isLoss color="success" extra={Comments_diff} />
    }
        
    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={3}>
        {Likes_diff>0?<AnalyticEcommerce title="Total likes" count={Data.total_Likes_Count.toString()}  percentage={Likes_Percentage} isLoss={false} color="success" extra={Likes_diff} />
        :<AnalyticEcommerce title="Total likes" count={Data.total_Likes_Count.toString()}  percentage={Likes_Percentage} isLoss color="success" extra={Likes_diff} />}
    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={3}>
        {Shares_diff>0?<AnalyticEcommerce title="Total Shares" count={Data.total_Shares_Count.toString()} percentage={Shares_Percentage} isLoss={false} color="success" extra={Shares_diff} />
        :<AnalyticEcommerce title="Total Shares" count={Data.total_Shares_Count.toString()} percentage={Shares_Percentage} isLoss color="success" extra={Shares_diff} />}
    </Grid>
    <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

    {/* row 2 */}
    <Grid item xs={12} md={7} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
                <Typography variant="h5">Recent 5 Posts Comments Performance </Typography>
            </Grid>
            
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box sx={{ pt: 1, pr: 2 }}>
                <Post_Inseights_Chart slot={Comments_slot} Data={Data} Type="Comments"/>
            </Box>
        </MainCard>
    </Grid>
    

    {/* row 3 */}
   
    <Grid item xs={12} md={5} lg={6}>
    <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
                <Typography variant="h5">Recent 5 Posts Likes Performance</Typography>
            </Grid>
            
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box sx={{ pt: 1, pr: 2 }}>
                <Post_Inseights_Chart slot={Likes_slot} Data={Data} Type="Likes" />
            </Box>
        </MainCard>
    </Grid>

    {/* row 4 */}
    <Grid item xs={12} md={7} lg={6}>
        
    <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
                <Typography variant="h5"> Recent 5 Posts Shares Performance</Typography>
            </Grid>
            
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box sx={{ pt: 1, pr: 2 }}>
                <Post_Inseights_Chart slot={Shares_slot} Data={Data} Type="Shares" />
            </Box>
        </MainCard>
    </Grid>
    
</Grid>
     }
        
       
       
</>
  );
}