import * as React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './PostInsightsContent.css';
import {AppContext} from "../../context/Context"
// project import
import Post_Inseights_Chart from '../../components/UI/Charts/SinglePostInseightsChart';
import MainCard from '../../components/UI/cards/MainCard';
import AnalyticEcommerce from '../../components/UI/cards/statistics/AnalyticEcommerce';
import LinearProgress from '@mui/material/LinearProgress';
import * as variables from "../../variables/variables"
import * as APILib from "../../libs/APIAccessAndVerification"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import StatsCard from "../../components/UI/StatsCard"
// material-ui
import {
    Box,
    Grid,
    Typography
} from '@mui/material';

export default function Content() {

const {GlobalState,Dispatch}=React.useContext(AppContext)  
const [Data,setData]=React.useState([])
const [IsDataLoading,setIsDataLoading]=React.useState(true)
const [SelectedTab, setSelectedTab] = React.useState(0);
const [SelectedTimeTab, setSelectedTimeTab] = React.useState(0);
const [CommentProgress, Set_CommentProgress] = React.useState(0);
const [LikeProgress, Set_LikeProgress] = React.useState(0);
const [ShareProgress, Set_ShareProgress] = React.useState(0);

const HandlePageSelection=((e,v)=>{
  if(SelectedTimeTab==0)
  {
    Set_CommentProgress(Data.PagesInsights.filter((p)=>p.PageId==v)[0].PageDayProgress.CommentsProgress)
    Set_LikeProgress(Data.PagesInsights.filter((p)=>p.PageId==v)[0].PageDayProgress.LikesProgress)
    Set_ShareProgress(Data.PagesInsights.filter((p)=>p.PageId==v)[0].PageDayProgress.SharesProgress)
  }
  //week
  if(SelectedTimeTab==1)
  {
    Set_CommentProgress(Data.PagesInsights.filter((p)=>p.PageId==v)[0].PageWeekProgress.CommentsProgress)
    Set_LikeProgress(Data.PagesInsights.filter((p)=>p.PageId==v)[0].PageWeekProgress.LikesProgress)
    Set_ShareProgress(Data.PagesInsights.filter((p)=>p.PageId==v)[0].PageWeekProgress.SharesProgress)
  }
  //month
  if(SelectedTimeTab==2)
  {
    Set_CommentProgress(Data.PagesInsights.filter((p)=>p.PageId==v)[0].PageMonthProgress.CommentsProgress)
    Set_LikeProgress(Data.PagesInsights.filter((p)=>p.PageId==v)[0].PageMonthProgress.LikesProgress)
    Set_ShareProgress(Data.PagesInsights.filter((p)=>p.PageId==v)[0].PageMonthProgress.SharesProgress)
  }
  setSelectedTab(v)
})
const HandleTimeFilterChange=((e,v)=>{
  setSelectedTimeTab(v)
  //day
if(v==0)
{
  Set_CommentProgress(Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageDayProgress.CommentsProgress)
  Set_LikeProgress(Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageDayProgress.LikesProgress)
  Set_ShareProgress(Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageDayProgress.SharesProgress)
}
//week
if(v==1)
{
  Set_CommentProgress(Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageWeekProgress.CommentsProgress)
  Set_LikeProgress(Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageWeekProgress.LikesProgress)
  Set_ShareProgress(Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageWeekProgress.SharesProgress)
}
//month
if(v==2)
{
  Set_CommentProgress(Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageMonthProgress.CommentsProgress)
  Set_LikeProgress(Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageMonthProgress.LikesProgress)
  Set_ShareProgress(Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageMonthProgress.SharesProgress)
}

  
})

React.useLayoutEffect(()=>{
  async function Fetch()
  {
    var JsonObject = {  
      PostID: variables.PostGlobalVariables.EDITPOST_SelectedPostID
   };
  
  let JsonObjectToSend = JSON.stringify(JsonObject);
  let url2 =
    process.env.REACT_APP_BACKENDURL + 
    process.env.REACT_APP_GETSINGLEPOSTINSEIGHTS
  let UserToken = window.localStorage.getItem("AuthToken");
  
  let result = await APILib.CALL_API_With_JWTToken(url2, JsonObjectToSend, UserToken);
    
      if(result.successCode=="Post_Insights_Recieved")
      {
        setData(result.result)
        setSelectedTab(result.result.PagesInsights[0].PageId)
        Set_CommentProgress(result.result.PagesInsights[0].PageDayProgress.CommentsProgress)
        Set_LikeProgress(result.result.PagesInsights[0].PageDayProgress.LikesProgress)
        Set_ShareProgress(result.result.PagesInsights[0].PageDayProgress.SharesProgress)
        setIsDataLoading(false)
      } 
    
  
  }

  Fetch()
},[])



  return (
    <> 
     {
      IsDataLoading?<Box sx={{ backgroundColor:"white",width: '100%',padding:"0.5rem",boxShadow:"0 0 10px rgba(0, 0, 0, 0.3)",borderRadius:"15%" }}>
      <LinearProgress />
    </Box>:
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
    {/* row 1 */}
    <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Post {variables.PostGlobalVariables.EDITPOST_SelectedPostID} Insights</Typography>
    </Grid>
    <Container>

    </Container>
    <Grid item xs={12} sm={6} md={4} lg={4}>
    <StatsCard  label="Total Comments" Count={Data.TotalComments} type="Comment" color="Blue"/>

    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={4}>
    <StatsCard  label="Total Likes" Count={Data.TotalLikes} type="Like" color="Blue"/>
       
        
    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={4}>
    <StatsCard  label="Total Shares" Count={Data.TotalShares} type="Share" color="Blue"/>
    </Grid>
    

    {/* row 2 */}
    <Grid item xs={12} md={12} lg={12}>
    <MainCard content={false} sx={{ mt: 1.5 }}>
      <Tabs
        value={SelectedTab}
        onChange={HandlePageSelection}
        variant="scrollable"
        scrollButtons={true}
        aria-label="scrollable auto tabs example"
      >
        {Data.PagesInsights.map((page)=>{
          if(page.PagePlatform==1)
          {
            return(<Tab value={page.PageId} icon={<FacebookIcon />} label={page.Page_Name} />)
          }
          if(page.PagePlatform==2)
          {
            return(<Tab value={page.PageId} icon={<InstagramIcon />} label={page.Page_Name} />)
          }
          
        })}
      
 
      </Tabs>

      <Tabs
      
        value={SelectedTimeTab}
        onChange={HandleTimeFilterChange}
        centered={true}  
      >
        <Tab value={0}  label="Day" />
        <Tab value={1}  label="Week" />
        <Tab value={2}  label="Month" />
      </Tabs>
    </MainCard>
    </Grid>

    
  
    

    <Grid item xs={12} sm={6} md={4} lg={4}>
      
      <StatsCard  label="Comments Progress" Count={CommentProgress} type="Comment" color="Green"/>
        
        
    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={4}>
    <StatsCard  label="Likes   Progress" Count={LikeProgress} type="Like" color="Green"/>
        
    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={4}>
    <StatsCard  label="Shares Progress" Count={ShareProgress} type="Share" color="Green"/>
       
        
    </Grid>

    
    <Grid item xs={12} md={4} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
                <Typography variant="h5">Comments Life Time Graph</Typography>
            </Grid>
            
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box sx={{ pt: 1, pr: 2 }}>
                <Post_Inseights_Chart slot={[]}  PageName={Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].Page_Name} Data={Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageHistory} Type="Comments"/>
            </Box>
        </MainCard>
    </Grid>
    

    {/* row 3 */}
   
    <Grid item xs={12} md={4} lg={4}>
    <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
                <Typography variant="h5">Likes Life Time Graph</Typography>
            </Grid>
            
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box sx={{ pt: 1, pr: 2 }}>
                <Post_Inseights_Chart slot={[]} PageName={Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].Page_Name} Data={Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageHistory} Type="Likes" />
            </Box>
        </MainCard>
    </Grid>

    {/* row 4 */}
    <Grid item xs={12} md={4} lg={4}>
        
    <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
                <Typography variant="h5">Shares Life Time Graph</Typography>
            </Grid>
            
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>  
            <Box sx={{ pt: 1, pr: 2 }}>
                <Post_Inseights_Chart slot={[]} PageName={Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].Page_Name} Data={Data.PagesInsights.filter((p)=>p.PageId==SelectedTab)[0].PageHistory} Type="Shares" />
            </Box>
        </MainCard>
    </Grid>
    
</Grid>
     }
        
       
       
</>
  );
}