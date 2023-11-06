using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using SocialPostBackEnd.Data;
using SocialPostBackEnd.DTO;
using SocialPostBackEnd.Exceptions;
using SocialPostBackEnd.Models;
using SocialPostBackEnd.Responses;
using System;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Runtime.Intrinsics.Arm;
using System.Security.Claims;

namespace SocialPostBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InseightsController : Controller
    {
        private readonly ApplicationDbContext _db;
        public IConfiguration Configuration { get; }
        public InseightsController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }




        [HttpPost("GetPostsInseights"), Authorize]
        public async Task<ActionResult<string>> GetPostsInseights(GetPostsInseights request)
        {

            try
            {
                var Posts = await _db.Posts.Where(p => p.PostGroupID == (Int64)Convert.ToInt64(request.Group)&&p.IsPosted==true &&p.IsDeleted==false)
                    .Include(p=>p.Pages)
                    .Include(p=>p.PostInseightsHistory)
                    .Include(p=>p.Posted_PlatformPosts).ThenInclude(p=>p.PostLikes)
                     .Include(p => p.Posted_PlatformPosts).ThenInclude(p => p.PostComments)
                     .OrderByDescending(p=>p.CreateDate)
                   .ToListAsync();

                var PlatformPages = await _db.PlatformPages.Where(p => p.GroupId == (Int64)Convert.ToInt64(request.Group) && p.IsDeleted == false)
                   .ToListAsync();
                List<PostInseights> PostsInseightsGraph = new List<PostInseights>();
                List<string> X_Axis_Values = new List<string>();               
                Int64 Heighest_X_Axis_count = 0;


                Int64 Total_Pages_Count = 0;
                Int64 Total_Posts_Count = 0;
                Int64 Total_Likes_Count = 0;
                Int64 Total_Comments_Count = 0;
                Int64 Total_Shares_Count = 0;
                foreach (var post in Posts)
                    {
                         //Finding the highest X count, so we be able to set the values to 0 for those, for the new posts that have no inseights info before that
                            if(post.PostInseightsHistory.Count> Heighest_X_Axis_count)
                            {
                                Heighest_X_Axis_count = post.PostInseightsHistory.Count;
                            }
                    
                    }
                //Here we save the X values of the oldest post
                foreach (var post in Posts)
                {
                    //Finding the highest X count, so we be able to set the values to 0 for those, for the new posts that have no inseights info before that
                    if (post.PostInseightsHistory.Count ==Heighest_X_Axis_count)
                    {                     
                        foreach(var Inseight in post.PostInseightsHistory)
                        {
                            
                            if(!X_Axis_Values.Contains(new DateTime(Inseight.InseightsTime.Value.Year, Inseight.InseightsTime.Value.Month, Inseight.InseightsTime.Value.Day, Inseight.InseightsTime.Value.Hour, Inseight.InseightsTime.Value.Minute, 0).ToString()))
                            {
                                X_Axis_Values.Add(new DateTime(Inseight.InseightsTime.Value.Year, Inseight.InseightsTime.Value.Month, Inseight.InseightsTime.Value.Day, Inseight.InseightsTime.Value.Hour, Inseight.InseightsTime.Value.Minute, 0).ToString());
                            }
                            
                        }                      
                    }

                }

                //Here we prepare the Y values for every post
                foreach (var post in Posts)
                {
                    PostInseights Inseights = new PostInseights
                    {
                        PostID = post.Id.ToString(),
                        InseightsInfo=new List<Inseight> ()
                        
                    };

                    
                    Inseight LikesY = new Inseight();
                    LikesY.X_Values = X_Axis_Values;
                    LikesY.Y_Values = new List<string>();
                    LikesY.Type = "Likes";

                    Inseight CommentsY = new Inseight();
                    CommentsY.X_Values = X_Axis_Values;
                    CommentsY.Y_Values = new List<string>();
                    CommentsY.Type = "Comments";

                    Inseight SharesY = new Inseight();
                    SharesY.X_Values = X_Axis_Values;
                    SharesY.Y_Values = new List<string>();
                    SharesY.Type = "Shares";

                    //Setting values for every date even if the post was not created at that date, it gets a 0
                    foreach (string date in LikesY.X_Values)
                    {
                        bool DataFound = false;
                        Int64 Local_Temp_LikesTotal_Count = 0;
                        Int64 Local_Temp_SharesTotal_Count = 0;
                        Int64 Local_Temp_CommentsTotal_Count = 0; 
                        foreach (var page in post.Pages)
                        {

                            foreach(var ins in post.PostInseightsHistory)
                            {
                                if((new DateTime(ins.InseightsTime.Value.Year, ins.InseightsTime.Value.Month, ins.InseightsTime.Value.Day, ins.InseightsTime.Value.Hour, ins.InseightsTime.Value.Minute, 0).ToString() == date)&&ins.PlatformPageID== page.Id)                              
                                {
                                    
                                        DataFound = true;
                                        Local_Temp_LikesTotal_Count += (Int64)Convert.ToInt64(ins.Post_Likes_TotalCount); 
                                        Local_Temp_SharesTotal_Count += (Int64)Convert.ToInt64(ins.Post_Shares_TotalCount);
                                        Local_Temp_CommentsTotal_Count += (Int64)Convert.ToInt64(ins.Post_Comment_TotalCount);
                                        break;
                                    

                                }
                            }

                        }
                            LikesY.Y_Values.Add(Local_Temp_LikesTotal_Count.ToString());
                            CommentsY.Y_Values.Add(Local_Temp_CommentsTotal_Count.ToString());
                            SharesY.Y_Values.Add(Local_Temp_SharesTotal_Count.ToString());
                    }

                   
                    Inseights.InseightsInfo.Add(LikesY);
                    Inseights.InseightsInfo.Add(CommentsY);
                    Inseights.InseightsInfo.Add(SharesY);

                    PostsInseightsGraph.Add(Inseights);
                }

                //calculating the current posts and comments total values
                foreach (var p in Posts)
                {
                    foreach (var posted_p in p.Posted_PlatformPosts)
                    {
                         Total_Likes_Count+= posted_p.PostLikes.Count;
                         Total_Comments_Count += posted_p.PostComments.Count;
                         Total_Shares_Count += (Int64)Convert.ToInt64(posted_p.SharesCount);
                    }
                    Total_Posts_Count++;
                }


                InseightsResult res = new InseightsResult();
                res.PostsInseights = PostsInseightsGraph;
                res.Total_Likes_Count = Total_Likes_Count;
                res.Total_Shares_Count= Total_Shares_Count;
                res.Total_Comment_Count= Total_Comments_Count;
                res.Total_Posts_Count= Total_Posts_Count;
                res.Total_Pages_Count = PlatformPages.Count;
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Posts_Inseights_Retreieved", Result = res });

            }

            catch (PostIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Post ID" });
            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }



        }
        [HttpPost("GetOptimalPublishDate"),Authorize]
        public async Task<ActionResult<string>> DeletePost(Inseights_PageList request)
        {

            DateTime OptimalDate = DateTime.Now;
            try
            {
                string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(accessToken);

                var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
                var ReqUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID))
                    .Include(g=>g.JoinedGroups)
                    .FirstOrDefaultAsync();
                List<PlatformPostScore> List_Of_Scored_platformposts = new List<PlatformPostScore>();
                foreach(var P_Page in request.ListOfPages)
                {
                    var Page = new PlatformPage();
                    //Finding the required platform page based on the ID
                    foreach(var group in ReqUser.JoinedGroups)
                    {

                        Page = await _db.PlatformPages.Where(p => p.PlatformPageID == (Int64)Convert.ToInt64(P_Page.Id) && p.GroupId == group.Id && p.IsDeleted == false)
                           .Include(p => p.Posted_PlatformPosts)
                           .ThenInclude(p => p.PostLikes)
                           .Include(p => p.Posted_PlatformPosts)
                           .ThenInclude(p => p.PostComments).FirstOrDefaultAsync();
                        if(Page!=null)
                        {
                            break;
                        }
                    }
                    if (Page == null)
                    {
                        throw new PostIDInvalid();
                    }


                    foreach ( var post in Page.Posted_PlatformPosts)
                    {
                        PlatformPostScore CurrentPage_PlatformPostScore = new PlatformPostScore
                        {
                            Platform_post=post,
                            Comment_Count=post.PostComments.Count,
                            Shares_Count=post.SharesCount,
                            Like_Count=post.PostLikes.Count,
                            PostDatetime=post.Platform_CreateDate,
                            Score= post.PostComments.Count * int.Parse( Configuration.GetSection("InseightsConstants")["CommentsImportanceConstant"])
                            + post.SharesCount * int.Parse(Configuration.GetSection("InseightsConstants")["SharesImportanceConstant"])
                            + post.PostLikes.Count * int.Parse(Configuration.GetSection("InseightsConstants")["LikesImportanceConstant"])
                        };

                        List_Of_Scored_platformposts.Add(CurrentPage_PlatformPostScore);

                    }
                    //If there is any previous data about the posts
                    if(List_Of_Scored_platformposts.Count>0)
                    {
                        //Calculating the score
                        TimeSpan OptimalTime = CalculateMeanHour(List_Of_Scored_platformposts);

                        DateTime OptimalDate_Temp = DateTime.Parse(request.PostDatetime);
                        // Modify the time component of the DateTime
                        OptimalDate = new DateTime(OptimalDate_Temp.Year, OptimalDate_Temp.Month, OptimalDate_Temp.Day, OptimalTime.Hours, OptimalTime.Minutes, OptimalTime.Seconds);
                    }
                    //There is no data about the posts that can help us estimate the time
                    else
                    {
                        OptimalDate = DateTime.Parse(request.PostDatetime).AddHours(-1);
                        
                    }



                }

                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "OptimalDateTime_Retreived", Result = OptimalDate.ToString() });

            }

            catch (PostIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Post ID" });
            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }



        }

        [NonAction]
        public TimeSpan CalculateMeanHour(List<PlatformPostScore> TimeScores)
        {
            int totalScore = 0;
            long weightedSumTicks = 0;

            foreach (var post in TimeScores)
            {
                TimeSpan time = post.PostDatetime.Value.TimeOfDay;
                int score = (int)post.Score;

                totalScore += score;
                weightedSumTicks += score * time.Ticks;
            }

            if (totalScore == 0)
            {
                // Handle the case where there are no scores to avoid division by zero
                throw new Exception("No scores available.");
            }

            long meanTicks = weightedSumTicks / totalScore;
            TimeSpan meanTime = TimeSpan.FromTicks(meanTicks);

            return meanTime;
        }



        [HttpPost("GetSinglePostInsights")]
        public async Task<ActionResult<string>> GetSinglePostInsights(SinglePostInsightsDTO request)
        {

            try
            {
                var Post = await _db.Posts.Where(p => p.Id == (Int64)Convert.ToInt64(request.PostID) && p.IsPosted == true && p.IsDeleted == false)
                    .Include(p => p.Pages)
                    .Include(p => p.PostInseightsHistory)
                    .Include(p => p.Posted_PlatformPosts).ThenInclude(p => p.PostLikes)
                    .Include(p => p.Posted_PlatformPosts).ThenInclude(p => p.PostComments)
                   .FirstOrDefaultAsync();

                //Disabling the infinite loop error
                JsonSerializerSettings jsonSettings = new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                };

                Int64? TotalLikes = 0;
                Int64? TotalComments = 0;
                Int64? TotalShares = 0;
                JObject ResponseResult = new JObject();

                JArray PagesInsights = new JArray();

                foreach(var Page in Post.Pages)
                {
                    JObject CurrentPageInsights = new JObject();
                    CurrentPageInsights["PageId"] = Page.Id;
                    CurrentPageInsights["Page_Name"] = Page.CachedData_PageName;
                    CurrentPageInsights["PageImage"] = Page.CachedData_PictureURL;
                    CurrentPageInsights["PagePlatform"] = Page.PlatformID;
                    //Getting the associated Post
                    PlatformPost RecentPost = Post.Posted_PlatformPosts.Where(p => p.PlatformPage_ID == Page.Id).Select(
                        p=> new PlatformPost()
                        {
                            Id=p.Id,
                            PostPlatformID=p.PostPlatformID,
                            PlatformId=p.PlatformId,
                            PostComments=p.PostComments.Select(p=> new PlatformComment
                            {
                                Id =p.Id,
                                PlatformId=p.PlatformId,
                                Platform_CreateDate=p.Platform_CreateDate,
                                Comment_Message = p.Comment_Message,
                                App_AddDate =p.App_AddDate,
                                
                            }).ToList(),

                            PostLikes = p.PostLikes.Select(p => new PlatformLike
                            {
                                Id = p.Id,
                                PlatformId = p.PlatformId,
                                 PlatfromAccount_Name= p.PlatfromAccount_Name,
                                 App_AddDate = p.App_AddDate,
 
                            }).ToList(),
                            
                            SharesCount=p.SharesCount,
                            PostMessage=p.PostMessage,
                            App_AddDate=p.App_AddDate, 
                        }).FirstOrDefault();



                    JArray PagePostHistoryJson= new JArray();
                    PagePostHistoryJson = PeparePageInsights(Post, Page);
                    CurrentPageInsights["PageHistory"] = PagePostHistoryJson;
                    CurrentPageInsights["PageDayProgress"] = GetPageProgress(Post, Page, RecentPost.PostLikes.Count(), RecentPost.SharesCount, RecentPost.PostComments.Count(), RecentPost.App_AddDate,"Day");
                    CurrentPageInsights["PageWeekProgress"] = GetPageProgress(Post, Page, RecentPost.PostLikes.Count(), RecentPost.SharesCount, RecentPost.PostComments.Count(), RecentPost.App_AddDate, "Week");
                    CurrentPageInsights["PageMonthProgress"] = GetPageProgress(Post, Page, RecentPost.PostLikes.Count(), RecentPost.SharesCount, RecentPost.PostComments.Count(), RecentPost.App_AddDate, "Month");
                    CurrentPageInsights["RecentPostInfo"] = JObject.FromObject(RecentPost, JsonSerializer.Create(jsonSettings));
                    TotalLikes += RecentPost.PostLikes.Count();
                    TotalShares += RecentPost.SharesCount;
                    TotalComments += RecentPost.PostComments.Count();
                    PagesInsights.Add(CurrentPageInsights); 

                }

                ResponseResult["TotalComments"] = TotalComments;
                ResponseResult["TotalLikes"] = TotalLikes;
                ResponseResult["TotalShares"] = TotalShares;

                ResponseResult["PagesInsights"] = PagesInsights;

                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Post_Insights_Recieved", Result = ResponseResult });

            }

            catch (PostIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Post ID" });
            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }



        }



        //This function get each page's insights
        [NonAction]
        public JArray PeparePageInsights(Post post, PlatformPage page)
        {
            try
            { 
                JArray PageInsightsList = new JArray();
                    //Setting values for every date even if the post was not created at that date, it gets a 0                                          
                            foreach (var ins in post.PostInseightsHistory.Where(i=>i.PlatformPageID==page.Id).ToList())
                            {
                               
                                    JObject Insight= new JObject();
                                    Insight["LikeCount"]= (Int64)Convert.ToInt64(ins.Post_Likes_TotalCount);
                                    Insight["SharesCount"]= (Int64)Convert.ToInt64(ins.Post_Shares_TotalCount);
                                    Insight["CommentCount"] = (Int64)Convert.ToInt64(ins.Post_Comment_TotalCount);
                                    Insight["InsightDate"] = ins.InseightsTime;
                                    PageInsightsList.Add(Insight);
                            }
                return PageInsightsList;

            }

            catch (PostIDInvalid e)
            {
                Console.WriteLine("Invalid Post ID");
                return new JArray();
            }


            catch (Exception ex)
            {
                Console.WriteLine("Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message);
                return new JArray();
                
            }

        }

        //This function get the progress the post made today, it compares it to yesterday's results
        [NonAction]
        public JObject GetPageProgress(Post post, PlatformPage page, Int64? Current_TotalLikes, Int64? Current_TotalShares, Int64? Current_TotalComments, DateTime? Current_InsightDateTime,string ProgressMesure)
        {
            try
            {
                PostHistory PreviousInsight = null;
                if (ProgressMesure=="Day")
                {
                    PreviousInsight = post.PostInseightsHistory.Where(i => i.PlatformPageID == page.Id && i.InseightsTime.Value.Day <= Current_InsightDateTime.Value.Day - 1).OrderByDescending(p => p.InseightsTime).FirstOrDefault();
                }
                if (ProgressMesure == "Week")
                {
                    PreviousInsight = post.PostInseightsHistory.Where(i => i.PlatformPageID == page.Id && i.InseightsTime.Value.Day <= Current_InsightDateTime.Value.Day - 6).OrderByDescending(p => p.InseightsTime).FirstOrDefault();
                }
                if (ProgressMesure == "Month")
                {
                    PreviousInsight = post.PostInseightsHistory.Where(i => i.PlatformPageID == page.Id && i.InseightsTime.Value.Month <= Current_InsightDateTime.Value.Month - 1).OrderByDescending(p => p.InseightsTime).FirstOrDefault();
                }
                JObject Progress= new JObject();
                if(PreviousInsight != null)
                {
                    Progress["LikesProgress"] = Current_TotalLikes - (Int64)Convert.ToInt64(PreviousInsight.Post_Likes_TotalCount);
                    Progress["CommentsProgress"] = Current_TotalComments - (Int64)Convert.ToInt64(PreviousInsight.Post_Comment_TotalCount);
                    Progress["SharesProgress"] = Current_TotalShares - (Int64)Convert.ToInt64(PreviousInsight.Post_Shares_TotalCount);
                }
                else
                {
                    Progress["LikesProgress"] = Current_TotalLikes;
                    Progress["CommentsProgress"] = Current_TotalComments;
                    Progress["SharesProgress"] = Current_TotalShares;
                }
                

                return Progress;
            }

            catch (Exception ex)
            {
                Console.WriteLine("Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message);
                return new JObject();

            }

        }



    }
}
