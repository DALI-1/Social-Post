using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SocialPostBackEnd.Data;
using SocialPostBackEnd.Exceptions;
using SocialPostBackEnd.Models;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Dynamic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using static System.Net.Mime.MediaTypeNames;
using System.Runtime.Intrinsics.X86;
using System;
using System.Security.AccessControl;

namespace SocialPost_Scheduler_Service
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
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("----[SP] SCHEDULE SERVICE: STATUS: ACTIVE, Updating Posts at {time}----", DateTimeOffset.Now);
                    await HandleScheduledPosts();
                    _logger.LogInformation("----[SP] SCHEDULE SERVICE: STATUS: ACTIVE, Posts Update finished at {time}----", DateTimeOffset.Now);
                    _logger.LogInformation("----[SP] SCHEDULE SERVICE: STATUS: ACTIVE, Updating repeated posts  at {time}----", DateTimeOffset.Now);
                    await HandleRepeatPostsDates();
                    _logger.LogInformation("----[SP] SCHEDULE SERVICE: STATUS: ACTIVE, Repeated posts Update finished at {time}----", DateTimeOffset.Now);
                    TimeSpan timeSpan = TimeSpan.FromMilliseconds(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatCheckDelay"]));
                    string timeString = timeSpan.ToString(@"hh\:mm\:ss");

                    _logger.LogInformation("----[SP] SCHEDULE SERVICE: STATUS: IDLE, Update Complete at {time},Next after  {SleepTime}----", DateTimeOffset.Now, timeString);
                    await Task.Delay(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatCheckDelay"]), stoppingToken);
                }
                catch(Exception ex)
                {
                    _logger.LogInformation("----[SP] SCHEDULE SERVICE:: STATUS: FAILED, Update Failed at {time}----", DateTimeOffset.Now);
                    _logger.LogInformation("----[SP] Exception details: {details} ", ex.Message);
                    await Task.Delay(int.Parse(Configuration.GetSection("ServiceConfig")["ServiceRepeatCheckDelay"]), stoppingToken);
                }
                
            }


        }


        

        public async Task HandleRepeatPostsDates()
        {

            
                //This function is gonna update the post date based on the options, hourly, monthly, weekly..
                List<Post> posts = await _db.Posts.Where(p => p.IsDeleted == false && p.IsPosted == false && p.RepeatPost == true)
                    .Include(p => p.Pages)
                    .Include(p => p.UsedAssets)
                    .Include(p => p.PostDynamicFields).ThenInclude(p => p.Pattern)
                  .ToListAsync();

            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE:{x} Repeat Posts found----", posts.Count); }
            foreach (Post post in posts)
                {

                    //We test if the date is passed or not? if it is and the repeat option is on, we update it to fit the next post date
                    if (post.PostDate < DateTime.Now)
                    {

                        if (post.RepeatOption == "Hourly")
                        {
                            post.PostDate = post.PostDate.Value.AddHours(1);

                        }
                        if (post.RepeatOption == "Daily")
                        {
                            post.PostDate = post.PostDate.Value.AddDays(1);
                        }
                        if (post.RepeatOption == "Weekly")
                        {
                            post.PostDate = post.PostDate.Value.AddDays(7);
                        }
                        if (post.RepeatOption == "Monthly")
                        {
                            post.PostDate = post.PostDate.Value.AddDays(30);
                        }
                        if (post.RepeatOption == "Yearly")
                        {
                            post.PostDate = post.PostDate.Value.AddDays(365);
                        }

                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE: Updating the Post {X} 's next POST DATE---", post.Id); }
                }

                }
                
            await _db.SaveChangesAsync();

            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE: Repeated posts dates updated successfully---"); }

        }

       public async Task HandleScheduledPosts( )
        {

            


                //This function gonna post when the conditions are met for them to be posted
                List<Post> posts = await _db.Posts.Where(p => p.IsDeleted == false && p.IsPosted == false)
                    .Include(p => p.Pages).ThenInclude(p=>p.PageOwner)
                    .Include(p => p.UsedAssets)
                    .ThenInclude(p => p.Asset)
                    .Include(p => p.UsedAssets)
                    .ThenInclude(p => p.Thumbnail)
                    .Include(p => p.PostDynamicFields)
                    .ThenInclude(p => p.Pattern)
                    .Include(p => p.POST_Targeted_AgeRange)
                    .Include(p => p.POST_Targeted_Countries)
                    .Include(p => p.POST_Targeted_Interests)
                    .Include(p => p.POST_Targeted_Languages)
                    .Include(p => p.POST_Targeted_Regions)
                    .Include(p => p.POST_Targeted_Locations)
                    .Include(p => p.POST_Targeted_Gender)
                    .Include(p=>p.Posted_PlatformPosts)
                    
                   .ToListAsync();

                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: {x} Unposted posts found!---", posts.Count); }
                foreach (var post in posts)
                {

                    //handling posts that includes repeat
                    if (post.PostDate < DateTime.Now && post.RepeatPost == true)
                    {
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x} With repeat option is being handeled---", post.Id); }
                        //We check if the page has an endrepeat
                        if (post.EndRepeatPost == true)
                        {
                            //Check if the EndRepeatOption is AfterOccurence

                            if (post.EndRepeatOption == "EndOccOption")
                            {
                                //Handling the case when its the last Post Occurence so it gets setted to POSTED and no longer run
                                if (post.Post_Occurence == post.EndRepeatOnOccurence - 1)
                                {
                                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x} With repeat option  Reached the repeat limit, This will be the Last Occurence---", post.Id); }
                                    post.IsPosted = true;
                                }
                            }
                            if (post.EndRepeatOption == "EndDateOption")
                            {
                                //handling the case when it's the last repeat after X date
                                if (post.EndRepeatAfterDate < DateTime.Now)
                                {
                                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x} With repeat option  Reached the repeat Date limit, This will be the Last Occurence ---", post.Id); }
                                    post.IsPosted = true;
                                }

                            }
                        }

                        //Test If the Post has Any dynamicfields or not

                        if (post.PostDynamicFields.Count != 0)
                        {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x} With repeat option Includes {d} Dynamic Fields---", post.Id, post.PostDynamicFields.Count); }
                            await POST_WITH_DynamicFields(post);
                        

                            post.Post_Occurence = post.Post_Occurence + 1;
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Sending the needed emails for the Post {x} ---", post.Id); }
                        await SendEmail(post);
                        }
                        //Handling the case where the is no dynamic fields
                        else
                        {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x} With repeat option Has no Dynamic Fields---", post.Id); }
                            await POST_WITHOUT_DynamicFields(post);
                        
                        
                        post.Post_Occurence = post.Post_Occurence + 1;
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Sending the needed emails for the Post {x} ---", post.Id); }
                        await SendEmail(post);

                    }
                        await _db.SaveChangesAsync();
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x} With repeat option posted successfully---", post.Id); }
                    }
                    //Handling requests that doesn't have a repeat option
                    if (post.PostDate < DateTime.Now && post.RepeatPost == false)
                    {
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x} Without Repeat option is being handeled---", post.Id); }
                        if (post.PostDynamicFields.Count != 0)
                        {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x} Without Repeat option  Includes {d} Dynamic Fields---", post.Id, post.PostDynamicFields.Count); }
                            await POST_WITH_DynamicFields(post);
                        
                           post.Post_Occurence = post.Post_Occurence + 1;
                            post.IsPosted = true;
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Sending the needed emails for the Post {x} ---", post.Id); }
                        await SendEmail(post);
                    }
                        //Handling the case where the is no dynamic fields
                        else
                        {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x} Without Repeat option Has no Dynamic Fields---", post.Id); }
                            await POST_WITHOUT_DynamicFields(post);
                            post.Post_Occurence = post.Post_Occurence + 1;
                            post.IsPosted = true;
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Sending the needed emails for the Post {x} ---", post.Id); }
                        await SendEmail(post);

                    }
                        await _db.SaveChangesAsync();
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x} Without Repeat option Posted successfully---", post.Id); }

                    }

                }

            
            

        }


        public async Task POST_WITH_DynamicFields( Post post)
        {


            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: {b} Pages found for the Post {x} ---", post.Pages.Count(),post.Id); }
            //Iterating through every page that need to have the post posted on
            foreach (var p in post.Pages)
                {

                    //Handling the Facebook Page Case
                    if (p.PlatformID == 1)
                    {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x}, Posting for the Facebook Page {p} ---", post.Id, p.CachedData_PageName); }
                    var MsgText = post.PostText;
                        
                        //terating through every dynamic field to replace them with the proper text
                        foreach (var dyf in post.PostDynamicFields)
                        {
                            if (dyf.PlatformPage == p)
                            {
                                MsgText = MsgText.Replace(dyf.Pattern.PatternText, dyf.Value);
                            }
                        }
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Facebook Page {p}, {a} Assets Found ---", p.CachedData_PageName, post.UsedAssets.Count()); }
                   

                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE:  Configuring the Post {s} for the Facebook Page {p} ---", post.Id, p.CachedData_PageName); }
                    await Facebook_POST_FEED(p.AccessToken, MsgText, p.PlatformPageID,post);
                    }
                    //Handling the Instagram Page Case
                    if (p.PlatformID == 2)
                    {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x}, Posting for the Instagram Page {p} ---", post.Id, p.CachedData_PageName); }
                    var MsgText = post.PostText;
                        List<string> Asset_Instagram_IDs = new List<string>();
                        //terating through every dynamic field to replace them with the proper text
                        foreach (var dyf in post.PostDynamicFields)
                        {
                            if (dyf.PlatformPage == p)
                            {
                                MsgText = MsgText.Replace(dyf.Pattern.PatternText, dyf.Value);
                            }
                        }
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Instagram Page {p}, {a} Assets Found ---", p.CachedData_PageName, post.UsedAssets.Count()); }
                    if (post.UsedAssets.Count>1)
                        {
                            foreach (var asset in post.UsedAssets)
                            {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Uploading Asset {a} to Instagram Page {p} ---", asset.Id, p.CachedData_PageName); }            
                            //uploading the Pictures to the Instagram and getting the image id
                            string AssetID = await Instagram_POST_UploadPhoto(p.AccessToken, p.PlatformPageID, MsgText, asset.Asset.ResourceURL);                           
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Instagram Asset {a} Uploaded successfully  ---", asset.Id); }
                            Asset_Instagram_IDs.Add(AssetID);
                            }
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Creating Instagram Carousel for the Instagram Page {p}---", p.CachedData_PageName); }
                        string CAROUSELOBJ_ID=await Instagram_POST_UPLOAD_CAROUSEL(p.AccessToken, MsgText, p.PlatformPageID, Asset_Instagram_IDs);
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:   Instagram Carousel created successfully for the Instagram Page {p}---", p.CachedData_PageName); }
                        await Instagram_POST_FEED(p.AccessToken, MsgText, p.PlatformPageID, CAROUSELOBJ_ID,post);
                        }
                        else if(post.UsedAssets.Count ==1)
                        {

                        string AssetID = "";
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Uploading Asset {a} to Instagram Page {p} ---", post.UsedAssets.ToList()[0].Id, p.CachedData_PageName); }
                        if (post.UsedAssets.ToList()[0].Asset.AssetType == "video/mp4" || post.UsedAssets.ToList()[0].Asset.AssetType == "video/quicktime")
                        {
                            AssetID = await Instagram_POST_UploadVideo(p.AccessToken, p.PlatformPageID, MsgText, post.UsedAssets.ToList()[0].Asset.ResourceURL, post.UsedAssets.ToList()[0].Thumbnail?.ResourceURL ?? "");
                        }
                        else
                        {
                            //uploading the Pictures to the Instagram and getting the image id
                            AssetID = await Instagram_POST_UploadPhoto(p.AccessToken, p.PlatformPageID, MsgText, post.UsedAssets.ToList()[0].Asset.ResourceURL);
                        }
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Instagram Asset {a} Uploaded successfully  ---", post.UsedAssets.ToList()[0].Id); }
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE:  Configuring the Post {s} for the Instagram Page {p} ---", post.Id, p.CachedData_PageName); }
                        await Instagram_POST_FEED(p.AccessToken, MsgText, p.PlatformPageID, AssetID,post);

                    }

                      
                    }

                }
            
            
        }

        public async Task POST_WITHOUT_DynamicFields(Post post)
        {
            //Iterating through every page that need to have the post posted on


            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: {b} Pages found for the Post {x} ---", post.Pages.Count(), post.Id); }
            foreach (var p in post.Pages)
                {
                    //Handling the Facebook Page Case
                    if (p.PlatformID == 1)
                    {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x}, Posting for the Facebook Page {p} ---", post.Id, p.CachedData_PageName); }
                    var MsgText = post.PostText;
                        List<string> Asset_Facebookd_IDs = new List<string>();
                    //terating through every dynamic field to replace them with the proper text
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Facebook Page {p}, {a} Assets Found ---", p.CachedData_PageName, post.UsedAssets.Count()); }
                    
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE:  Configuring the Post {s} for the Facebook Page {p} ---", post.Id, p.CachedData_PageName); }
                    await  Facebook_POST_FEED(p.AccessToken, MsgText, p.PlatformPageID ,post);
                    }
                    //Handling the Instagram Page Case
                    if (p.PlatformID == 2)
                    {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Post {x}, Posting for the Instagram Page {p} ---", post.Id, p.CachedData_PageName); }
                    var MsgText = post.PostText;
                        List<string> Asset_Instagram_IDs = new List<string>();
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Instagram Page {p}, {a} Assets Found ---", p.CachedData_PageName, post.UsedAssets.Count()); }
                    if (post.UsedAssets.Count > 1)
                        {
                            foreach (var asset in post.UsedAssets)
                            {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Uploading Asset {a} to Instagram Page {p} ---", asset.Id, p.CachedData_PageName); }
                                //uploading the Pictures to the Facebook and getting the image id
                                string PlatformAssetID = await Instagram_POST_UploadPhoto(p.AccessToken, p.PlatformPageID, MsgText, asset.Asset.ResourceURL);
                           
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Instagram Asset {a} Uploaded successfully  ---", asset.Id); }
                            Asset_Instagram_IDs.Add(PlatformAssetID);
                            }
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Creating Instagram Carousel for the Instagram Page {p}---", p.CachedData_PageName); }
                        string CAROUSELOBJ_ID = await Instagram_POST_UPLOAD_CAROUSEL(p.AccessToken, MsgText, p.PlatformPageID, Asset_Instagram_IDs);
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:   Instagram Carousel created successfully for the Instagram Page {p}---", p.CachedData_PageName); }
                        await Instagram_POST_FEED(p.AccessToken, MsgText, p.PlatformPageID, CAROUSELOBJ_ID, post);
                        }
                        else if (post.UsedAssets.Count == 1)
                        {
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Uploading Asset {a} to Instagram Page {p} ---", post.UsedAssets.ToList()[0].Id, p.CachedData_PageName); }
                        string ImageID = await Instagram_POST_UploadPhoto(p.AccessToken, p.PlatformPageID, MsgText, post.UsedAssets.ToList()[0].Asset.ResourceURL);
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Instagram Asset {a} Uploaded successfully  ---", post.UsedAssets.ToList()[0].Id); }
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE:  Configuring the Post {s} for the Instagram Page {p} ---", post.Id, p.CachedData_PageName); }
                        await Instagram_POST_FEED(p.AccessToken, MsgText, p.PlatformPageID, ImageID, post);

                        }

                    }

                }
           
        }

        public async Task Facebook_POST_FEED(string AccessToken, string Message, Int64? PageID,Post post)
        { 
            //Here we test if the post has target option on to add the targetting options
            if (post.IsTargeted)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE FOR FACEBOOK :  Targetting Option Enabled for the Post {s}, starting target configuration..---", post.Id); }
                //we will be creating a feed for each country, each region, each location
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, TARGETTING:  {n} targetted Countries found for the post {s} ---", post.POST_Targeted_Countries.Count(), post.Id); }
                foreach (Country country in post.POST_Targeted_Countries)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, TARGETTING:  Targetting the Country {tn} ---", country.Country_Name); }
                        //This list gonna contain the country's regions
                        List<Region> CurrentCountry_regions = new List<Region>();
                        foreach (Region region in post.POST_Targeted_Regions)
                        {
                            //We test if the region we're in is a region inside the country we're in 
                            if (region.Region_CountryId == country.Id)
                            {
                                CurrentCountry_regions.Add(region);
                            }
                        }
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, TARGETTING:  {n} targetted regions found within the country {c} ---", CurrentCountry_regions.Count, country.Country_Name); }
                        //The country has regions
                        if (CurrentCountry_regions.Count>0)
                        {
                               foreach(Region CountryRegion in CurrentCountry_regions)
                                {

                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, TARGETTING:  Targetting the Region {r} within the Country {tn} ---", CountryRegion.Region_Name,country.Country_Name); }
                            List<Location> CurrentRegion_locations = new List<Location>();
                                    foreach (Location loc in post.POST_Targeted_Locations)
                                    {
                                        if (loc.Location_RegionId ==CountryRegion.Id)
                                        {
                                            CurrentRegion_locations.Add(loc);
                                        }
                                    }
                                    //locations found for this region, Post Specifically, for every location within the region
                                    if(CurrentRegion_locations.Count>0)
                                        {
                                              if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, TARGETTING:  {n} targetted location found within the region {c} for the post {s} ---", CurrentRegion_locations.Count, CountryRegion.Region_Name, post.Id); }
                                            await Facebook_POSTFEED_FOR_LOCATION(AccessToken, Message, country, CountryRegion, CurrentRegion_locations, post, PageID); 
                                        }
                                    //No locations for this region, Post Globablly based on the country
                                    if(CurrentRegion_locations.Count == 0)
                                        {
                                            await Facebook_POSTFEED_FOR_REGION(AccessToken, Message, CountryRegion, post, PageID);
                                        }                                 
                                }
                        }
                        // This Country has no regions, Post Globally based on the country
                        if(CurrentCountry_regions.Count == 0)
                        {
                            await Facebook_POSTFEED_FOR_COUNTRY(AccessToken, Message , country, post, PageID);
                        }                                      
                }
            }
            else
            {
                //Here we posting simple without any targetting
                await Facebook_POSTFEED_FOR_EVERYONE(AccessToken, Message , post, PageID);
            }
        }

        public async  Task Facebook_POSTFEED_FOR_COUNTRY(string AccessToken,string Message, Country country, Post post, Int64? PageID)
        {

            bool AssetIs_Video = false;
            List<string> Asset_Facebookd_IDs = new List<string>();

            //========= [NEW,VIDEO UPDATE] Here we test if we have assets in first place====================//
            if (post.UsedAssets.ToList().Count > 0)
            {
                //================= [NEW,VIDEO UPDATE] Case where The asset is a video===================//
                if (post.UsedAssets.ToList()[0].Asset.AssetType == "video/mp4" || post.UsedAssets.ToList()[0].Asset.AssetType == "video/quicktime")
                {
                    AssetIs_Video = true;
                }
                //=========== [NEW,VIDEO UPDATE] Case where the asset is an image==================//
                else
                {
                    foreach (var asset in post.UsedAssets)
                    {
                        string FacebookAsset = "";
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Uploading Asset {a}---", asset.Id); }
                        FacebookAsset = await Facebook_POST_UploadPhoto(AccessToken, PageID, asset.Asset.ResourceURL);

                        /* -------NOTE: TAGGING DISABLED UNTIL FRUTHER PERMISSIONS, THIS IS NOT TESTED AND COULD BREAK THINGS---------

                         * string taginfo = await Facebook_AddPhotoTags(p.AccessToken, ImageID, asset.Asset_Tags.ToList());

                         --------------END NOTE---------------------*/
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Facebook Asset {a} Uploaded successfully  ---", asset.Id); }


                        Asset_Facebookd_IDs.Add(FacebookAsset);
                    }
                }
            }

            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, * Configuring the feed that targets globally the country {c} *---", country.Country_Name) ; }
            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

            var parameters = new Dictionary<string, string>();

            //===========[NEW,VIDEO UPDATE]===Changing the attributes based on the assets Type=============//

            //=======Case Video======//
            if (AssetIs_Video)
            {
                parameters.Add("description", Message);

                parameters.Add("file_url", post.UsedAssets.ToList()[0].Asset.ResourceURL);
            }
            //==============Case Image==========//
            else
            {
                parameters.Add("message", Message);

                var mediaArray = new JArray();
                foreach (string Media_ID in Asset_Facebookd_IDs)
                {
                    var mediaObject = new JObject();
                    mediaObject.Add("media_fbid", Media_ID);
                    mediaArray.Add(mediaObject);
                }
                parameters.Add("attached_media", mediaArray.ToString(Formatting.None));
            }


            var countries = new JArray();
            countries.Add(country.Country_PlatformCode);
            var geo_locations = new JObject();
            geo_locations.Add("countries", countries);
            var targeting = new JObject();
            targeting.Add("geo_locations", geo_locations);
            parameters.Add("targeting", targeting.ToString(Formatting.None));

            //preparing the interests Array, Format: [{"id":"123"},{"key":"124"}]
            var interests = new JArray();
            foreach (Interest interest in post.POST_Targeted_Interests)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Interest {i} Applied---", interest.Interest_Name); }
                var interestObject = new JObject();
                interestObject.Add("id", interest.Interest_PlatformCode);
                interests.Add(interestObject);
            }

            parameters.Add("interests", interests.ToString(Formatting.None));
            //Add the age to the parameters if it exists
            if (post.POST_Targeted_AgeRange != null)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Age Range Config Applied RANGE: [{min}--->{max} ],", post.POST_Targeted_AgeRange.Min_age, post.POST_Targeted_AgeRange.Max_age); }
                parameters.Add("age_min", post.POST_Targeted_AgeRange.Min_age);
                parameters.Add("age_max", post.POST_Targeted_AgeRange.Max_age);
            }
            // Add the gender target parameters if it exists
            if (post.POST_Targeted_GenderId != 3)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Gender Config Applied---"); }
                parameters.Add("genders", post.POST_Targeted_GenderId.ToString());

            }
            // Add language targetting if it exists
            if (post.POST_Targeted_Languages.Count > 0)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Enabled, configuring..---"); }
                var locales = new JArray();
                foreach (Language lang in post.POST_Targeted_Languages)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Language {l} Added---", lang.Language_Name); }
                    locales.Add(lang.Language_PlatformKey);
                }
                parameters.Add("locales", locales.ToString(Formatting.None));
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Applied---"); }
            }

            var content = new FormUrlEncodedContent(parameters);



            //===========[NEW,VIDEO UPDATE]===Here we only choosing which request to use for the feed creation =============//
            System.Net.Http.HttpResponseMessage response;
            //=======Case Image feed======//
            if (!AssetIs_Video)
            {
                response = await httpClient.PostAsync(PageID.ToString() + "/feed", content);
            }
            //=======Case Video feed======//
            else
            {
                response = await httpClient.PostAsync(PageID.ToString() + "/Videos", content);
            }
            var responseContent = await response.Content.ReadAsStringAsync();
            dynamic responseObject = JsonConvert.DeserializeObject(responseContent);

            if (response.IsSuccessStatusCode)
            {
                //Getting the feed ID that uses the posted video.
                string post_id = null;
                if (AssetIs_Video)
                {
                    post_id = await Facebook_FetchVideoPOSTID(AccessToken, PageID, (string)responseObject.id);
                }
                else
                {
                    post_id = (string)responseObject.id;
                }

                await AssociatePlatformPost_To_AppPost(post_id, post,1,Message,PageID);

                //=========Test if the image includes a thumbnail that needs to be uploaded========///
                if (AssetIs_Video && post.UsedAssets.ToList()[0].Thumbnail != null)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE: Custom Thumbnail Specified, uploading the thumbnail and Updating the video.---"); }
                    await Facebook_SpecifiyThumbnail(post.UsedAssets.ToList()[0].Thumbnail.ResourceURL, (string)responseObject.id, AccessToken);
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE: Video Thumbnail Updated successfully---"); }
                }
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully for the Country {c}, The Facebook POST ID is {s} ",post.Id.ToString(), country.Country_Name, (string) responseObject.id); }
            }
            else
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation for the Country FAILED {c} ", post.Id.ToString(), country.Country_Name); }
                throw new ApplicationException("Post Failed");
            }

        }

        //==================This function associate the post to the App post========================//
        public async Task AssociatePlatformPost_To_AppPost( string Platform_PostID, Post post, Int64 PlatformID, string PostMsg,Int64? PageID)
        {


            PlatformPage Page = post.Pages.Where(p => p.PlatformPageID == PageID).FirstOrDefault();
            //Case of Facebook
            if (PlatformID==1)
            {
                PlatformPost NewPost = new PlatformPost
                {
                    App_AddDate= DateTime.Now,
                    App_DeleteDate=null,
                    App_Post=post,
                    IsAppPosted=true,
                    IsDeleted=false,
                    PlatformId=1,
                    PlatformPage= Page,
                    Platform_CreateDate= DateTime.Now,
                    PostPlatformID= Platform_PostID,
                    PostComments=new List<PlatformComment>(),
                    PostLikes=new List<PlatformLike>(),
                    PostMessage= PostMsg,
                    SharesCount=0
                };
                post.Posted_PlatformPosts.Add(NewPost);
            }
            //Case of Instagram
            else
            {
                PlatformPost NewPost = new PlatformPost
                {
                    App_AddDate = DateTime.Now,
                    App_DeleteDate = null,
                    App_Post = post,
                    IsAppPosted = true,
                    IsDeleted = false,
                    PlatformId = 2,
                    PlatformPage = Page,
                    Platform_CreateDate = DateTime.Now,
                    PostPlatformID = Platform_PostID,
                    PostComments = new List<PlatformComment>(),
                    PostLikes = new List<PlatformLike>(),
                    PostMessage = PostMsg,
                    SharesCount=0
                };
                post.Posted_PlatformPosts.Add(NewPost);
            }

        }
        public async Task Facebook_POSTFEED_FOR_EVERYONE(string AccessToken, string Message , Post post, Int64? PageID)
        {
            bool AssetIs_Video = false;
            List<string> Asset_Facebookd_IDs = new List<string>();

            //========= [NEW,VIDEO UPDATE] Here we test if we have assets in first place====================//
            if(post.UsedAssets.ToList().Count>0)
            {
                //================= [NEW,VIDEO UPDATE] Case where The asset is a video===================//
                if (post.UsedAssets.ToList()[0].Asset.AssetType == "video/mp4" || post.UsedAssets.ToList()[0].Asset.AssetType == "video/quicktime")
                {
                    AssetIs_Video = true;
                }
                //=========== [NEW,VIDEO UPDATE] Case where the asset is an image==================//
                else
                {
                    foreach (var asset in post.UsedAssets)
                    {
                        string FacebookAsset = "";
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Uploading Asset {a}---", asset.Id); }
                        FacebookAsset = await Facebook_POST_UploadPhoto(AccessToken, PageID, asset.Asset.ResourceURL);

                        /* -------NOTE: TAGGING DISABLED UNTIL FRUTHER PERMISSIONS, THIS IS NOT TESTED AND COULD BREAK THINGS---------

                         * string taginfo = await Facebook_AddPhotoTags(p.AccessToken, ImageID, asset.Asset_Tags.ToList());

                         --------------END NOTE---------------------*/
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Facebook Asset {a} Uploaded successfully  ---", asset.Id); }


                        Asset_Facebookd_IDs.Add(FacebookAsset);
                    }
                }
            }

           
            

            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, * Configuring the feed Without Any targetting *---"); }
            ///This Method creates a Facebook Feed and uses the Facebook Images ID (already uploaded images)
            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

            var parameters = new Dictionary<string, string>();


            //===========[NEW,VIDEO UPDATE]===Changing the attributes based on the assets Type=============//

             //=======Case Video======//
            if (AssetIs_Video)
            {
                parameters.Add("description", Message);

                parameters.Add("file_url", post.UsedAssets.ToList()[0].Asset.ResourceURL);
            }
            //==============Case Image==========//
            else
            {
                parameters.Add("message", Message);

                var mediaArray = new JArray();
                foreach (string Media_ID in Asset_Facebookd_IDs)
                {
                    var mediaObject = new JObject();
                    mediaObject.Add("media_fbid", Media_ID);
                    mediaArray.Add(mediaObject);
                }
                parameters.Add("attached_media", mediaArray.ToString(Formatting.None));
            }


             

            
            var content = new FormUrlEncodedContent(parameters);

            //===========[NEW,VIDEO UPDATE]===Here we only choosing which request to use for the feed creation =============//
            System.Net.Http.HttpResponseMessage response;
            //=======Case Image feed======//
            if (!AssetIs_Video)
            {
                response = await httpClient.PostAsync(PageID.ToString() + "/feed", content);
            }
            //=======Case Video feed======//
            else
            {
                response = await httpClient.PostAsync(PageID.ToString() + "/Videos", content);
            }
            
            var responseContent = await response.Content.ReadAsStringAsync();
            dynamic responseObject = JsonConvert.DeserializeObject(responseContent);

            if (response.IsSuccessStatusCode)
            {
                //Getting the feed ID that uses the posted video.
                string post_id = null;
                if(AssetIs_Video)
                {
                     post_id = await Facebook_FetchVideoPOSTID(AccessToken, PageID, (string)responseObject.id);
                }
                else
                {
                    post_id = (string)responseObject.id;
                }
               
                await AssociatePlatformPost_To_AppPost(post_id, post, 1, Message, PageID);

                //=========Test if the image includes a thumbnail that needs to be uploaded========///
                if(AssetIs_Video&& post.UsedAssets.ToList()[0].Thumbnail!=null)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE: Custom Thumbnail Specified, uploading the thumbnail and Updating the video.---"); }
                    await Facebook_SpecifiyThumbnail(post.UsedAssets.ToList()[0].Thumbnail.ResourceURL, (string)responseObject.id, AccessToken);
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE: Video Thumbnail Updated successfully---"); }
                }



                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully Without any targetting, The Facebook POST ID is {s} ", post.Id.ToString(),  (string)responseObject.id); }
            }
            else
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation Without any targetting FAILED  ", post.Id.ToString()); }
                throw new ApplicationException("Post Failed");
            }
        }


        public async Task Facebook_POSTFEED_FOR_REGION(string AccessToken, string Message, Region CountryRegion, Post post, Int64? PageID)
        {

            bool AssetIs_Video = false;
            List<string> Asset_Facebookd_IDs = new List<string>();

            //========= [NEW,VIDEO UPDATE] Here we test if we have assets in first place====================//
            if (post.UsedAssets.ToList().Count > 0)
            {
                //================= [NEW,VIDEO UPDATE] Case where The asset is a video===================//
                if (post.UsedAssets.ToList()[0].Asset.AssetType == "video/mp4" || post.UsedAssets.ToList()[0].Asset.AssetType == "video/quicktime")
                {
                    AssetIs_Video = true;
                }
                //=========== [NEW,VIDEO UPDATE] Case where the asset is an image==================//
                else
                {
                    foreach (var asset in post.UsedAssets)
                    {
                        string FacebookAsset = "";
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Uploading Asset {a}---", asset.Id); }
                        FacebookAsset = await Facebook_POST_UploadPhoto(AccessToken, PageID, asset.Asset.ResourceURL);

                        /* -------NOTE: TAGGING DISABLED UNTIL FRUTHER PERMISSIONS, THIS IS NOT TESTED AND COULD BREAK THINGS---------

                         * string taginfo = await Facebook_AddPhotoTags(p.AccessToken, ImageID, asset.Asset_Tags.ToList());

                         --------------END NOTE---------------------*/
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Facebook Asset {a} Uploaded successfully  ---", asset.Id); }


                        Asset_Facebookd_IDs.Add(FacebookAsset);
                    }
                }
            }

            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, * Configuring the feed that targets globally a Region {c} *---", CountryRegion.Region_Name); }
            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

            var parameters = new Dictionary<string, string>();

            //===========[NEW,VIDEO UPDATE]===Changing the attributes based on the assets Type=============//

            //=======Case Video======//
            if (AssetIs_Video)
            {
                parameters.Add("description", Message);

                parameters.Add("file_url", post.UsedAssets.ToList()[0].Asset.ResourceURL);
            }
            //==============Case Image==========//
            else
            {
                parameters.Add("message", Message);

                var mediaArray = new JArray();
                foreach (string Media_ID in Asset_Facebookd_IDs)
                {
                    var mediaObject = new JObject();
                    mediaObject.Add("media_fbid", Media_ID);
                    mediaArray.Add(mediaObject);
                }
                parameters.Add("attached_media", mediaArray.ToString(Formatting.None));
            }

            var regions = new JArray();
            var region = new JObject();
            region.Add("key", CountryRegion.Region_PlatformCode);
            regions.Add(region);
            var geo_locations = new JObject();
            // geo_locations.Add("countries", countries);   --LOCATION OVERLAP BUG FIX---
            geo_locations.Add("regions", regions);
            var targeting = new JObject();
            targeting.Add("geo_locations", geo_locations);
            parameters.Add("targeting", targeting.ToString(Formatting.None));
            //preparing the interests Array, Format: [{"id":"123"},{"key":"124"}]
            var interests = new JArray();
            foreach (Interest interest in post.POST_Targeted_Interests)
            {

                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Interest {i} Applied---", interest.Interest_Name); }
                var interestObject = new JObject();
                interestObject.Add("id", interest.Interest_PlatformCode);
                interests.Add(interestObject);
            }

            parameters.Add("interests", interests.ToString(Formatting.None));
            //Add the age to the parameters if it exists
            if (post.POST_Targeted_AgeRange != null)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Age Range Config Applied RANGE: [{min}--->{max} ],", post.POST_Targeted_AgeRange.Min_age, post.POST_Targeted_AgeRange.Max_age); }
                parameters.Add("age_min", post.POST_Targeted_AgeRange.Min_age);
                parameters.Add("age_max", post.POST_Targeted_AgeRange.Max_age);
            }
            // Add the gender target parameters if it exists
            if (post.POST_Targeted_GenderId != 3)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Gender Config Applied---"); }
                parameters.Add("genders", post.POST_Targeted_GenderId.ToString());

            }
            // Add language targetting if it exists
            if (post.POST_Targeted_Languages.Count > 0)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Enabled, configuring..---"); }
                var locales = new JArray();
                foreach (Language lang in post.POST_Targeted_Languages)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Language {l} Added---", lang.Language_Name); }
                    locales.Add(lang.Language_PlatformKey);
                }
                parameters.Add("locales", locales.ToString(Formatting.None));
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Applied---"); }
            }

            var content = new FormUrlEncodedContent(parameters);

            //===========[NEW,VIDEO UPDATE]===Here we only choosing which request to use for the feed creation =============//
            System.Net.Http.HttpResponseMessage response;
            //=======Case Image feed======//
            if (!AssetIs_Video)
            {
                response = await httpClient.PostAsync(PageID.ToString() + "/feed", content);
            }
            //=======Case Video feed======//
            else
            {
                response = await httpClient.PostAsync(PageID.ToString() + "/Videos", content);
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            dynamic responseObject = JsonConvert.DeserializeObject(responseContent);

            if (response.IsSuccessStatusCode)
            {
                //Getting the feed ID that uses the posted video.
                string post_id = null;
                if (AssetIs_Video)
                {
                    post_id = await Facebook_FetchVideoPOSTID(AccessToken, PageID, (string)responseObject.id);
                }
                else
                {
                    post_id = (string)responseObject.id;
                }
                await AssociatePlatformPost_To_AppPost(post_id, post, 1, Message, PageID);

                //=========Test if the image includes a thumbnail that needs to be uploaded========///
                if (AssetIs_Video && post.UsedAssets.ToList()[0].Thumbnail != null)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE: Custom Thumbnail Specified, uploading the thumbnail and Updating the video.---"); }
                    await Facebook_SpecifiyThumbnail(post.UsedAssets.ToList()[0].Thumbnail.ResourceURL, (string)responseObject.id, AccessToken);
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE: Video Thumbnail Updated successfully---"); }
                }

                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully for the Region {c}, The Facebook POST ID is {s} ", post.Id.ToString(), CountryRegion.Region_Name, (string)responseObject.id); }

            }
            else
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation for the Region FAILED {c} ", post.Id.ToString(), CountryRegion.Region_Name); }
                throw new ApplicationException("Post Failed");
            }


        }


        public async Task Facebook_POSTFEED_FOR_LOCATION(string AccessToken, string Message, Country country, Region CountryRegion,List<Location> CurrentRegion_locations, Post post, Int64? PageID)
        {
            bool AssetIs_Video = false;
            List<string> Asset_Facebookd_IDs = new List<string>();

            //========= [NEW,VIDEO UPDATE] Here we test if we have assets in first place====================//
            if (post.UsedAssets.ToList().Count > 0)
            {
                //================= [NEW,VIDEO UPDATE] Case where The asset is a video===================//
                if (post.UsedAssets.ToList()[0].Asset.AssetType == "video/mp4" || post.UsedAssets.ToList()[0].Asset.AssetType == "video/quicktime")
                {
                    AssetIs_Video = true;
                }
                //=========== [NEW,VIDEO UPDATE] Case where the asset is an image==================//
                else
                {
                    foreach (var asset in post.UsedAssets)
                    {
                        string FacebookAsset = "";
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE: Uploading Asset {a}---", asset.Id); }
                        FacebookAsset = await Facebook_POST_UploadPhoto(AccessToken, PageID, asset.Asset.ResourceURL);

                        /* -------NOTE: TAGGING DISABLED UNTIL FRUTHER PERMISSIONS, THIS IS NOT TESTED AND COULD BREAK THINGS---------

                         * string taginfo = await Facebook_AddPhotoTags(p.AccessToken, ImageID, asset.Asset_Tags.ToList());

                         --------------END NOTE---------------------*/
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE:  Facebook Asset {a} Uploaded successfully  ---", asset.Id); }


                        Asset_Facebookd_IDs.Add(FacebookAsset);
                    }
                }
            }

            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, * Configuring the feed that targets a specific locations within a region {c} within the country {s} *---", CountryRegion.Region_Name, country.Country_Name); }

            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

            var parameters = new Dictionary<string, string>();

            //===========[NEW,VIDEO UPDATE]===Changing the attributes based on the assets Type=============//

            //=======Case Video======//
            if (AssetIs_Video)
            {
                parameters.Add("description", Message);

                parameters.Add("file_url", post.UsedAssets.ToList()[0].Asset.ResourceURL);
            }
            //==============Case Image==========//
            else
            {
                parameters.Add("message", Message);

                var mediaArray = new JArray();
                foreach (string Media_ID in Asset_Facebookd_IDs)
                {
                    var mediaObject = new JObject();
                    mediaObject.Add("media_fbid", Media_ID);
                    mediaArray.Add(mediaObject);
                }
                parameters.Add("attached_media", mediaArray.ToString(Formatting.None));
            }

            //----------------------Targeting parameters-----------------------//

            //created a country array and only inserted one country, so I specify that the regions below are this country's
            //preparing the Country array Format: ["TN"] ONLY ONE because for each Country, we need a different feed, this will be done by the foreach loop
            var countries = new JArray();
            countries.Add(country.Country_PlatformCode);
            //created a regions array and then added one region to it with the corresponading key to specifiy that the locations below are specific to this region only
            //preparing the region array Format: [{"key":"123"}] ONLY ONE because for each region, we need a different feed, this will be done by the foreach loop
            var regions = new JArray();
            var region = new JObject();
            region.Add("key", CountryRegion.Region_PlatformCode);
            regions.Add(region);
            //Added the List of locations specific to the region above
            //preparing the cities array Format: [{"key":"123"},{"key":"124"}]
            var cities = new JArray();
            foreach (Location l in CurrentRegion_locations)
            {
                var location = new JObject();
                location.Add("key", l.Location_PlatformCode);
                cities.Add(location);
            }
            var geo_locations = new JObject();
            geo_locations.Add("countries", countries);
            geo_locations.Add("regions", regions);
            geo_locations.Add("cities", cities);
            var targeting = new JObject();
            targeting.Add("geo_locations", geo_locations);
            parameters.Add("targeting", targeting.ToString(Formatting.None));

            //preparing the interests Array, Format: [{"id":"123"},{"key":"124"}]
            var interests = new JArray();
            foreach (Interest interest in post.POST_Targeted_Interests)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Interest {i} Applied---", interest.Interest_Name); }
                var interestObject = new JObject();
                interestObject.Add("id", interest.Interest_PlatformCode);
                interests.Add(interestObject);
            }

            parameters.Add("interests", interests.ToString(Formatting.None));
            //Add the age to the parameters if it exists
            if (post.POST_Targeted_AgeRange != null)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Age Range Config Applied RANGE: [{min}--->{max} ],", post.POST_Targeted_AgeRange.Min_age, post.POST_Targeted_AgeRange.Max_age); }
                parameters.Add("age_min", post.POST_Targeted_AgeRange.Min_age);
                parameters.Add("age_max", post.POST_Targeted_AgeRange.Max_age);
            }
            // Add the gender target parameters if it exists
            if (post.POST_Targeted_GenderId != 3)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Gender Config Applied---"); }
                parameters.Add("genders", post.POST_Targeted_GenderId.ToString());

            }
            // Add language targetting if it exists
            if (post.POST_Targeted_Languages.Count > 0)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Enabled, configuring..---"); }
                var locales = new JArray();
                foreach (Language lang in post.POST_Targeted_Languages)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Language {l} Added---", lang.Language_Name); }
                    locales.Add(lang.Language_PlatformKey);
                }
                parameters.Add("locales", locales.ToString(Formatting.None));
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Applied---"); }
            }



            var content = new FormUrlEncodedContent(parameters);

            //===========[NEW,VIDEO UPDATE]===Here we only choosing which request to use for the feed creation =============//
            System.Net.Http.HttpResponseMessage response;
            //=======Case Image feed======//
            if (!AssetIs_Video)
            {
                response = await httpClient.PostAsync(PageID.ToString() + "/feed", content);
            }
            //=======Case Video feed======//
            else
            {
                response = await httpClient.PostAsync(PageID.ToString() + "/Videos", content);
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            dynamic responseObject = JsonConvert.DeserializeObject(responseContent);

            if (response.IsSuccessStatusCode)
            {
                //Getting the feed ID that uses the posted video.
                string post_id = null;
                if (AssetIs_Video)
                {
                    post_id = await Facebook_FetchVideoPOSTID(AccessToken, PageID, (string)responseObject.id);
                }
                else
                {
                    post_id = (string)responseObject.id;
                }
                await AssociatePlatformPost_To_AppPost(post_id, post, 1, Message, PageID);

                //=========Test if the image includes a thumbnail that needs to be uploaded========///
                if (AssetIs_Video && post.UsedAssets.ToList()[0].Thumbnail != null)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE: Custom Thumbnail Specified, uploading the thumbnail and Updating the video.---"); }
                    await Facebook_SpecifiyThumbnail(post.UsedAssets.ToList()[0].Thumbnail.ResourceURL, (string)responseObject.id, AccessToken);
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POST UPDATE SUBSERVICE: Video Thumbnail Updated successfully---"); }
                }

                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully for the specified locations within the region {c}, The Facebook POST ID is {s} ", post.Id.ToString(), CountryRegion.Region_Name, (string)responseObject.id); }

            }
            else
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation for the specified locations within the region {r} FAILED  ", post.Id.ToString(), CountryRegion.Region_Name); }
                throw new ApplicationException("Post Failed");
            }



        }


        public async Task<string> Instagram_POST_UPLOAD_CAROUSEL(string AccessToken, string Message, Int64? PageID, List<string> IG_Pic_IDs)
        {

            //This Method Take a list of IG Uploaded Images Ids and then create a container and put them in it and returns the Container ID
            //IMPORTANT: CAROUSEL CAN TAKE A MAX OF 10 PICS, Rule inforced by Facebook  
                var httpClient = new HttpClient();
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

                var parameters = new Dictionary<string, string>();
                parameters.Add("caption", Message);
                parameters.Add("media_type", "CAROUSEL");

                var mediaArray = new JArray();
                foreach (string IG_Pic_ID in IG_Pic_IDs)
                { 
                    mediaArray.Add(IG_Pic_ID);
                }

                parameters.Add("children", mediaArray.ToString(Formatting.None));

                var content = new FormUrlEncodedContent(parameters);
                var response = await httpClient.PostAsync(PageID.ToString() + "/media", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
            if (response.IsSuccessStatusCode)
                {
                    return responseObject.id;
                }
            else
            {
                if (responseObject.error.error_subcode == "2207051")
                {
                    throw new too_Many_ING_UploadRequests();
                }
                throw new Exception($"Failed to upload photo. Status code: {response.StatusCode}");
            }

        }

        public async Task Instagram_POST_FEED(string AccessToken, string Message, Int64? PageID, string IG_Item_ID,Post post)
        {
            // The Pos has target options, we start configuration here
            if (post.IsTargeted)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE FOR INSTAGRAM :  Targetting Option Enabled for the Post {s}, starting target configuration..---", post.Id); }
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, TARGETTING:  {n} targetted Countries found for the post {s} ---", post.POST_Targeted_Countries.Count(), post.Id); }
                foreach (Country country in post.POST_Targeted_Countries)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, TARGETTING:  Targetting the Country {tn} ---", country.Country_Name); }
                    //We calculate how many regions this country has and put them in CurrentCountry_regions variable
                    List<Region> CurrentCountry_regions = new List<Region>();
                        foreach (Region region in post.POST_Targeted_Regions)
                        {
                            //We test if the region we're in is a region inside the country we're in 
                            if (region.Region_CountryId == country.Id)
                            {
                                CurrentCountry_regions.Add(region);
                            }
                        }
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, TARGETTING:  {n} targetted regions found within the country {c} ---", CurrentCountry_regions.Count, country.Country_Name); }
                    //The country has regions, the post should be specific for certain regions
                    if (CurrentCountry_regions.Count > 0)
                        {                            
                                foreach (Region CountryRegion in CurrentCountry_regions)
                                {
                                   if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, TARGETTING:  Targetting the Region {r} within the Country {tn} ---", CountryRegion.Region_Name, country.Country_Name); }

                            //We calculate how many locations this region has and put them in CurrentRegion_locations variable
                            List<Location> CurrentRegion_locations = new List<Location>();
                                    foreach (Location loc in post.POST_Targeted_Locations)
                                    {
                                        if (loc.Location_RegionId == CountryRegion.Id)
                                        {
                                            CurrentRegion_locations.Add(loc);
                                        }
                                    }
                                    //This region within this country has some locations, so the targetting for this region is even more specific
                                    if(CurrentRegion_locations.Count>0)
                                    {
                                          if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, TARGETTING:  {n} targetted location found within the region {c} for the post {s} ---", CurrentRegion_locations.Count, CountryRegion.Region_Name, post.Id); }
                                     await   Instagram_POSTFEED_FOR_LOCATION(AccessToken, IG_Item_ID, country, CountryRegion, CurrentRegion_locations, post, PageID);

                                    }
                                    // The region within this country has no locations, so it's only limited to that region
                                    else
                                    {
                                        await Instagram_POSTFEED_FOR_REGION(AccessToken, IG_Item_ID, country, CountryRegion, post, PageID);
                                    }
                                } 

                        }
                        //This country has no regions, so the post should be global for that country
                        else
                        {
                        await Instagram_POSTFEED_FOR_COUNTRY(AccessToken, IG_Item_ID, country, post, PageID);
                        }
                }
            }
            // Post doesn't require any filter and target configuration, we post it normally
            else
            {
                await Instagram_POSTFEED_FOR_EVERYONE(AccessToken, IG_Item_ID, PageID, post);
            }
        }


        public async Task Instagram_POSTFEED_FOR_EVERYONE(string AccessToken, string IG_Item_ID, Int64? PageID, Post post)
        {


            //This method takes a container ID which can be either a Carousal with multiple images or a single image and simply create an IG post
            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, * Configuring the feed Without Any targetting *---"); }
            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
            var parameters = new Dictionary<string, string>();
            parameters.Add("creation_id", IG_Item_ID);
            var content = new FormUrlEncodedContent(parameters);
            var response = await httpClient.PostAsync(PageID.ToString() + "/media_publish", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
            if (response.IsSuccessStatusCode)
            {

                await AssociatePlatformPost_To_AppPost((string)responseObject.id, post, 2, "Caption_defaultValue", PageID);
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully Without any targetting, The INSTAGRAM POST ID is {s} ", post.Id.ToString(), (string)responseObject.id); }
            }
            else
            {
                //==============Here we  handling the case if Instagram is still processing the media=============//
                if(responseObject.error.code=="9007"&& responseObject.error.error_subcode=="2207027")
                {
                    bool FeedUploaded = false;
                    int AttemptCount = 0;
                    while(!FeedUploaded&& AttemptCount< Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_RetryLimit"]))
                    {
                        

                        //===================NOTE:Here we retrying with the Publish Request=======================//
                        var httpClient_Retry = new HttpClient();
                        httpClient_Retry.BaseAddress = new Uri("https://graph.facebook.com/v16.0/");
                        httpClient_Retry.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                        var parameters_Retry = new Dictionary<string, string>();
                        parameters_Retry.Add("creation_id", IG_Item_ID);
                        var content_Retry = new FormUrlEncodedContent(parameters);
                        var response_Retry = await httpClient_Retry.PostAsync(PageID.ToString() + "/media_publish", content_Retry);
                        var responseContent_Retry = await response_Retry.Content.ReadAsStringAsync();
                        dynamic responseObject_Retry = JsonConvert.DeserializeObject(responseContent_Retry);
                        AttemptCount++;
                        if (response_Retry.IsSuccessStatusCode)
                        {
                            FeedUploaded = true;
                            await AssociatePlatformPost_To_AppPost((string)responseObject_Retry.id, post, 2, "Caption_defaultValue", PageID);
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully Without any targetting, The INSTAGRAM POST ID is {s} ", post.Id.ToString(), (string)responseObject_Retry.id); }
                        }
                        //====END NOTE===========/
                        if (!FeedUploaded)
                        {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE, WAITING..., Instagram is still Processing the Video, Waiting for {x} before attempting to post again.", TimeSpan.FromSeconds(Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_Retry_WaitTime"]))); }
                            await Task.Delay(TimeSpan.FromSeconds(Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_Retry_WaitTime"])));

                        }
                    }
                    if(AttemptCount== Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_RetryLimit"]))
                    {
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation Without any targetting FAILED, Try limit exceeded  ", post.Id.ToString()); }
                    }
                }
                //==============Here we  handling the case if it's an error=============//
                else
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation Without any targetting FAILED  ", post.Id.ToString()); }
                    if (responseObject.error.error_subcode == "2207051")
                    {
                        throw new too_Many_ING_UploadRequests();
                    }
                }
                
              
            }


        
               
}


        public async Task Instagram_POSTFEED_FOR_COUNTRY(string AccessToken, string IG_Item_ID, Country country, Post post, Int64? PageID)
        {
            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, * Configuring the feed that targets globally the country {c} *---", country.Country_Name); }
            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
            var parameters = new Dictionary<string, string>();
            parameters.Add("creation_id", IG_Item_ID);
            //----------------------Targeting parameters-----------------------//

            //created a country array and only inserted one country, so I specify that the regions below are this country's
            //preparing the Country array Format: ["TN"] ONLY ONE because for each Country, we need a different feed, this will be done by the foreach loop
            var countries = new JArray();
            countries.Add(country.Country_PlatformCode);

            //Added the List of locations specific to the region above
            //preparing the cities array Format: [{"key":"123"},{"key":"124"}]

            var geo_locations = new JObject();
            geo_locations.Add("countries", countries);
            var targeting = new JObject();
            targeting.Add("geo_locations", geo_locations);
            parameters.Add("targeting", targeting.ToString(Formatting.None));

            //preparing the interests Array, Format: [{"id":"123"},{"key":"124"}]
            var interests = new JArray();
            foreach (Interest interest in post.POST_Targeted_Interests)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Interest {i} Applied---", interest.Interest_Name); }
                var interestObject = new JObject();
                interestObject.Add("id", interest.Interest_PlatformCode);
                interests.Add(interestObject);
            }

            parameters.Add("interests", interests.ToString(Formatting.None));
            //Add the age to the parameters if it exists
            if (post.POST_Targeted_AgeRange != null)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Age Range Config Applied RANGE: [{min}--->{max} ],", post.POST_Targeted_AgeRange.Min_age, post.POST_Targeted_AgeRange.Max_age); }
                parameters.Add("age_min", post.POST_Targeted_AgeRange.Min_age);
                parameters.Add("age_max", post.POST_Targeted_AgeRange.Max_age);
            }
            // Add the gender target parameters if it exists
            if (post.POST_Targeted_GenderId != 3)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Gender Config Applied---"); }
                parameters.Add("genders", post.POST_Targeted_GenderId.ToString());

            }
            // Add language targetting if it exists
            if (post.POST_Targeted_Languages.Count > 0)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Enabled, configuring..---"); }
                var locales = new JArray();
                foreach (Language lang in post.POST_Targeted_Languages)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Language {l} Added---", lang.Language_Name); }
                    locales.Add(lang.Language_PlatformKey);
                }
                parameters.Add("locales", locales.ToString(Formatting.None));
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Applied---"); }
            }

            var content = new FormUrlEncodedContent(parameters);
            var response = await httpClient.PostAsync(PageID.ToString() + "/media_publish", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            dynamic responseObject = JsonConvert.DeserializeObject(responseContent);


            if (response.IsSuccessStatusCode)
            {
                await AssociatePlatformPost_To_AppPost((string)responseObject.id, post, 2, "Caption_defaultValue", PageID);
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully for the Country {c}, The INSTAGRAM POST ID is {s} ", post.Id.ToString(), country.Country_Name, (string)responseObject.id); }

            }
            else
            {
                //==============Here we  handling the case if Instagram is still processing the media=============//
                if (responseObject.error.code == "9007" && responseObject.error.error_subcode == "2207027")
                {
                    bool FeedUploaded = false;
                    int AttemptCount = 0;
                    while (!FeedUploaded && AttemptCount < Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_RetryLimit"]))
                    {
                       
                        //===================NOTE:Here we retrying with the Publish Request=======================//
                        var httpClient_Retry = new HttpClient();
                        httpClient_Retry.BaseAddress = new Uri("https://graph.facebook.com/v16.0/");
                        httpClient_Retry.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                        var parameters_Retry = new Dictionary<string, string>();
                        parameters_Retry.Add("creation_id", IG_Item_ID);
                        var content_Retry = new FormUrlEncodedContent(parameters);
                        var response_Retry = await httpClient_Retry.PostAsync(PageID.ToString() + "/media_publish", content_Retry);
                        var responseContent_Retry = await response_Retry.Content.ReadAsStringAsync();
                        dynamic responseObject_Retry = JsonConvert.DeserializeObject(responseContent_Retry);
                        AttemptCount++;
                        if (response_Retry.IsSuccessStatusCode)
                        {
                            FeedUploaded = true;
                            await AssociatePlatformPost_To_AppPost((string)responseObject_Retry.id, post, 2, "Caption_defaultValue", PageID);
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully for the Country {c}, The INSTAGRAM POST ID is {s} ", post.Id.ToString(), country.Country_Name, (string)responseObject_Retry.id); }
                        }
                        //====END NOTE===========/
                        if (!FeedUploaded)
                        {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE, WAITING..., Instagram is still Processing the Video, Waiting for {x} before attempting to post again.", TimeSpan.FromSeconds(Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_Retry_WaitTime"]))); }
                            await Task.Delay(TimeSpan.FromSeconds(Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_Retry_WaitTime"])));

                        }
                    }
                    if (AttemptCount == Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_RetryLimit"]))
                    {
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation Without any targetting FAILED, Try limit exceeded  ", post.Id.ToString()); }
                    }
                }
                //==============Here we  handling the case if it's an error=============//
                else
                {


                    if (responseObject.error.error_subcode == "2207051")
                    {
                        throw new too_Many_ING_UploadRequests();
                    }
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation for the Country FAILED {c} ", post.Id.ToString(), country.Country_Name); }
                    throw new ApplicationException("Post Failed");
                }
            }

        }


        public async Task Instagram_POSTFEED_FOR_REGION(string AccessToken, string IG_Item_ID, Country country, Region CountryRegion, Post post, Int64? PageID)
        {

            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, * Configuring the feed that targets globally a Region {c} *---", CountryRegion.Region_Name); }
            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
            var parameters = new Dictionary<string, string>();
            parameters.Add("creation_id", IG_Item_ID);
            var regions = new JArray();
            var region = new JObject();
            region.Add("key", CountryRegion.Region_PlatformCode);
            regions.Add(region);
            //Added the List of locations specific to the region above
            //preparing the cities array Format: [{"key":"123"},{"key":"124"}]

            var geo_locations = new JObject();
            // geo_locations.Add("countries", countries);   --LOCATION OVERLAP BUG FIX---
            geo_locations.Add("regions", regions);
            var targeting = new JObject();
            targeting.Add("geo_locations", geo_locations);
            parameters.Add("targeting", targeting.ToString(Formatting.None));

            //preparing the interests Array, Format: [{"id":"123"},{"key":"124"}]
            var interests = new JArray();
            foreach (Interest interest in post.POST_Targeted_Interests)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Interest {i} Applied---", interest.Interest_Name); }
                var interestObject = new JObject();
                interestObject.Add("id", interest.Interest_PlatformCode);
                interests.Add(interestObject);
            }

            parameters.Add("interests", interests.ToString(Formatting.None));
            //Add the age to the parameters if it exists
            if (post.POST_Targeted_AgeRange != null)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Age Range Config Applied RANGE: [{min}--->{max} ],", post.POST_Targeted_AgeRange.Min_age, post.POST_Targeted_AgeRange.Max_age); }
                parameters.Add("age_min", post.POST_Targeted_AgeRange.Min_age);
                parameters.Add("age_max", post.POST_Targeted_AgeRange.Max_age);
            }
            // Add the gender target parameters if it exists
            if (post.POST_Targeted_GenderId != 3)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Gender Config Applied---"); }
                parameters.Add("genders", post.POST_Targeted_GenderId.ToString());

            }
            // Add language targetting if it exists
            if (post.POST_Targeted_Languages.Count > 0)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Enabled, configuring..---"); }
                var locales = new JArray();
                foreach (Language lang in post.POST_Targeted_Languages)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Language {l} Added---", lang.Language_Name); }
                    locales.Add(lang.Language_PlatformKey);
                }
                parameters.Add("locales", locales.ToString(Formatting.None));
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Applied---"); }
            }
            var content = new FormUrlEncodedContent(parameters);
            var response = await httpClient.PostAsync(PageID.ToString() + "/media_publish", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            dynamic responseObject = JsonConvert.DeserializeObject(responseContent);


            if (response.IsSuccessStatusCode)
            {
                await AssociatePlatformPost_To_AppPost((string)responseObject.id, post, 2, "Caption_defaultValue", PageID);
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully for the Region {c}, The INSTAGRAM POST ID is {s} ", post.Id.ToString(), CountryRegion.Region_Name, (string)responseObject.id); }

            }
            else
            {
                //==============Here we  handling the case if Instagram is still processing the media=============//
                if (responseObject.error.code == "9007" && responseObject.error.error_subcode == "2207027")
                {
                    bool FeedUploaded = false;
                    int AttemptCount = 0;
                    while (!FeedUploaded && AttemptCount < Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_RetryLimit"]))
                    {
                        

                        //===================NOTE:Here we retrying with the Publish Request=======================//
                        var httpClient_Retry = new HttpClient();
                        httpClient_Retry.BaseAddress = new Uri("https://graph.facebook.com/v16.0/");
                        httpClient_Retry.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                        var parameters_Retry = new Dictionary<string, string>();
                        parameters_Retry.Add("creation_id", IG_Item_ID);
                        var content_Retry = new FormUrlEncodedContent(parameters);
                        var response_Retry = await httpClient_Retry.PostAsync(PageID.ToString() + "/media_publish", content_Retry);
                        var responseContent_Retry = await response_Retry.Content.ReadAsStringAsync();
                        dynamic responseObject_Retry = JsonConvert.DeserializeObject(responseContent_Retry);
                        AttemptCount++;
                        if (response_Retry.IsSuccessStatusCode)
                        {
                            FeedUploaded = true;
                            await AssociatePlatformPost_To_AppPost((string)responseObject_Retry.id, post, 2, "Caption_defaultValue", PageID);
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully for the Region {c}, The INSTAGRAM POST ID is {s} ", post.Id.ToString(), CountryRegion.Region_Name, (string)responseObject_Retry.id); }
                        }
                        //====END NOTE===========/
                        if (!FeedUploaded)
                        {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE, WAITING..., Instagram is still Processing the Video, Waiting for {x} before attempting to post again.", TimeSpan.FromSeconds(Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_Retry_WaitTime"]))); }
                            await Task.Delay(TimeSpan.FromSeconds(Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_Retry_WaitTime"])));

                        }
                    }
                    if (AttemptCount == Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_RetryLimit"]))
                    {
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation Without any targetting FAILED, Try limit exceeded  ", post.Id.ToString()); }
                    }
                }
                //==============Here we  handling the case if it's an error=============//
                else
                {
                    if (responseObject.error.error_subcode == "2207051")
                    {
                        throw new too_Many_ING_UploadRequests();
                    }
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation for the Region FAILED {c} ", post.Id.ToString(), CountryRegion.Region_Name); }
                    throw new ApplicationException("Post Failed");
                }
            }


        }

        public async Task Instagram_POSTFEED_FOR_LOCATION(string AccessToken, string IG_Item_ID, Country country, Region CountryRegion, List<Location> CurrentRegion_locations, Post post, Int64? PageID)
        {

            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, * Configuring the feed that targets a specific locations within a region {c} within the country {s} *---", CountryRegion.Region_Name, country.Country_Name); }
            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
            var parameters = new Dictionary<string, string>();
            parameters.Add("creation_id", IG_Item_ID);

            //----------------------Targeting parameters-----------------------//

            //created a country array and only inserted one country, so I specify that the regions below are this country's
            //preparing the Country array Format: ["TN"] ONLY ONE because for each Country, we need a different feed, this will be done by the foreach loop
            var countries = new JArray();
            countries.Add(country.Country_PlatformCode);
            //created a regions array and then added one region to it with the corresponading key to specifiy that the locations below are specific to this region only
            //preparing the region array Format: [{"key":"123"}] ONLY ONE because for each region, we need a different feed, this will be done by the foreach loop
            var regions = new JArray();
            var region = new JObject();
            region.Add("key", CountryRegion.Region_PlatformCode);
            regions.Add(region);
            //Added the List of locations specific to the region above
            //preparing the cities array Format: [{"key":"123"},{"key":"124"}]
            var cities = new JArray();
            foreach (Location l in CurrentRegion_locations)
            {
                var location = new JObject();
                location.Add("key", l.Location_PlatformCode);
                cities.Add(location);
            }
            var geo_locations = new JObject();
            geo_locations.Add("countries", countries);
            geo_locations.Add("regions", regions);
            geo_locations.Add("cities", cities);
            var targeting = new JObject();
            targeting.Add("geo_locations", geo_locations);
            parameters.Add("targeting", targeting.ToString(Formatting.None));

            //preparing the interests Array, Format: [{"id":"123"},{"key":"124"}]
            var interests = new JArray();
            foreach (Interest interest in post.POST_Targeted_Interests)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Interest {i} Applied---", interest.Interest_Name); }
                var interestObject = new JObject();
                interestObject.Add("id", interest.Interest_PlatformCode);
                interests.Add(interestObject);
            }

            parameters.Add("interests", interests.ToString(Formatting.None));
            //Add the age to the parameters if it exists
            if (post.POST_Targeted_AgeRange != null)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Age Range Config Applied RANGE: [{min}--->{max} ],", post.POST_Targeted_AgeRange.Min_age, post.POST_Targeted_AgeRange.Max_age); }
                parameters.Add("age_min", post.POST_Targeted_AgeRange.Min_age);
                parameters.Add("age_max", post.POST_Targeted_AgeRange.Max_age);
            }
            // Add the gender target parameters if it exists
            if (post.POST_Targeted_GenderId != 3)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Gender Config Applied---"); }
                parameters.Add("genders", post.POST_Targeted_GenderId.ToString());

            }
            // Add language targetting if it exists
            if (post.POST_Targeted_Languages.Count > 0)
            {
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Enabled, configuring..---"); }
                var locales = new JArray();
                foreach (Language lang in post.POST_Targeted_Languages)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE, Language {l} Added---", lang.Language_Name); }
                    locales.Add(lang.Language_PlatformKey);
                }
                parameters.Add("locales", locales.ToString(Formatting.None));
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER CONFIG SUBSERVICE,  Filtered Language Config Applied---"); }
            }
            var content = new FormUrlEncodedContent(parameters);
            var response = await httpClient.PostAsync(PageID.ToString() + "/media_publish", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            dynamic responseObject = JsonConvert.DeserializeObject(responseContent);


            if (response.IsSuccessStatusCode)
            {
                await AssociatePlatformPost_To_AppPost((string)responseObject.id, post, 2, "Caption_defaultValue", PageID);
                if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully for the specified locations within the region {c}, The INSTAGRAM POST ID is {s} ", post.Id.ToString(), CountryRegion.Region_Name, (string)responseObject.id); }

            }
            else
            {
                //==============Here we  handling the case if Instagram is still processing the media=============//
                if (responseObject.error.code == "9007" && responseObject.error.error_subcode == "2207027")
                {
                    bool FeedUploaded = false;
                    int AttemptCount = 0;
                    while (!FeedUploaded && AttemptCount < Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_RetryLimit"]))
                    {
                       
                        //===================NOTE:Here we retrying with the Publish Request=======================//
                        var httpClient_Retry = new HttpClient();
                        httpClient_Retry.BaseAddress = new Uri("https://graph.facebook.com/v16.0/");
                        httpClient_Retry.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);
                        var parameters_Retry = new Dictionary<string, string>();
                        parameters_Retry.Add("creation_id", IG_Item_ID);
                        var content_Retry = new FormUrlEncodedContent(parameters);
                        var response_Retry = await httpClient_Retry.PostAsync(PageID.ToString() + "/media_publish", content_Retry);
                        var responseContent_Retry = await response_Retry.Content.ReadAsStringAsync();
                        dynamic responseObject_Retry = JsonConvert.DeserializeObject(responseContent_Retry);
                        AttemptCount++;
                        if (response_Retry.IsSuccessStatusCode)
                        {
                            FeedUploaded = true;
                            await AssociatePlatformPost_To_AppPost((string)responseObject_Retry.id, post, 2, "Caption_defaultValue", PageID);
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} Created successfully for the specified locations within the region {c}, The INSTAGRAM POST ID is {s} ", post.Id.ToString(), CountryRegion.Region_Name, (string)responseObject_Retry.id); }
                        }
                        //====END NOTE===========/

                        if (!FeedUploaded)
                        {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE, WAITING..., Instagram is still Processing the Video, Waiting for {x} before attempting to post again.", TimeSpan.FromSeconds(Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_Retry_WaitTime"]))); }
                            await Task.Delay(TimeSpan.FromSeconds(Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_Retry_WaitTime"])));

                        }
                    }
                    if (AttemptCount == Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_RetryLimit"]))
                    {
                        if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation Without any targetting FAILED, Try limit exceeded  ", post.Id.ToString()); }
                    }
                }
                //==============Here we  handling the case if it's an error=============//
                else
                {


                    if (responseObject.error.error_subcode == "2207051")
                    {
                        throw new too_Many_ING_UploadRequests();
                    }
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Post {x} creation for the specified locations within the region {r} FAILED  ", post.Id.ToString(), CountryRegion.Region_Name); }
                    throw new ApplicationException("Post Failed");
                }
            }

        }









        //-----------------------------This Method is not Yet in USE As IT REQUIRE MORE PERMISSIONS + REQURIRES MORE TESTING ------------------------------------//
        public async Task<string> Facebook_AddPhotoTags(string accessToken, string? ImageId, List<Tag> Tags)
        {

            //This method Add Tags to an uploaded Facebook Image
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var parameters = new Dictionary<string, string>();
                var ListOfTags = new JArray();
                foreach (Tag tag in Tags)
                {
                    var Temp_tag = new JObject();
                    Temp_tag.Add("to", tag.TaggedPlatformAccount_ID);
                    Temp_tag.Add("x", tag.TaggedImage_X);
                    Temp_tag.Add("y", tag.TaggedImage_Y);
                    ListOfTags.Add(Temp_tag);
                }
                parameters.Add("tags", ListOfTags.ToString(Formatting.None));
                var content = new FormUrlEncodedContent(parameters);
                var response = await httpClient.PostAsync($"{ImageId}/photos", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode)
                {
                    return responseObject.id;
                }
                else
                {
                    if (responseObject.error.error_subcode == "2207051")
                    {
                        throw new too_Many_ING_UploadRequests();
                    }
                    throw new Exception($"Failed to upload photo. Status code: {response.StatusCode}");
                }
            }
        }
        //====================This function uploads a photo for Facebook =======================//
            public async Task<string> Facebook_POST_UploadPhoto(string accessToken, long? pageId, string mediaUrl)
        {
            
            //This method uploads a picture to Facebook and gets an useable Facebook Image ID
                using (var httpClient = new HttpClient())
                {
                    httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    var parameters = new Dictionary<string, string>();
                    parameters.Add("no_story", "true");
                    parameters.Add("url", mediaUrl);
                    parameters.Add("caption", "Caption for photo 1");
                    parameters.Add("description", "Description for photo 1");
                    parameters.Add("published", "false");
                    var content = new FormUrlEncodedContent(parameters);
                    var response = await httpClient.PostAsync($"{pageId}/photos", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode)
                    {
                    

                        return responseObject.id;
                    }
                else
                {
                    if (responseObject.error.error_subcode == "2207051")
                    {
                        throw new too_Many_ING_UploadRequests();
                    }
                    throw new Exception($"Failed to upload photo. Status code: {response.StatusCode}");
                }
            }
           

            
        }

        //====================This function uploads a Video for Facebook =======================//
        public async Task<string> Facebook_POST_UploadVideo(string accessToken, long? pageId, string mediaUrl, string ThumbnailURL)
        {

            //This method uploads a picture to Facebook and gets an useable Facebook Image ID
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var parameters = new Dictionary<string, string>();
                parameters.Add("no_story", "true");
                parameters.Add("file_url", mediaUrl);
               
                var content = new FormUrlEncodedContent(parameters);
                var response = await httpClient.PostAsync($"{pageId}/videos", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode)
                {


                    return responseObject.id;
                }
                else
                {
                    if (responseObject.error.error_subcode == "2207051")
                    {
                        throw new too_Many_ING_UploadRequests();
                    }
                    throw new Exception($"Failed to upload Video. Status code: {response.StatusCode}");
                }
            }



        }

        //====================This function Gets the VIDEO POSTS ID using their video ID =======================//
        public async Task<string> Facebook_FetchVideoPOSTID(string accessToken, long? pageId, string VideoID)
        {
            string VideoPermURL = "";
            int AttemptCount = 0;
            bool FeedIsPosted = false;
            string feedID = "";
            //Here we will be getting the video's perm url
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await httpClient.GetAsync($"{VideoID}?fields=permalink_url");
                var responseContent = await response.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode)
                {
                    VideoPermURL = responseObject.permalink_url;

                }
                else
                {
                    throw new Exception($"Failed to get the video's permlink url: {response.Content}");
                }
                while(AttemptCount< Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_RetryLimit"])&& !FeedIsPosted)
                {
                    AttemptCount++;
                    var response2 = await httpClient.GetAsync(pageId + "/feed?fields=attachments{url}");
                    var responseContent2 = await response2.Content.ReadAsStringAsync();
                    dynamic responseObject2 = JsonConvert.DeserializeObject(responseContent2);
                    if (response2.IsSuccessStatusCode)
                    {
                        foreach (var feed in responseObject2.data)
                        {
                            if (feed.attachments != null)
                            {
                                if (feed.attachments.data[0].url == "https://www.facebook.com" + VideoPermURL)
                                {
                                    feedID= feed.id;
                                    FeedIsPosted = true;
                                    break;
                                }
                            }

                        }
                        
                        if(!FeedIsPosted)
                        {
                            if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE, WAITING..., Facebook is still Processing the Video, Waiting for {x} before attempting to post again.", TimeSpan.FromSeconds(Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_Retry_WaitTime"]))); }
                            await Task.Delay(TimeSpan.FromSeconds(Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_Retry_WaitTime"])));

                        }

                    }
                    else
                    {
                        throw new Exception($"Failed to get the video's feed id: {response.Content}");
                    }
                }

                if (AttemptCount == Int32.Parse(Configuration.GetSection("ServiceConfig")["Video_Publish_RetryLimit"]))
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] POSTER SUBSERVICE,  Failed to Associate the feed ID to our system., Try limit exceeded  "); }
                    throw new Exception($"Failed to find the video's feed id: {response.Content}");
                }

                return feedID;

            }



        }

        //============================This function is responsible for updating a video's thumbnail========================//
        public static async Task Facebook_SpecifiyThumbnail(string imageUrl, string videoFacebookId, string accessToken)
        {
            try
            {
                //==================Downloading the Image from Firebase and creating a file object=================//
                StreamContent fileContent;
                using (var httpClient = new HttpClient())
                {

                    // Downloading the Image from Firebase
                    var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);

                    // Create a file object from the image data
                    var file = new MemoryStream(imageBytes);
                    fileContent = new StreamContent(file);
                    fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
                    {
                        Name = "source",
                        FileName = "thumbnail.jpg" // Set the desired file name
                    };
                }

                //=====================Specifiying the file object and specifiying that it's the image's thumbnail==================//
                using (var httpClient = new HttpClient())
                {
                    httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    var parameters = new Dictionary<string, string>
                {
                    { "is_preferred", "true" }
                };

                    var multipartContent = new MultipartFormDataContent();
                    multipartContent.Add(fileContent);

                    // Add any additional parameters to the multipart content
                    foreach (var parameter in parameters)
                    {
                        multipartContent.Add(new StringContent(parameter.Value), parameter.Key);
                    }

                    var response = await httpClient.PostAsync($"{videoFacebookId}/thumbnails", multipartContent);
                    var responseContent = await response.Content.ReadAsStringAsync();
                    dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                    if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception($"Failed to update Video thumbnail. Status code: {response.StatusCode}");
                    }
                    
                }
            }
            catch (Exception ex)
            {
                // Handle any errors that occurred during the process
                throw new Exception($"Thumbnail image download failed. Exception: {ex.Message}");
            }
        }
    









        //==============This function uploads a photo for Instagram================//
        public async Task<string> Instagram_POST_UploadPhoto(string accessToken, long? pageId, string msg, string mediaUrl)
        {
           
            //This method uploads the images to the instagram and then gets the Instagram useable Image ID
                using (var httpClient = new HttpClient())
                {
                    httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    var parameters = new Dictionary<string, string>();
                    parameters.Add("image_url", mediaUrl);
                    parameters.Add("caption", msg);

                    var content = new FormUrlEncodedContent(parameters);
                    var response = await httpClient.PostAsync($"{pageId}/media", content);
                    var responseContent = await response.Content.ReadAsStringAsync();
                    dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                    if (response.IsSuccessStatusCode)
                    {
                        return responseObject.id;
                    }
                    else
                    {
                        if(responseObject.error.error_subcode== "2207051")
                        {
                            throw new too_Many_ING_UploadRequests();
                        }
                        throw new Exception($"Failed to upload photo. Status code: {response.StatusCode}");
                    }
                }
            }


        //==============This function uploads a VIdeo for Instagram================/
        public async Task<string> Instagram_POST_UploadVideo(string accessToken, long? pageId, string msg, string mediaUrl, string ThumbnailURL)
        {

            //This method uploads the Video to the instagram and then gets the Instagram useable Video ID
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var parameters = new Dictionary<string, string>();
                parameters.Add("video_url", mediaUrl);
                parameters.Add("caption", msg);
                if(ThumbnailURL!="")
                {
                    parameters.Add("cover_url", ThumbnailURL);
                }
                
                parameters.Add("media_type", "REELS");
                var content = new FormUrlEncodedContent(parameters);
                var response = await httpClient.PostAsync($"{pageId}/media", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode)
                {
                    return responseObject.id;
                }
                else
                {
                    if (responseObject.error.error_subcode == "2207051")
                    {
                        throw new too_Many_ING_UploadRequests();
                    }
                    throw new Exception($"Failed to upload Video. Status code: {response.StatusCode}");
                }
            }
        }


        public async Task SendEmail(Post post)
        {

            // NOTE: THESE ARE NOT THE SAME AS THE ONES USED IN THE BACKENED BECAUSE EMAILJS HAS A LIMIT OF 2 TEMPLATES SO I USED 2 ACCS
            string serviceId = Configuration.GetSection("EmailJSConstants")["serviceId"];
            string templateId = Configuration.GetSection("EmailJSConstants")["templateId"];
            string userId = Configuration.GetSection("EmailJSConstants")["userId"];
            string accessToken = Configuration.GetSection("EmailJSConstants")["accessToken"];
            string emailJSUrl = Configuration.GetSection("EmailJSConstants")["emailJSUrl"];
            var httpClient = new HttpClient();

            
            List<PlatformAccount> Distinct_Owner_Accounts = new List<PlatformAccount>();
            foreach ( var page in post.Pages)
            {
                if(!Distinct_Owner_Accounts.Contains(page.PageOwner))
                {
                    Distinct_Owner_Accounts.Add(page.PageOwner);
                }
            }
            
            //Creating an email for every owner
            foreach( var owner in Distinct_Owner_Accounts)
            {

                string Owner_Pages = "";

                foreach (var  page in post.Pages)
                {
                    if(page.PageOwnerID==owner.Id)
                    {
                        Owner_Pages += "  ," + page.CachedData_PageName;
                    }
                }
                var parameters = new
                {
                    email = owner.CachedData_Email,
                    pages = Owner_Pages,
                    publishdate = DateTime.Now.ToString()
                };

                var emailJSData = new
                {
                    service_id = serviceId,
                    template_id = templateId,
                    user_id = userId,
                    template_params = parameters,
                    accessToken = accessToken
                };

                var response = await httpClient.PostAsJsonAsync(emailJSUrl, emailJSData);

                if (response.IsSuccessStatusCode)
                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Email was sent successfully for {u} ",owner.CachedData_Name); }

                }
                else

                {
                    if (bool.Parse(Configuration.GetSection("ServiceConfig")["CustomDetailedLogging"])) { _logger.LogInformation("----[SP] Email was sent failed for {u} ", owner.CachedData_Name); }
                    throw new ArgumentException("EmailUnvalid");

                }

            }
            

           






        }




    }
}