using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SocialPostBackEnd.Data;
using System.Net.Http.Headers;
using Facebook;
using Microsoft.AspNetCore.Mvc;
using SocialPostBackEnd.Exceptions;
using SocialPostBackEnd.Models;

namespace SocialPost_PlatformAccountService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly ApplicationDbContext _db;
        public IConfiguration Configuration { get; }
        public Worker(ILogger<Worker> logger, IConfiguration configuration, ApplicationDbContext db)
        {
            _logger = logger;
            Configuration = configuration;
            _db = db;
        }


        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            //Getting the AppAccess Token
            string AppAccessToken = await GetAppAccessToken();

            while (!stoppingToken.IsCancellationRequested)
            {
              try
                {
                    TimeSpan timeSpan2 = TimeSpan.FromMilliseconds(int.Parse(Configuration.GetSection("ServiceConfig")["StartDelay"]));
                    string timeString2 = timeSpan2.ToString(@"hh\:mm\:ss");
                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: STARTED, Waiting {time} to avoid conflict with Scheduler service----", timeString2);
                    await Task.Delay(int.Parse(Configuration.GetSection("ServiceConfig")["StartDelay"]), stoppingToken);
                    int AppLimit = await CalculateAppRequestLimit(AppAccessToken);
                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: ACTIVE, Updating Platform Pages details at {time}----", DateTimeOffset.Now);
                    await UpdatePlatformPage(AppLimit, stoppingToken, AppAccessToken);
                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: ACTIVE,  Platform Pages details Update finished at {time}----", DateTimeOffset.Now);
                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: ACTIVE, Updating Platform Accounts details at {time}----", DateTimeOffset.Now);
                    await UpdatePlatformAccount(AppLimit, stoppingToken, AppAccessToken);
                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: ACTIVE,  Platform Accounts details Update finished at {time}----", DateTimeOffset.Now);
                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: ACTIVE, Updating Platform Pages inseights at {time}----", DateTimeOffset.Now);

                    await UpdatePlatformPost(AppLimit, stoppingToken, AppAccessToken);

                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: ACTIVE,  Platform Page inseights Update finished at {time}----", DateTimeOffset.Now);

                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: ACTIVE, Updating App Posts Inseights History at {time}----", DateTimeOffset.Now);

                    await UpdatePostInseightsHistory();

                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: ACTIVE,  App Posts Inseights History Update finished at {time}----", DateTimeOffset.Now);

                    TimeSpan timeSpan = TimeSpan.FromMilliseconds(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatCheckDelay"]));
                    string timeString = timeSpan.ToString(@"hh\:mm\:ss");     
                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: IDLE, Update Complete at {time},Next after  {SleepTime}----", DateTimeOffset.Now, timeString);

                    await Task.Delay(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatCheckDelay"]), stoppingToken);
                }
                catch(Exception ex)
                {
                    _logger.LogInformation("----[SP] PAGES UPDATE SERVICE: STATUS: FAILED, Update Failed at {time}----", DateTimeOffset.Now);
                    _logger.LogInformation("----[SP] PAGES UPDATE EXCEPTION:{e}----", ex.Message);
                    await Task.Delay(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatCheckDelay"]), stoppingToken);
                }
                

            }
        }



        //============================NOTE: This function is responsible about updating the inseights history=====================//
        public async Task UpdatePostInseightsHistory()
        {
            var Posts = await _db.Posts.Where(p => p.IsDeleted == false)
                .Include(p=>p.PostInseightsHistory)
                .Include(p=>p.Posted_PlatformPosts)
                .ThenInclude(p=>p.PlatformPage)
                .Include(p => p.Posted_PlatformPosts)
                .ThenInclude(p => p.PostComments)
                .Include(p => p.Posted_PlatformPosts)
                .ThenInclude(p => p.PostLikes)
                .ToListAsync();           
            foreach (var Post in Posts)
            {               
                foreach(var PostedPost in Post.Posted_PlatformPosts)
                {
                    PostHistory History =  new PostHistory
                    {
                        Post_Comment_TotalCount=PostedPost.PostComments.Count.ToString(),
                        Post_Shares_TotalCount= PostedPost.SharesCount.ToString(),
                        Post_Likes_TotalCount= PostedPost.PostLikes.Count.ToString(),
                        InseightsTime=DateTime.Now,
                        PlatformPage=PostedPost.PlatformPage,
                        Post= Post
                    };
                    _db.PostsHistory.Add(History);

                }                              
            }
            await _db.SaveChangesAsync();
        }

            public async Task UpdatePlatformPost(int AppLimit, CancellationToken stoppingToken, string AppAccessToken)
        {
            //==============================NOTE: This Function is responsible to update the pages inseights===========================//

            int App_Limit = AppLimit;
            //This variable tells us that count of the accounts that are already updated, it's used so that we know when to stop updating the pages.
            int HandeledAccounts_Count = 0;
            var PlatformPages = await _db.PlatformPages.Where(p => p.IsDeleted == false).ToListAsync();

            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Accounts found to Update----", PlatformPages.Count); }
            foreach (var PlatformPage in PlatformPages)
            {

                //We test if we're close to the limit, if we are we stop for an hour to gain our limit back
                while (HandeledAccounts_Count > (2 * App_Limit / 3))
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: Accounts {x} Update Stopped, limit reached, waiting for {time}----", PlatformPage.CachedData_PageName, TimeSpan.FromMilliseconds(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatDelayAfterMetaAppLimit"])).ToString(@"hh\:mm\:ss")); }
                    await Task.Delay(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatDelayAfterMetaAppLimit"]), stoppingToken);
                    //After the stop is completed, we calculate the app limit again and updated it
                    App_Limit = await CalculateAppRequestLimit(AppAccessToken);
                    HandeledAccounts_Count = 0;
                }
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: Updating The Accounts {x}----", PlatformPage.CachedData_PageName); }
                
                //-------------Updating the cached values of the platformm Acc-----------//
                //Handling the case if the Page is a Facebook Page
                if (PlatformPage.PlatformID == 1)
                {
                    dynamic Posts = await GetFacebookPagePostsDetails(PlatformPage.AccessToken, PlatformPage.PlatformPageID.ToString());
                    Int64 PostsCount = Posts.data.Count;
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Posts found to Update----", PostsCount); }
                    foreach (var post in Posts.data)
                    {
                        string PostID = post.id;
                        bool PostIsCached = false;
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: Updating The Post {x}----", PostID); }
                        var CachedPost= await _db.PlatformPosts.Where(p => p.IsDeleted == false &&p.PlatformPage_ID==PlatformPage.Id &&p.PostPlatformID==PostID)
                            .Include(p=>p.PostLikes)
                            .Include(p=>p.PostComments)
                            .FirstOrDefaultAsync();                        
                        if(CachedPost!=null)
                        {
                            PostIsCached = true;
                        }                        
                        //Post is already cached, we should just update it here
                        if(PostIsCached)
                        {
                            CachedPost.PostComments.Clear();
                            CachedPost.PostLikes.Clear();
                            CachedPost.PostMessage = post.message;
                            CachedPost.Platform_CreateDate= post.created_time;
                            //------Updating Comments------------//
                            //Testing if the page has comments
                            if (post.comments!=null)
                            {
                                Int64 CommentsCount= post.comments.data.Count;
                                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Comments found to Update----", CommentsCount); }
                                foreach (var comment in post.comments.data)
                                {
                                    PlatformComment Comment = new PlatformComment
                                    {
                                        PlatformId = 1,
                                        PlatformPost = CachedPost,
                                        App_AddDate = DateTime.Now,
                                        App_DeleteDate = null,
                                        Comment_Message = comment.message,
                                        IsDeleted = false,
                                        Platform_CommentID = comment.id,
                                        Platform_CreateDate = comment.created_time,


                                    };
                                    _db.PlatformComments.Add(Comment);
                                    CachedPost.PostComments.Add(Comment);
                                }
                            }
                           if(post.likes!=null)
                            {
                                Int64 LikesCount = post.likes.data.Count;
                                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Likes found to Update----", LikesCount); }
                                //------Updating Likes------------//
                                foreach (var like in post.likes.data)
                                {
                                    PlatformLike Like = new PlatformLike
                                    {
                                        PlatformId = 1,
                                        PlatformPost = CachedPost,
                                        App_AddDate = DateTime.Now,
                                        App_DeleteDate = null,
                                        IsDeleted = false,
                                        Platform_LikeID = like.id,
                                        PlatfromAccount_Name = like.name,
                                    };
                                    _db.PlatformLikes.Add(Like);
                                    CachedPost.PostLikes.Add(Like);
                                }
                            }
                            if (post.shares != null)
                            {
                                CachedPost.SharesCount = post.shares.count;
                            }
                            else
                            {
                                CachedPost.SharesCount = 0;
                            }


                        }
                        //Post is not cached, we should just add it here
                        else
                        {
                            PlatformPost NewPlatformPost = null; 
                            if (post.shares != null)
                            {
                                 NewPlatformPost = new PlatformPost
                                {
                                    PlatformId = 1,
                                    PlatformPage = PlatformPage,
                                    PlatformPage_ID = PlatformPage.PlatformPageID,
                                    IsAppPosted = false,
                                    PostMessage = post.message,
                                    Platform_CreateDate = post.created_time,
                                    PostComments = new List<PlatformComment>(),
                                    PostLikes = new List<PlatformLike>(),
                                    App_Post = null,
                                    App_AddDate = DateTime.Now,
                                    App_DeleteDate = null,
                                    App_PostID = null,
                                    SharesCount = post.shares.count,
                                    IsDeleted = false,
                                    PostPlatformID = post.id,
                                };
                               
                            }
                            else
                            {
                                 NewPlatformPost = new PlatformPost
                                {
                                    PlatformId = 1,
                                    PlatformPage = PlatformPage,
                                    PlatformPage_ID = PlatformPage.PlatformPageID,
                                    IsAppPosted = false,
                                    PostMessage = post.message,
                                    Platform_CreateDate = post.created_time,
                                    PostComments = new List<PlatformComment>(),
                                    PostLikes = new List<PlatformLike>(),
                                    App_Post = null,
                                    App_AddDate = DateTime.Now,
                                    App_DeleteDate = null,
                                    App_PostID = null,
                                    SharesCount = 0,
                                    IsDeleted = false,
                                    PostPlatformID = post.id,
                                };

                            }

                            _db.PlatformPosts.Add(NewPlatformPost);
                            //------Updating Comments------------//
                            //Testing if the page has comments
                            if (post.comments != null)
                            {
                                Int64 CommentsCount = post.comments.data.Count;
                                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Comments found to Update----", CommentsCount); }
                                foreach (var comment in post.comments.data)
                                {
                                    PlatformComment Comment = new PlatformComment
                                    {
                                        PlatformId = 1,
                                        PlatformPost = NewPlatformPost,
                                        App_AddDate = DateTime.Now,
                                        App_DeleteDate = null,
                                        Comment_Message = comment.message,
                                        IsDeleted = false,
                                        Platform_CommentID = comment.id,
                                        Platform_CreateDate = comment.created_time,


                                    };
                                    _db.PlatformComments.Add(Comment);
                                    NewPlatformPost.PostComments.Add(Comment);
                                }
                            }
                            if (post.likes != null)
                            {
                                //------Updating Likes------------//
                                Int64 LikesCount = post.likes.data.Count;
                                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Likes found to Update----", LikesCount); }
                                foreach (var like in post.likes.data)
                                {
                                    PlatformLike Like = new PlatformLike
                                    {
                                        PlatformId = 1,
                                        PlatformPost = NewPlatformPost,
                                        App_AddDate = DateTime.Now,
                                        App_DeleteDate = null,
                                        IsDeleted = false,
                                        Platform_LikeID = like.id,
                                        PlatfromAccount_Name = like.name,
                                    };
                                    _db.PlatformLikes.Add(Like);
                                    NewPlatformPost.PostLikes.Add(Like);
                                }
                            }
                          
                            
                        }

                       
                    }
                }
                //Handling the case if the Page is a Instagram Page
                else
                {
                    dynamic Posts = await GetInstagramPagePostsDetails(PlatformPage.AccessToken, PlatformPage.PlatformPageID.ToString());
                    Int64 PostsCount = Posts.data.Count;
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Posts found to Update----", PostsCount); }
                    foreach (var post in Posts.data)
                    {
                        string PostID = post.id;
                        bool PostIsCached = false;
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: Updating The Post {x}----", PostID); }
                        var CachedPost = await _db.PlatformPosts.Where(p => p.IsDeleted == false && p.PlatformPage_ID == PlatformPage.Id && p.PostPlatformID == PostID)
                            .Include(p => p.PostLikes)
                            .Include(p => p.PostComments)
                            .FirstOrDefaultAsync();
                        if (CachedPost != null)
                        {
                            PostIsCached = true;
                        }
                        //Post is already cached, we should just update it here
                        if (PostIsCached)
                        {
                            CachedPost.PostComments.Clear();
                            CachedPost.PostLikes.Clear();
                            CachedPost.PostMessage = post?.caption??"";
                            CachedPost.Platform_CreateDate = post.timestamp;
                            //------Updating Comments------------//
                            //Testing if the page has comments
                            if (post.comments != null)
                            {
                                Int64 CommentsCount = post.comments.data.Count;
                                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Comments found to Update----", CommentsCount); }
                                foreach (var comment in post.comments.data)
                                {
                                    PlatformComment Comment = new PlatformComment
                                    {
                                        PlatformId = 2,
                                        PlatformPost = CachedPost,
                                        App_AddDate = DateTime.Now,
                                        App_DeleteDate = null,
                                        Comment_Message = comment.text,
                                        IsDeleted = false,
                                        Platform_CommentID = comment.id,
                                        Platform_CreateDate = comment.timestamp,


                                    };
                                    _db.PlatformComments.Add(Comment);
                                    CachedPost.PostComments.Add(Comment);
                                }
                            }
                            if (post.insights != null)
                            {
                                if (post.insights.data[0] != null)
                                {
                                    Int64 LikesCount = post.insights.data[0].values[0].value;
                                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Likes found to Update----", LikesCount); }
                                    //------Updating Likes------------//
                                    for (int i = 0; i < LikesCount; i++)
                                    {
                                        PlatformLike Like = new PlatformLike
                                        {
                                            PlatformId = 2,
                                            PlatformPost = CachedPost,
                                            App_AddDate = DateTime.Now,
                                            App_DeleteDate = null,
                                            IsDeleted = false,
                                            Platform_LikeID = post.insights.data[0].id,
                                            PlatfromAccount_Name = "NOACCOUNTNAME_REQUIRE_MORE_PERMISSIONS",
                                        };
                                        _db.PlatformLikes.Add(Like);
                                        CachedPost.PostLikes.Add(Like);
                                    }
                                }
                                if (post.insights.data[1] != null)
                                {
                                    //------Updating the post shares count------------//
                                    CachedPost.SharesCount = post.insights.data[1].values[0].value;


                                }
                                else
                                {
                                    CachedPost.SharesCount = 0;
                                }
                            }


                        }
                        //Post is not cached, we should just add it here
                        else
                        {
                            PlatformPost NewPlatformPost = new PlatformPost
                            {
                                PlatformId = 2,
                                PlatformPage = PlatformPage,
                                PlatformPage_ID = PlatformPage.PlatformPageID,
                                IsAppPosted = false,
                                PostMessage = post?.caption ?? "",
                                Platform_CreateDate = post.timestamp,
                                PostComments = new List<PlatformComment>(),
                                PostLikes = new List<PlatformLike>(),
                                App_Post = null,
                                App_AddDate = DateTime.Now,
                                App_DeleteDate = null,
                                App_PostID = null,
                                SharesCount = 0,
                                IsDeleted = false,
                                PostPlatformID = post.id

                            };
                            _db.PlatformPosts.Add(NewPlatformPost);
                            //------Updating Comments------------//
                            //Testing if the page has comments
                            if (post.comments != null)
                            {
                                Int64 CommentsCount = post.comments.data.Count;
                                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Comments found to Update----", CommentsCount); }
                                foreach (var comment in post.comments.data)
                                {
                                    PlatformComment Comment = new PlatformComment
                                    {
                                        PlatformId = 2,
                                        PlatformPost = CachedPost,
                                        App_AddDate = DateTime.Now,
                                        App_DeleteDate = null,
                                        Comment_Message = comment.text,
                                        IsDeleted = false,
                                        Platform_CommentID = comment.id,
                                        Platform_CreateDate = comment.timestamp,


                                    };
                                    _db.PlatformComments.Add(Comment);
                                    NewPlatformPost.PostComments.Add(Comment);
                                }
                            }
                            if(post.insights!=null)
                            {
                                if (post.insights.data[0] != null)
                                {
                                    Int64 LikesCount = post.insights.data[0].values[0].value;
                                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Likes found to Update----", LikesCount); }
                                    //------Updating Likes------------//
                                    for (int i = 0; i < LikesCount; i++)
                                    {
                                        PlatformLike Like = new PlatformLike
                                        {
                                            PlatformId = 2,
                                            PlatformPost = CachedPost,
                                            App_AddDate = DateTime.Now,
                                            App_DeleteDate = null,
                                            IsDeleted = false,
                                            Platform_LikeID = post.insights.data[0].id,
                                            PlatfromAccount_Name = "NOACCOUNTNAME_REQUIRE_MORE_PERMISSIONS",
                                        };
                                        _db.PlatformLikes.Add(Like);
                                        NewPlatformPost.PostLikes.Add(Like);
                                    }
                                }
                                if (post.insights.data[1] != null)
                                {
                                    //------Updating the post shares count------------//
                                    NewPlatformPost.SharesCount = post.insights.data[1].values[0].value;


                                }
                                else
                                {
                                    NewPlatformPost.SharesCount = 0;
                                }
                            }
                           

                        }


                    }

                }              
                
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: The Accounts {x} Updated successfully----", PlatformPage.CachedData_PageName); }
                //----------------End-----------------//
                HandeledAccounts_Count++;

            }




        }





        public async Task UpdatePlatformAccount(int AppLimit, CancellationToken stoppingToken,string AppAccessToken)
        {
               int App_Limit = AppLimit;
                //This variable tells us that count of the accounts that are already updated, it's used so that we know when to stop updating the pages.
                int HandeledAccounts_Count = 0;
                var PlatformAccounts = await _db.PlatformAccounts.Where(p=>p.IsDeleted==false).ToListAsync();

                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: {x} Accounts found to Update----", PlatformAccounts.Count); }
                foreach (var PlatformAccount in PlatformAccounts)
                {
                   
                    //We test if we're close to the limit, if we are we stop for an hour to gain our limit back
                    while (HandeledAccounts_Count > (2 * App_Limit / 3))
                    {
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: Accounts {x} Update Stopped, limit reached, waiting for {time}----", PlatformAccount.CachedData_Name, TimeSpan.FromMilliseconds(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatDelayAfterMetaAppLimit"])).ToString(@"hh\:mm\:ss")); }
                        await Task.Delay(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatDelayAfterMetaAppLimit"]), stoppingToken);
                        //After the stop is completed, we calculate the app limit again and updated it
                        App_Limit = await CalculateAppRequestLimit(AppAccessToken);
                        HandeledAccounts_Count = 0;
                    }
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: Updating The Accounts {x}----", PlatformAccount.CachedData_Name); }
                    dynamic Data = await GetPlatformAccountInfo(PlatformAccount.AccessToken, PlatformAccount.PlatformAccountID);
                    //-------------Updating the cached values of the platformm Acc-----------//
                    PlatformAccount.CachedData_Name = Data.name;
                    PlatformAccount.CachedData_Last_name = Data.last_name;
                    PlatformAccount.CachedData_First_name = Data.first_name;
                    PlatformAccount.CachedData_Email = Data.email;
                    PlatformAccount.CachedData_PictureHeight = Data.picture.data.height;
                    PlatformAccount.CachedData_PictureWidth = Data.picture.data.width;
                    PlatformAccount.CachedData_PictureIs_silhouette = Data.picture.data.is_silhouette;
                    PlatformAccount.CachedData_PictureURL = Data.picture.data.url;
                    PlatformAccount.CachedData_LastUpdateDate = DateTime.Now;
                
                     await _db.SaveChangesAsync();
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Accounts UPDATE SERVICE: The Accounts {x} Updated successfully----", PlatformAccount.CachedData_Name); }
                //----------------End-----------------//
                HandeledAccounts_Count++;

                }

            

        }


        public async Task UpdatePlatformPage(int AppLimit, CancellationToken stoppingToken, string AppAccessToken)
        {
            
                int App_Limit = AppLimit;
                //This variable tells us that count of the accounts that are already updated, it's used so that we know when to stop updating the pages.
                int HandeledAccounts_Count = 0;
                var PlatformPages = await _db.PlatformPages.Where(p=>p.IsDeleted==false).ToListAsync();

                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] PAGE UPDATE SERVICE: {x} PAGES found to Update----", PlatformPages.Count); }
                foreach (var PlatformPage in PlatformPages)
                {
                    //We test if we're close to the limit, if we are we stop for an hour to gain our limit back
                    while (HandeledAccounts_Count > (2 * App_Limit / 3))
                    {
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] PAGE UPDATE SERVICE: PAGE {x} Update Stopped, limit reached, waiting for {time}----", PlatformPage.CachedData_PageName, TimeSpan.FromMilliseconds(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatDelayAfterMetaAppLimit"])).ToString(@"hh\:mm\:ss")); }
                        await Task.Delay(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatDelayAfterMetaAppLimit"]), stoppingToken);
                        //After the stop is completed, we calculate the app limit again and updated it
                        App_Limit = await CalculateAppRequestLimit(AppAccessToken);
                        HandeledAccounts_Count = 0;
                    }
                   
                    dynamic Data = await GetPlatformPageInfo(PlatformPage.AccessToken, PlatformPage.PlatformPageID.ToString(), PlatformPage.PlatformID);
                    //-------------Updating the cached values of the platformm Acc-----------//
                    if(PlatformPage.PlatformID==1)
                    {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] PAGE UPDATE SERVICE: Updating The  Facebook PAGE {x}----", PlatformPage.CachedData_PageName); }
                    //---------------Here we test if the page has any location info specified----------------//
                    bool locationInfoExist = false;
                        if (Data.location != null)
                        {
                            locationInfoExist = true;
                        }

                        var City = "";
                        var Street = "";
                        var Zip = "";
                        var Country = "";
                        if (locationInfoExist)
                        {
                            City = Data.location.city?.ToString() ?? "";
                            Street = Data.location.street?.ToString() ?? "";
                            Zip = Data.location.zip?.ToString() ?? "";
                            Country = Data.location.country?.ToString() ?? "";
                        }
                        var Location_Detailed = Country + " " + City + " " + Street + " " + Zip;
                        ///------------------Location Test ends here-----------------------------///

                        PlatformPage.CachedData_PageName = Data.name?.ToString();
                        PlatformPage.CachedData_About = Data.about?.ToString() ?? "No About Specified";
                        PlatformPage.CachedData_Bio = Data.bio?.ToString() ?? "No Bio Specified";
                        PlatformPage.CachedData_Category = Data.category?.ToString() ?? "No Category Specified";
                        PlatformPage.CachedData_Description = Data.description?.ToString() ?? "No Description Specified";
                        PlatformPage.CachedData_fan_count = Data.fan_count?.ToString();
                        PlatformPage.CachedData_followers_count = Data.followers_count?.ToString();
                        PlatformPage.CachedData_LastUpdateDate = DateTime.Now;
                        PlatformPage.CachedData_Location = Location_Detailed;
                        PlatformPage.CachedData_PhoneNumber = Data.phone?.ToString() ?? "No Number Specified";
                        PlatformPage.CachedData_PictureHeight = Data.picture.data.height?.ToString() ?? "No Height specified";
                        PlatformPage.CachedData_PictureIs_silhouette = (bool)Data.picture.data.is_silhouette;
                        PlatformPage.CachedData_PictureURL = Data.picture.data.url?.ToString() ?? "https://via.placeholder.com/50x50";
                        PlatformPage.CachedData_PictureWidth = Data.picture.data.width?.ToString() ?? "No Width specified";
                        PlatformPage.CachedData_WebsiteURL = Data.website?.ToString() ?? "No website Specified";
                        PlatformPage.CachedData_LastUpdateDate = DateTime.Now;
                       
                    }
                    if(PlatformPage.PlatformID==2)
                    {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] PAGE UPDATE SERVICE: Updating The Instagram Page {x}----", PlatformPage.CachedData_PageName); }
                    PlatformPage.CachedData_PageName = Data.name?.ToString() ?? Data.username?.ToString() ?? "No Username Or Name Found";
                        PlatformPage.CachedData_About = "No About Specified";
                        PlatformPage.CachedData_Bio = Data.biography?.ToString() ?? "No Bio Specified";
                        PlatformPage.CachedData_Category = Data.category?.ToString() ?? "No Category Specified";
                        PlatformPage.CachedData_Description = "No Description Specified";
                        PlatformPage.CachedData_fan_count = Data.business_discovery.follows_count?.ToString() ?? "No Count specified";
                        PlatformPage.CachedData_followers_count = Data.business_discovery.followers_count?.ToString() ?? "No Followers specified";
                        PlatformPage.CachedData_LastUpdateDate = DateTime.Now;
                        PlatformPage.CachedData_Location = "No Location Specified";
                        PlatformPage.CachedData_PhoneNumber = "No Number Specified";
                        PlatformPage.CachedData_PictureHeight = "50";
                        PlatformPage.CachedData_PictureIs_silhouette = false;
                        PlatformPage.CachedData_PictureURL = Data.profile_picture_url?.ToString() ?? "https://via.placeholder.com/50x50";
                        PlatformPage.CachedData_PictureWidth = "50";
                        PlatformPage.CachedData_WebsiteURL = Data.business_discovery.website?.ToString() ?? "No Website specifeid";
                        PlatformPage.CachedData_LastUpdateDate = DateTime.Now;

                    }
                    if(PlatformPage.PlatformID != 2 && PlatformPage.PlatformID != 1)
                    {
                        throw new Exception("Unsupported Platform");
                    }

                    await _db.SaveChangesAsync();
                     HandeledAccounts_Count++;
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] PAGE UPDATE SERVICE: The Page {x} Updated successfully----", PlatformPage.CachedData_PageName); }
                //----------------End-----------------//
               

                }

           

        }


        [NonAction]
        public async Task<dynamic> GetPlatformPageInfo(string AccessToken, string PageID, Int64? PlatformID)
        {

            //if a facebook page we handle it like this
            if (PlatformID == 1)
            {
                var accessToken = AccessToken;
                var fbClient = new FacebookClient(accessToken);
                

                    using (var httpClient = new HttpClient())
                    {
                        httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                        var parameters = new Dictionary<string, string>();
                        var content = new FormUrlEncodedContent(parameters);
                        var response = await httpClient.GetAsync($"/" + PageID + "?fields=name,id,personal_info,picture,bio,category,followers_count,fan_count,description,about,emails,location,website,phone&access_token=" + AccessToken);
                        var responseContent = await response.Content.ReadAsStringAsync();
                        dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                        if (response.IsSuccessStatusCode)
                        {

                            return responseObject;
                        }
                        else
                        {

                            throw new Exception($"Failed to  fetch Facebook Page info . Status code: {response.StatusCode}");
                        }
                    }
            }
            //If Instagram we handle it like this
            if (PlatformID == 2)
            {
                string InstaAccName = "";
                using (var httpClient = new HttpClient())
                {
                    httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                    var parameters = new Dictionary<string, string>();
                    var content = new FormUrlEncodedContent(parameters);
                    var response = await httpClient.GetAsync($"/" + PageID + "?fields=id,username&access_token=" + AccessToken);
                    var responseContent = await response.Content.ReadAsStringAsync();
                    dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                    if (response.IsSuccessStatusCode)
                    {
                        InstaAccName=responseObject.username;
                    }
                    else
                    {

                        throw new Exception($"Failed to Fetch Instagram Page Username {response.StatusCode}");
                    }
                }

                using (var httpClient = new HttpClient())
                {
                    httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                    var parameters = new Dictionary<string, string>();
                    var content = new FormUrlEncodedContent(parameters);
                    var response = await httpClient.GetAsync($"/" + PageID + "?fields=id,username,profile_picture_url,name,biography,business_discovery.username(" + InstaAccName + "){website,followers_count,media_count,follows_count}&access_token=" + AccessToken);
                    var responseContent = await response.Content.ReadAsStringAsync();
                    dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                    if (response.IsSuccessStatusCode)
                    {

                        return responseObject;
                    }
                    else
                    {

                        throw new Exception($"Failed to Fetch Instagram Page Info: {response.StatusCode}");
                    }
                }




            }
            else
            {
                throw new PlatformNotSupported();
            }




        }


        //-------------------------------------------NOTE: This Function Gets PlatformAccount Info---------------------------//
        public async Task<dynamic> GetPlatformAccountInfo(string AccessToken, string UserID)
        {
            var accessToken = AccessToken;
            
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                var parameters = new Dictionary<string, string>();
                var content = new FormUrlEncodedContent(parameters);
                var response = await httpClient.GetAsync($"/" + UserID + "?fields=id,first_name,last_name,picture,name,email&access_token="+ AccessToken);
                var responseContent = await response.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode)
                {

                    return responseObject;
                }
                else
                {

                    throw new Exception($"Failed to get PlatformAccount info. Status code: {response.StatusCode}");
                }
            }






        }
        //-------------------------------------------END NOTE---------------------------//


        //-------------------------------------------NOTE: This Function Gets the posts, comments, for a facebook page---------------------------//
        public async Task<dynamic> GetFacebookPagePostsDetails(string AccessToken, string PageID)
        {
            var accessToken = AccessToken;

            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                var parameters = new Dictionary<string, string>();
                var content = new FormUrlEncodedContent(parameters);
                var response = await httpClient.GetAsync($"/" + PageID + "/posts?fields=id,comments{id,message,reactions{id,name},created_time},likes{id,name},message,created_time,shares&access_token=" + AccessToken);
                var responseContent = await response.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode)
                {

                    return responseObject;
                }
                else
                {

                    throw new Exception($"Failed to get Facebook Posts. Status code: {response.StatusCode}");
                }
            }






        }
        //-------------------------------------------END NOTE---------------------------//



        //-------------------------------------------NOTE: This Function Gets the posts, comments, for a Instagram page---------------------------//
        public async Task<dynamic> GetInstagramPagePostsDetails(string AccessToken, string PageID)
        {
            var accessToken = AccessToken;

            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                var parameters = new Dictionary<string, string>();
                var content = new FormUrlEncodedContent(parameters);
                var response = await httpClient.GetAsync($"/" + PageID + "/media?fields=comments_count,like_count,timestamp,caption,id,insights.metric(likes,shares){name,period,values,id},comments{from,text,id,timestamp}&access_token=" + AccessToken);
                var responseContent = await response.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode)
                {

                    return responseObject;
                }
                else
                {

                    throw new Exception($"Failed to Get Instagram Posts. Status code: {response.StatusCode}");
                }
            }






        }
        //-------------------------------------------END NOTE---------------------------//



        //-------------------------------------------NOTE: This Function Gets the App Access token, this will be used to get the app's request limit---------------------------//
        public async Task<String> GetAppAccessToken()
        {
            //Facebook allows 200 request per user, we get the App users and multiply it by 200 to get the requests limit
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                var parameters = new Dictionary<string, string>();
                var content = new FormUrlEncodedContent(parameters);
                var response = await httpClient.PostAsync($"oauth/access_token?client_id={Configuration.GetConnectionString("MetaAppID")}&client_secret={Configuration.GetConnectionString("MetaAppCode")}&grant_type=client_credentials&scopes={Configuration.GetConnectionString("MetaAppScopes")}", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode)
                {

                    return responseObject.access_token;
                }
                else
                {

                    throw new Exception($"Failed to get App Access Token. Status code: {response.StatusCode}");
                }
            }
        }
        //-------------------------------------------END NOTE---------------------------//

        //-------------------------------------------NOTE: This Function Gets the App's active users, it will be used to calculate request limits--------------------------//
        public async Task<int> CalculateAppRequestLimit(string AppAccessToken)
        {
            //Facebook allows 200 request per user, we get the App users and multiply it by 200 to get the requests limit
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AppAccessToken);                
                var parameters = new Dictionary<string, string>();
                var content = new FormUrlEncodedContent(parameters);
                var response = await httpClient.GetAsync($"{Configuration.GetConnectionString("MetaAppID")}?fields=daily_active_users");
                var responseContent = await response.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode)
                {
                   
                    return (int)responseObject.daily_active_users *200;
                }
                else
                {
                
                    throw new Exception($"Failed to get Daily Active users to calculate App req limit. Status code: {response.StatusCode}");
                }
            }
           

        }
        //-------------------------------------------END NOTE---------------------------//
    }
}