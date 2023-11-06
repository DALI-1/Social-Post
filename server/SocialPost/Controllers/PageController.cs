
using Facebook;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using SocialPostBackEnd.Data;
using SocialPostBackEnd.DTO;
using SocialPostBackEnd.Exceptions;
using SocialPostBackEnd.Models;
using SocialPostBackEnd.Responses;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Newtonsoft.Json;
using System.Text;
using System.Text.Json;



namespace SocialPostBackEnd.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PageController : Controller
    {
        private readonly ApplicationDbContext _db;
        public IConfiguration Configuration { get; }
        public PageController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }

        [HttpPost("AddFacebookPage")]
        public async Task<ActionResult<string>> AddFacebookPage(AddFacebookPageDTO request)
        {

           //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
            var RequestUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();

            var Group = await _db.Groups.Where(g => g.Id == (Int64)Convert.ToInt64(request.GroupID) && g.IsDeleted == false)
                .Include(g => g.PlatformPages)
                .FirstOrDefaultAsync();

            var FacebookUser = await _db.PlatformAccounts.Where(fbu => fbu.PlatformAccountID == request.OwnerFBid).FirstOrDefaultAsync();
            var FacebookPlatform = await _db.Platforms.Where(p => p.PlatformName == "Facebook").FirstOrDefaultAsync();
            var InstagramPlatform = await _db.Platforms.Where(p => p.PlatformName == "Instagram").FirstOrDefaultAsync();
            //If the user doesn't exist already we create a new one otherwise we use the old user retrieved from the DB
            if (FacebookUser == null)
            {

                var UserLongLivedAccess_Token = await GetLongLivedTokenAsync(request.OwnerFB_shortLivedToken);
                var UserInfoJsonResult = await GetUserInfo(UserLongLivedAccess_Token, request.OwnerFBid);
                JObject UserJsonObject = JObject.Parse(UserInfoJsonResult.Value.ToString());

                FacebookUser = new PlatformAccount
                {

                    PlatformAccountID = request.OwnerFBid,
                    AccessToken = UserLongLivedAccess_Token,
                    AccessTokenExpireDate = DateTime.Now.AddDays(59),
                    Platform = FacebookPlatform,
                    AddDate = DateTime.Now,
                    AddUser = RequestUser,
                    IsDeleted = false,
                    CachedData_First_name = UserJsonObject["first_name"].ToString(),
                    CachedData_Last_name = UserJsonObject["last_name"].ToString(),
                    CachedData_Name = UserJsonObject["name"].ToString(),
                    CachedData_Email = UserJsonObject["email"].ToString(),
                    CachedData_PictureURL = UserJsonObject["picture"]["data"]["url"].ToString(),
                    CachedData_IsChanged = false,
                    CachedData_LastUpdateDate=DateTime.Now,
                    CachedData_PictureHeight= UserJsonObject["picture"]["data"]["height"].ToString(),
                    CachedData_PictureWidth= UserJsonObject["picture"]["data"]["width"].ToString(),
                    CachedData_PictureIs_silhouette=(bool)UserJsonObject["picture"]["data"]["is_silhouette"],
                     Is_Tagable = true,
                    Is_AddedBySearchService = false,
                    Is_Mentionable=true

                };




            }

            if(Group!=null)
            {


                if (request.ListOfPages.Count != 0)
                {


                    //Adding the pages one by one
                    foreach (var page in request.ListOfPages)
                    {

                        //this flag indicates to the page if it should add the associated page to it or not
                        bool AssociatedPageExist = false;
                        var NewAssociatedPage = new PlatformPage();
                        //Creating the associated Instagram page if it exists
                        //Null means this page is not associated to anything
                        if (page.AssociatedPageID != "null")
                        {
                            //Setting the flag, associated page found
                            AssociatedPageExist = true;

                            //Searching if the associated Page already exist in our DB
                            var AssociatePageInDB = await _db.PlatformPages.Where(fbu => fbu.PlatformPageID == (Int64)Convert.ToInt64(page.AssociatedPageID) &&fbu.IsDeleted==false && fbu.GroupId == (Int64)Convert.ToInt64(request.GroupID)).FirstOrDefaultAsync();

                            //If it already exist in the DB, we simply assign it to the New AssociatedPage otherwise we create a new one
                            if (AssociatePageInDB != null)
                            {
                                NewAssociatedPage = AssociatePageInDB;
                            }
                            else
                            {
                                string PageShortLifeAccessToken = await GetPageShortLifeAccessToken(FacebookUser.AccessToken, page.AssociatedPageID, InstagramPlatform.Id);

                                var PageLongLivedAccess_Token = await GetLongLivedTokenAsync(PageShortLifeAccessToken);
                                var PageInfoJsonResult = await GetPageInfo(PageLongLivedAccess_Token, page.AssociatedPageID, InstagramPlatform.Id);
                                JObject PageJsonObject = JObject.Parse(PageInfoJsonResult.Value.ToString());
                                NewAssociatedPage = new PlatformPage
                                {
                                    PlatformPageID = (Int64)Convert.ToInt64(page.AssociatedPageID),
                                    Group = Group,
                                    PageOwner = FacebookUser,
                                    AccessToken = await GetLongLivedTokenAsync(PageShortLifeAccessToken),
                                    AccessTokenExpireDate = FacebookUser.AccessTokenExpireDate,
                                    Platform = InstagramPlatform,
                                    AddDate = DateTime.Now,
                                    AddUser = RequestUser,
                                    IsDeleted = false,
                                    CachedData_PageName = PageJsonObject["name"]?.ToString() ?? PageJsonObject["username"]?.ToString() ?? "No Username Or Name Found",
                                    CachedData_About = "No About Specified",
                                    CachedData_Bio = PageJsonObject["biography"]?.ToString() ?? "No Bio Specified",
                                    CachedData_Category = PageJsonObject["category"]?.ToString() ?? "No Category Specified",
                                    CachedData_Description = "No Description Specified",
                                    CachedData_fan_count = PageJsonObject["business_discovery"]["follows_count"]?.ToString() ?? "No Count specified", 
                                    CachedData_followers_count = PageJsonObject["business_discovery"]["followers_count"]?.ToString() ?? "No Followers specified",
                                    CachedData_LastUpdateDate = DateTime.Now,
                                    CachedData_Location = "No Location Specified",
                                    CachedData_PhoneNumber = "No Number Specified",
                                    CachedData_PictureHeight = "50",
                                    CachedData_PictureIs_silhouette = false,
                                    CachedData_PictureURL = PageJsonObject["profile_picture_url"]?.ToString() ?? "https://via.placeholder.com/50x50",
                                    CachedData_PictureWidth = "50",
                                    CachedData_WebsiteURL = PageJsonObject["business_discovery"]["website"]?.ToString() ?? "No Website specifeid",
                                    CachedData_IsChanged = false


                                }; 
                                }
                           

                        }
                        //Creating the new page based on the associatedPageExist flag, if this flag is true, then our FB page is associated to an INSTA Page
                        if (AssociatedPageExist == true)
                        {
                            //We search here if the page we want to add exist or not, if it exists we throw an exception
                            var NewPageSearched = await _db.PlatformPages.Where(fbu => fbu.PlatformPageID == (Int64)Convert.ToInt64(page.PageID) && fbu.IsDeleted == false && fbu.GroupId == Group.Id).FirstOrDefaultAsync();

                            if (NewPageSearched != null)
                            {
                                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P002", Result = "Selected_Page_Exist" });
                            }           
                            string PageShortLifeAccessToken = await GetPageShortLifeAccessToken(FacebookUser.AccessToken, page.PageID, FacebookPlatform.Id);

                            var PageLongLivedAccess_Token = await GetLongLivedTokenAsync(PageShortLifeAccessToken);
                            var PageInfoJsonResult = await GetPageInfo(PageLongLivedAccess_Token, page.PageID, FacebookPlatform.Id);
                            JObject PageJsonObject = JObject.Parse(PageInfoJsonResult.Value.ToString());
                            //---------------Here we test if the page has any location info specified----------------//
                            bool locationInfoExist = false;
                            if (PageJsonObject["location"] != null)
                            {
                                locationInfoExist = true;
                            }

                            var City = "";
                            var Street = "";
                            var Zip = "";
                            var Country = "";
                            if (locationInfoExist)
                            {
                                City = PageJsonObject["location"]["city"]?.ToString() ?? "";
                                Street = PageJsonObject["location"]["street"]?.ToString() ?? "";
                                Zip = PageJsonObject["location"]["zip"]?.ToString() ?? "";
                                Country = PageJsonObject["location"]["country"]?.ToString() ?? "";
                            }
                            var Location_Detailed = Country + " " + City + " " + Street + " " + Zip;
                            ///------------------Location Test ends here-----------------------------///
                            var NewPage = new PlatformPage
                            {
                            PlatformPageID = (Int64)Convert.ToInt64(page.PageID),
                                Group = Group,
                                PageOwner = FacebookUser,
                                AccessToken = PageLongLivedAccess_Token,
                                AccessTokenExpireDate = FacebookUser.AccessTokenExpireDate,
                                Platform = FacebookPlatform,
                                AssociatedPlatformPages = new List<PlatformPage>(),
                                AddDate = DateTime.Now,
                                AddUser = RequestUser,
                                IsDeleted = false,
                                CachedData_PageName = PageJsonObject["name"]?.ToString() ?? "No name Specified",
                                CachedData_About = PageJsonObject["about"]?.ToString() ?? "No About Specified",
                                CachedData_Bio = PageJsonObject["bio"]?.ToString() ?? "No Bio Specified",
                                CachedData_Category = PageJsonObject["category"]?.ToString() ?? "No Category Specified",
                                CachedData_Description = PageJsonObject["description"]?.ToString() ?? "No Description Specified",
                                CachedData_fan_count = PageJsonObject["fan_count"]?.ToString(),
                                CachedData_followers_count = PageJsonObject["followers_count"]?.ToString(),
                                CachedData_LastUpdateDate = DateTime.Now,
                                CachedData_Location = Location_Detailed?? "No Location Specified",
                                CachedData_PhoneNumber = PageJsonObject["phone"]?.ToString() ?? "No Number Specified",
                                CachedData_PictureHeight = PageJsonObject["picture"]["data"]["height"]?.ToString()??"No height specified",
                                CachedData_PictureIs_silhouette = (bool)PageJsonObject["picture"]["data"]["is_silhouette"],
                                CachedData_PictureURL = PageJsonObject["picture"]["data"]["url"]?.ToString()?? "https://via.placeholder.com/50x50",
                                CachedData_PictureWidth = PageJsonObject["picture"]["data"]["width"]?.ToString()??"No width specified",
                                CachedData_WebsiteURL = PageJsonObject["website"]?.ToString() ?? "No website specified",
                                CachedData_IsChanged = false

                                 

                            };
                            //Connecting the INSTA page to the FB Page
                            NewPage.AssociatedPlatformPages.Add(NewAssociatedPage);



                            _db.PlatformPages.Add(NewPage);
                           



                        }
                        else
                        {
                            //We search here if the page we want to add exist or not, if it exists we throw an exception
                            var NewPageSearched = await _db.PlatformPages.Where(fbu => fbu.PlatformPageID == (Int64)Convert.ToInt64(page.PageID) && fbu.IsDeleted == false && fbu.GroupId==(Int64)Convert.ToInt64(request.GroupID)).FirstOrDefaultAsync();

                            if (NewPageSearched != null)
                            {
                                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P002", Result = "Selected_Page_Exist" });
                            }
                            string PageShortLifeAccessToken = await GetPageShortLifeAccessToken(FacebookUser.AccessToken, page.PageID,FacebookPlatform.Id);

                            var PageLongLivedAccess_Token = await GetLongLivedTokenAsync(PageShortLifeAccessToken);
                            var PageInfoJsonResult = await GetPageInfo(PageLongLivedAccess_Token,page.PageID,FacebookPlatform.Id);
                            JObject PageJsonObject = JObject.Parse(PageInfoJsonResult.Value.ToString());

                            //---------------Here we test if the page has any location info specified----------------//
                            bool locationInfoExist = false;
                            if (PageJsonObject["location"]!=null)
                            {
                                locationInfoExist = true;
                            }

                            var City = "";
                            var Street = "";
                            var Zip = "";
                            var Country = "";
                            if(locationInfoExist)
                            {
                                City = PageJsonObject["location"]["city"]?.ToString() ?? "";
                                Street = PageJsonObject["location"]["street"]?.ToString() ?? "";
                                Zip = PageJsonObject["location"]["zip"]?.ToString() ?? "";
                                Country = PageJsonObject["location"]["country"]?.ToString() ?? "";
                            }
                            var Location_Detailed = Country + " " + City + " " + Street + " " + Zip;
                            ///------------------Location Test ends here-----------------------------///

                            var NewPage = new PlatformPage
                            {
                                PlatformPageID = (Int64)Convert.ToInt64(page.PageID),
                                Group = Group,
                                PageOwner = FacebookUser,
                                AccessToken = PageLongLivedAccess_Token,
                                AccessTokenExpireDate = FacebookUser.AccessTokenExpireDate,
                                Platform = FacebookPlatform,
                                AssociatedPlatformPages = new List<PlatformPage>(),
                                AddDate = DateTime.Now,
                                AddUser = RequestUser,
                                IsDeleted = false,
                                CachedData_PageName = PageJsonObject["name"]?.ToString(),
                                CachedData_About = PageJsonObject["about"]?.ToString() ?? "No About Specified",
                                CachedData_Bio = PageJsonObject["bio"]?.ToString() ?? "No Bio Specified",
                                CachedData_Category = PageJsonObject["category"]?.ToString() ?? "No Category Specified",
                                CachedData_Description = PageJsonObject["description"]?.ToString() ?? "No Description Specified",
                                CachedData_fan_count = PageJsonObject["fan_count"]?.ToString(),
                                CachedData_followers_count = PageJsonObject["followers_count"]?.ToString(),
                                CachedData_LastUpdateDate = DateTime.Now,
                                CachedData_Location = Location_Detailed??"No Location specified",
                                CachedData_PhoneNumber = PageJsonObject["phone"]?.ToString() ?? "No Number Specified",
                                CachedData_PictureHeight = PageJsonObject["picture"]["data"]["height"]?.ToString()??"No Height Specified",
                                CachedData_PictureIs_silhouette = (bool)PageJsonObject["picture"]["data"]["is_silhouette"],
                                CachedData_PictureURL = PageJsonObject["picture"]["data"]["url"]?.ToString()?? "https://via.placeholder.com/50x50",
                                CachedData_PictureWidth = PageJsonObject["picture"]["data"]["width"]?.ToString()??"No width specified",
                                CachedData_WebsiteURL = PageJsonObject["website"]?.ToString() ?? "No website Specified",
                                CachedData_IsChanged = false

                            };
                            _db.PlatformPages.Add(NewPage);
                            
                        }

                       




                    }
                    _db.SaveChanges();
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "FCBK_Pages_Added", Result = "FCB_Pages Added Successfully" });
                }
                else
                {
                    //Here is the treatmeent if we didn't select any Pages to add
                    return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P002", Result = "No_Page_Selected" });
                }

                
                
            }
            else
            {
                //Here is the Group doesn't exist  error handler
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P001", Result = "Group_is_invalid" });
            }
            







        }






        [HttpPost("AddInstagramPage")]
        public async Task<ActionResult<string>> AddInstagramPage(AddInstagramPageDTO request)
        {

            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
            var RequestUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();
            var Group = await _db.Groups.Where(g => g.Id == (Int64)Convert.ToInt64(request.GroupID) && g.IsDeleted == false)
                .Include(g => g.PlatformPages)
                .FirstOrDefaultAsync();

            var FacebookUser = await _db.PlatformAccounts.Where(fbu => fbu.PlatformAccountID == request.OwnerFBid).FirstOrDefaultAsync();
            var FacebookPlatform = await _db.Platforms.Where(p => p.PlatformName == "Facebook").FirstOrDefaultAsync();
            var InstagramPlatform = await _db.Platforms.Where(p => p.PlatformName == "Instagram").FirstOrDefaultAsync();
            //If the user doesn't exist already we create a new one otherwise we use the old user retrieved from the DB
            if (FacebookUser == null)
            {

                var UserLongLivedAccess_Token = await GetLongLivedTokenAsync(request.OwnerFB_shortLivedToken);
                var UserInfoJsonResult = await GetUserInfo(UserLongLivedAccess_Token, request.OwnerFBid);
                JObject UserJsonObject = JObject.Parse(UserInfoJsonResult.Value.ToString());
                FacebookUser = new PlatformAccount
                {

                    PlatformAccountID = request.OwnerFBid,
                    AccessToken = UserLongLivedAccess_Token,
                    AccessTokenExpireDate = DateTime.Now.AddDays(59),
                    Platform = FacebookPlatform,
                    AddDate = DateTime.Now,
                    AddUser = RequestUser,
                    IsDeleted = false,
                    CachedData_First_name = UserJsonObject["first_name"].ToString(),
                    CachedData_Last_name = UserJsonObject["last_name"].ToString(),
                    CachedData_Name = UserJsonObject["name"].ToString(),
                    CachedData_Email = UserJsonObject["email"].ToString(),
                    CachedData_PictureURL = UserJsonObject["picture"]["data"]["url"].ToString(),
                    CachedData_IsChanged = false,
                    CachedData_LastUpdateDate = DateTime.Now,
                    CachedData_PictureHeight = UserJsonObject["picture"]["data"]["height"].ToString(),
                    CachedData_PictureWidth = UserJsonObject["picture"]["data"]["width"].ToString(),
                    CachedData_PictureIs_silhouette = (bool)UserJsonObject["picture"]["data"]["is_silhouette"],
                    Is_Tagable= true,
                    Is_AddedBySearchService = false,
                    Is_Mentionable=true


                };
               

            }

            if (Group != null)
            {


                if (request.ListOfPages.Count != 0)
                {


                    //Adding the pages one by one
                    foreach (var page in request.ListOfPages)
                    {

                        //this flag indicates to the page if it should add the associated page to it or not
                        bool AssociatedPageExist = false;
                        var NewAssociatedPage = new PlatformPage();
                        //Creating the associated Instagram page if it exists
                        //Null means this page is not associated to anything
                        if (page.AssociatedPageID != "null")
                        {
                            //Searching if the associated Page already exist in our DB
                            var AssociatePageInDB= await _db.PlatformPages.Where(fbu => fbu.PlatformPageID== (Int64)Convert.ToInt64(page.AssociatedPageID)&&fbu.IsDeleted==false && fbu.GroupId == (Int64)Convert.ToInt64(request.GroupID)).FirstOrDefaultAsync();

                            //If it already exist in the DB, we simply assign it to the New AssociatedPage otherwise we create a new one
                            if (AssociatePageInDB != null)
                            {
                                NewAssociatedPage = AssociatePageInDB;
                            }
                            else
                            {
                               
                                string PageShortLifeAccessToken = await GetPageShortLifeAccessToken(FacebookUser.AccessToken, page.AssociatedPageID, FacebookPlatform.Id);
                                var PageLongLivedAccess_Token = await GetLongLivedTokenAsync(PageShortLifeAccessToken);
                                var PageInfoJsonResult = await GetPageInfo(PageLongLivedAccess_Token, page.AssociatedPageID, FacebookPlatform.Id);
                                JObject PageJsonObject = JObject.Parse(PageInfoJsonResult.Value.ToString());
                                //Setting the flag, associated page found
                                AssociatedPageExist = true;
                                //---------------Here we test if the page has any location info specified----------------//
                                bool locationInfoExist = false;
                                if (PageJsonObject["location"] != null)
                                {
                                    locationInfoExist = true;
                                }

                                var City = "";
                                var Street = "";
                                var Zip = "";
                                var Country = "";
                                if (locationInfoExist)
                                {
                                    City = PageJsonObject["location"]["city"]?.ToString() ?? "";
                                    Street = PageJsonObject["location"]["street"]?.ToString() ?? "";
                                    Zip = PageJsonObject["location"]["zip"]?.ToString() ?? "";
                                    Country = PageJsonObject["location"]["country"]?.ToString() ?? "";
                                }
                                var Location_Detailed = Country + " " + City + " " + Street + " " + Zip;
                                ///------------------Location Test ends here-----------------------------///
                                NewAssociatedPage = new PlatformPage
                                {
                                    PlatformPageID = (Int64)Convert.ToInt64(page.AssociatedPageID),
                                    Group = Group,
                                    PageOwner = FacebookUser,
                                    AccessToken = await GetLongLivedTokenAsync(PageShortLifeAccessToken),
                                    AccessTokenExpireDate = FacebookUser.AccessTokenExpireDate,
                                    Platform = FacebookPlatform,
                                    AddDate = DateTime.Now,
                                    AddUser = RequestUser,
                                    IsDeleted = false,
                                    CachedData_PageName = PageJsonObject["name"]?.ToString(),
                                    CachedData_About = PageJsonObject["about"]?.ToString() ?? "No About Specified",
                                    CachedData_Bio = PageJsonObject["bio"]?.ToString() ?? "No Bio Specified",
                                    CachedData_Category = PageJsonObject["category"]?.ToString() ?? "No Category Specified",
                                    CachedData_Description = PageJsonObject["description"]?.ToString() ?? "No Description Specified",
                                    CachedData_fan_count = PageJsonObject["fan_count"]?.ToString(),
                                    CachedData_followers_count = PageJsonObject["followers_count"]?.ToString(),
                                    CachedData_LastUpdateDate = DateTime.Now,
                                    CachedData_Location = Location_Detailed,
                                    CachedData_PhoneNumber = PageJsonObject["phone"]?.ToString() ?? "No Number Specified",
                                    CachedData_PictureHeight = PageJsonObject["picture"]["data"]["height"]?.ToString()??"No Height specified",
                                    CachedData_PictureIs_silhouette = (bool)PageJsonObject["picture"]["data"]["is_silhouette"],
                                    CachedData_PictureURL = PageJsonObject["picture"]["data"]["url"]?.ToString()?? "https://via.placeholder.com/50x50",
                                    CachedData_PictureWidth = PageJsonObject["picture"]["data"]["width"]?.ToString()??"No Width specified",
                                    CachedData_WebsiteURL = PageJsonObject["website"]?.ToString() ?? "No website Specified",
                                    CachedData_IsChanged = false

                                };
                            }
                          

                        }
                        //Creating the new page based on the associatedPageExist flag
                        if (AssociatedPageExist == true)
                        {
                            //We search here if the page we want to add exist or not, if it exists we throw an exception
                            var NewPageSearched = await _db.PlatformPages.Where(fbu => fbu.PlatformPageID == (Int64)Convert.ToInt64(page.PageID) && fbu.IsDeleted==false && fbu.GroupId == (Int64)Convert.ToInt64(request.GroupID)).FirstOrDefaultAsync();

                            if(NewPageSearched!=null)
                            {
                                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P002", Result = "Selected_Page_Exist" });
                            }
                            string PageShortLifeAccessToken = await GetPageShortLifeAccessToken(FacebookUser.AccessToken, page.PageID, InstagramPlatform.Id);
                            var PageLongLivedAccess_Token = await GetLongLivedTokenAsync(PageShortLifeAccessToken);
                            var PageInfoJsonResult = await GetPageInfo(PageLongLivedAccess_Token, page.PageID, InstagramPlatform.Id);
                            JObject PageJsonObject = JObject.Parse(PageInfoJsonResult.Value.ToString());
                            var NewPage = new PlatformPage
                            {
                                PlatformPageID = (Int64) Convert.ToInt64(page.PageID),
                                Group = Group,
                                PageOwner = FacebookUser,
                                AccessToken = PageLongLivedAccess_Token,
                                AccessTokenExpireDate = FacebookUser.AccessTokenExpireDate,
                                Platform = InstagramPlatform,
                                AssociatedPlatformPages = new List<PlatformPage>(),
                                AddDate = DateTime.Now,
                                AddUser = RequestUser,
                                IsDeleted = false,
                                CachedData_PageName = PageJsonObject["name"]?.ToString() ?? PageJsonObject["username"]?.ToString() ?? "No Username Or Name Found",
                                CachedData_About = "No About specified",
                                CachedData_Bio = PageJsonObject["biography"]?.ToString() ?? "No Bio Specified",
                                CachedData_Category = PageJsonObject["category"]?.ToString() ?? "No Category Specified",
                                CachedData_Description = "No Description Specified",
                                CachedData_fan_count = PageJsonObject["business_discovery"]["follows_count"]?.ToString() ?? "No Count specified",
                                CachedData_followers_count = PageJsonObject["business_discovery"]["followers_count"]?.ToString() ?? "No Followers count specified",
                                CachedData_LastUpdateDate = DateTime.Now,
                                CachedData_Location = "No Location specified",
                                CachedData_PhoneNumber = "No Number specified",
                                CachedData_PictureHeight = "50",
                                CachedData_PictureIs_silhouette = false,
                                CachedData_PictureURL = PageJsonObject["profile_picture_url"]?.ToString() ?? "https://via.placeholder.com/50x50",
                                CachedData_PictureWidth = "50",
                                CachedData_WebsiteURL = PageJsonObject["business_discovery"]["website"]?.ToString() ?? "No Website Found",
                                CachedData_IsChanged = false
                            };

                           
                           
                            //Connecting the INSTA page to the FB Page
                            NewPage.AssociatedPlatformPages.Add(NewAssociatedPage);



                            _db.PlatformPages.Add(NewPage);
                            



                        }
                        else
                        {
                            //We search here if the page we want to add exist or not, if it exists we throw an exception
                            var NewPageSearched = await _db.PlatformPages.Where(fbu => fbu.PlatformPageID == (Int64)Convert.ToInt64(page.PageID) && fbu.IsDeleted==false && fbu.GroupId == Group.Id).FirstOrDefaultAsync();

                            if (NewPageSearched != null)
                            {
                                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P002", Result = "Selected_Page_Exist" });
                            }
                            string PageShortLifeAccessToken = await GetPageShortLifeAccessToken(FacebookUser.AccessToken, page.PageID, InstagramPlatform.Id);
                            var PageLongLivedAccess_Token = await GetLongLivedTokenAsync(PageShortLifeAccessToken);
                            var PageInfoJsonResult = await GetPageInfo(PageLongLivedAccess_Token, page.PageID, InstagramPlatform.Id);
                            JObject PageJsonObject = JObject.Parse(PageInfoJsonResult.Value.ToString());
                            var NewPage = new PlatformPage
                            {
                                PlatformPageID = (Int64)Convert.ToInt64(page.PageID),
                                Group = Group,
                                PageOwner = FacebookUser,
                                AccessToken = PageLongLivedAccess_Token,
                                AccessTokenExpireDate = FacebookUser.AccessTokenExpireDate,
                                Platform = InstagramPlatform,  
                                AssociatedPlatformPages = new List<PlatformPage>(),
                                AddDate = DateTime.Now,
                                AddUser = RequestUser,
                                IsDeleted = false,
                                CachedData_PageName = PageJsonObject["name"]?.ToString() ?? PageJsonObject["username"]?.ToString()??"No Username Or Name Found",
                                CachedData_About = "No About Specified",
                                CachedData_Bio = PageJsonObject["biography"]?.ToString() ?? "No Bio Specified",
                                CachedData_Category = PageJsonObject["category"]?.ToString() ?? "No Category Specified",
                                CachedData_Description = "No Description Specified",
                                CachedData_fan_count = PageJsonObject["business_discovery"]["follows_count"]?.ToString() ?? "No Count Found",
                                CachedData_followers_count = PageJsonObject["business_discovery"]["followers_count"]?.ToString() ?? "No Followers Found",
                                CachedData_LastUpdateDate = DateTime.Now,
                                CachedData_Location = "No location found",
                                CachedData_PhoneNumber = "No Number found",
                                CachedData_PictureHeight = "50",
                                CachedData_PictureIs_silhouette = false,
                                CachedData_PictureURL = PageJsonObject["profile_picture_url"]?.ToString() ?? "https://via.placeholder.com/50x50",
                                CachedData_PictureWidth = "50",
                                CachedData_WebsiteURL = PageJsonObject["business_discovery"]["website"]?.ToString() ?? "No website found",
                                CachedData_IsChanged = false

                            };

                          

                            NewAssociatedPage.AssociatedByPlatformPage = NewPage;
                            _db.PlatformPages.Add(NewPage);
                           
                        }






                    }
                    _db.SaveChanges();
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "INSTA_Pages_Added", Result = "INSTA_Pages_Added_Successfully" });
                }
                else
                {
                    //Here is the treatmeent if we didn't select any Pages to add
                    return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P002", Result = "No_Page_Selected" });
                }
                
               
                
               

            }
            else
            {
                //Here is the Group doesn't exist  error handler
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P001", Result = "Group_is_invalid" });
            }
        }

        [HttpPost("GetGroupPages")]
        public async Task<ActionResult<string>> GetGroupPages(GetGroupPagesDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            /*  string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
              var handler = new JwtSecurityTokenHandler();
              var jwtSecurityToken = handler.ReadJwtToken(accessToken);

              var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;*/

            //Fetching the group and all of its pages and the associated pages


            var Group = await _db.Groups
                  .Include(g => g.PlatformPages)
                  .ThenInclude(p => p.AssociatedPlatformPages)
                  .Include(g => g.PlatformPages)
                  .ThenInclude(p => p.Platform)
                  .Include(g => g.PlatformPages)
                  .ThenInclude(p => p.PageOwner)
                  .Include(g => g.PlatformPages)
                  .ThenInclude(g => g.AssociatedByPlatformPage)
                  .ThenInclude(gg => gg.Platform)
                  .Where(g => g.Id == (Int64)Convert.ToInt64(request.GroupID) && g.IsDeleted == false)
                 .Select(g => new Group
                 {
                     Id = g.Id,
                     PlatformPages = g.PlatformPages.Select(fb => new PlatformPage
                     {
                         Id = fb.Id,
                         PlatformPageID = fb.PlatformPageID,
                         PlatformID = fb.PlatformID,
                         PageOwnerID = fb.PageOwnerID,
                         Platform = new Platform
                         {
                             Id = fb.Platform.Id,
                             PlatformName = fb.Platform.PlatformName,
                             PlatformLogoImageUrl = fb.Platform.PlatformLogoImageUrl,
                             PlatformUrl = fb.Platform.PlatformUrl
                         },
                         AssociatedByPlatformPageID = fb.AssociatedByPlatformPageID,
                        AssociatedByPlatformPage=fb.AssociatedByPlatformPage!=null?new PlatformPage
                        {
                            Platform = new Platform
                            {
                                Id = fb.AssociatedByPlatformPage.Platform.Id,
                                PlatformName = fb.AssociatedByPlatformPage.Platform.PlatformName,
                                PlatformLogoImageUrl = fb.AssociatedByPlatformPage.Platform.PlatformLogoImageUrl,
                                PlatformUrl = fb.AssociatedByPlatformPage.Platform.PlatformUrl
                            },
                            PlatformPageID = fb.AssociatedByPlatformPage.PlatformPageID,
                            CachedData_PageName = fb.AssociatedByPlatformPage.CachedData_PageName,
                            CachedData_About = fb.AssociatedByPlatformPage.CachedData_About,
                            CachedData_Bio = fb.AssociatedByPlatformPage.CachedData_Bio,
                            CachedData_Category = fb.AssociatedByPlatformPage.CachedData_Category,
                            CachedData_Description = fb.AssociatedByPlatformPage.CachedData_Description,
                            CachedData_fan_count = fb.AssociatedByPlatformPage.CachedData_fan_count,
                            CachedData_followers_count = fb.AssociatedByPlatformPage.CachedData_followers_count,
                            CachedData_LastUpdateDate = fb.AssociatedByPlatformPage.CachedData_LastUpdateDate,
                            CachedData_Location = fb.AssociatedByPlatformPage.CachedData_Location,
                            CachedData_PhoneNumber = fb.AssociatedByPlatformPage.CachedData_PhoneNumber,
                            CachedData_PictureHeight = fb.AssociatedByPlatformPage.CachedData_PictureHeight,
                            CachedData_PictureIs_silhouette = fb.AssociatedByPlatformPage.CachedData_PictureIs_silhouette,
                            CachedData_PictureURL = fb.AssociatedByPlatformPage.CachedData_PictureURL,
                            CachedData_PictureWidth = fb.AssociatedByPlatformPage.CachedData_PictureWidth,
                            CachedData_WebsiteURL = fb.AssociatedByPlatformPage.CachedData_WebsiteURL,
                            CachedData_IsChanged = fb.AssociatedByPlatformPage.CachedData_IsChanged,

                        }:null,
                         PageOwner = new PlatformAccount
                         {
                             PlatformAccountID = fb.PageOwner.PlatformAccountID,
                             Id = fb.PageOwner.Id,
                             CachedData_LastUpdateDate = fb.PageOwner.CachedData_LastUpdateDate,
                             CachedData_Last_name = fb.PageOwner.CachedData_Last_name,
                             CachedData_First_name = fb.PageOwner.CachedData_First_name,
                             CachedData_Email = fb.PageOwner.CachedData_Email,
                             CachedData_Name = fb.PageOwner.CachedData_Name,
                             CachedData_PictureHeight = fb.PageOwner.CachedData_PictureHeight,
                             CachedData_PictureIs_silhouette = fb.PageOwner.CachedData_PictureIs_silhouette,
                             CachedData_PictureURL = fb.PageOwner.CachedData_PictureURL,
                             CachedData_PictureWidth = fb.PageOwner.CachedData_PictureWidth,
                             CachedData_Username = fb.PageOwner.CachedData_Username,
                             CachedData_IsChanged = fb.PageOwner.CachedData_IsChanged
                         },
                         IsDeleted = fb.IsDeleted,
                         CachedData_PageName = fb.CachedData_PageName,
                         CachedData_About = fb.CachedData_About,
                         CachedData_Bio = fb.CachedData_Bio,
                         CachedData_Category = fb.CachedData_Category,
                         CachedData_Description = fb.CachedData_Description,
                         CachedData_fan_count = fb.CachedData_fan_count,
                         CachedData_followers_count = fb.CachedData_followers_count,
                         CachedData_LastUpdateDate = fb.CachedData_LastUpdateDate,
                         CachedData_Location = fb.CachedData_Location,
                         CachedData_PhoneNumber = fb.CachedData_PhoneNumber,
                         CachedData_PictureHeight = fb.CachedData_PictureHeight,
                         CachedData_PictureIs_silhouette = fb.CachedData_PictureIs_silhouette,
                         CachedData_PictureURL = fb.CachedData_PictureURL,
                         CachedData_PictureWidth = fb.CachedData_PictureWidth,
                         CachedData_WebsiteURL = fb.CachedData_WebsiteURL,
                         CachedData_IsChanged = fb.CachedData_IsChanged,
                         AssociatedPlatformPages = fb.AssociatedPlatformPages.Select(asp => new PlatformPage
                         {
                             Id = asp.Id,
                             Platform = new Platform
                             {
                                 Id = asp.Platform.Id,
                                 PlatformName = asp.Platform.PlatformName,
                                 PlatformLogoImageUrl = asp.Platform.PlatformLogoImageUrl,
                                 PlatformUrl = asp.Platform.PlatformUrl
                             },
                             PlatformPageID = asp.PlatformPageID,
                             CachedData_PageName = asp.CachedData_PageName,
                             CachedData_About = asp.CachedData_About,
                             CachedData_Bio = asp.CachedData_Bio,
                             CachedData_Category = asp.CachedData_Category,
                             CachedData_Description = asp.CachedData_Description,
                             CachedData_fan_count = asp.CachedData_fan_count,
                             CachedData_followers_count = asp.CachedData_followers_count,
                             CachedData_LastUpdateDate = asp.CachedData_LastUpdateDate,
                             CachedData_Location = asp.CachedData_Location,
                             CachedData_PhoneNumber = asp.CachedData_PhoneNumber,
                             CachedData_PictureHeight = asp.CachedData_PictureHeight,
                             CachedData_PictureIs_silhouette = asp.CachedData_PictureIs_silhouette,
                             CachedData_PictureURL = asp.CachedData_PictureURL,
                             CachedData_PictureWidth = asp.CachedData_PictureWidth,
                             CachedData_WebsiteURL = asp.CachedData_WebsiteURL,
                             CachedData_IsChanged = asp.CachedData_IsChanged,
                             IsDeleted = asp.IsDeleted
                         }).Where(p => p.IsDeleted == false).ToList()



                     }).Where(p => p.IsDeleted == false).ToList()

                 })
                 .FirstOrDefaultAsync();


            if (Group == null)
            {
                
                    return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P003", Result = "Group_Doesnt_exist" });
                
            }
            else
            {

                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Pages_Retrieved", Result = Group.PlatformPages });
            }
        }


        [HttpPost("GetPageInformations"), Authorize]
        public async Task<ActionResult<string>> GetPageInformations(GetPageInfoDTO request)
        {
            
            try
            {
                var Group = await _db.Groups.Where(g => g.Id == (Int64)Convert.ToInt64(request.GroupID) && g.IsDeleted == false)
                .Include(g => g.PlatformPages)
                .FirstOrDefaultAsync();
                var Page = await _db.PlatformPages.Where(p =>p.PlatformPageID== (Int64)Convert.ToInt64(request.PageID) && p.GroupId == Group.Id && p.IsDeleted == false)
                    .Include(p=>p.Platform)
                    .Include(g=>g.AssociatedByPlatformPage)
                    .ThenInclude(gg=>gg.Platform)
                    .Select(fb=>new PlatformPage
                    {
                        Id = fb.Id,
                        PlatformPageID = fb.PlatformPageID,
                        PlatformID = fb.PlatformID,
                        PageOwnerID = fb.PageOwnerID,
                        AssociatedByPlatformPageID = fb.AssociatedByPlatformPageID,
                        AssociatedByPlatformPage=fb.AssociatedByPlatformPage!=null?new PlatformPage
                        {
                            Platform = new Platform
                            {
                                Id = fb.AssociatedByPlatformPage.Platform.Id,
                                PlatformName = fb.AssociatedByPlatformPage.Platform.PlatformName,
                                PlatformLogoImageUrl = fb.AssociatedByPlatformPage.Platform.PlatformLogoImageUrl,
                                PlatformUrl = fb.AssociatedByPlatformPage.Platform.PlatformUrl
                            },
                            PlatformPageID = fb.AssociatedByPlatformPage.PlatformPageID,
                            CachedData_PageName = fb.AssociatedByPlatformPage.CachedData_PageName,
                            CachedData_About = fb.AssociatedByPlatformPage.CachedData_About,
                            CachedData_Bio = fb.AssociatedByPlatformPage.CachedData_Bio,
                            CachedData_Category = fb.AssociatedByPlatformPage.CachedData_Category,
                            CachedData_Description = fb.AssociatedByPlatformPage.CachedData_Description,
                            CachedData_fan_count = fb.AssociatedByPlatformPage.CachedData_fan_count,
                            CachedData_followers_count = fb.AssociatedByPlatformPage.CachedData_followers_count,
                            CachedData_LastUpdateDate = fb.AssociatedByPlatformPage.CachedData_LastUpdateDate,
                            CachedData_Location = fb.AssociatedByPlatformPage.CachedData_Location,
                            CachedData_PhoneNumber = fb.AssociatedByPlatformPage.CachedData_PhoneNumber,
                            CachedData_PictureHeight = fb.AssociatedByPlatformPage.CachedData_PictureHeight,
                            CachedData_PictureIs_silhouette = fb.AssociatedByPlatformPage.CachedData_PictureIs_silhouette,
                            CachedData_PictureURL = fb.AssociatedByPlatformPage.CachedData_PictureURL,
                            CachedData_PictureWidth = fb.AssociatedByPlatformPage.CachedData_PictureWidth,
                            CachedData_WebsiteURL = fb.AssociatedByPlatformPage.CachedData_WebsiteURL,
                            CachedData_IsChanged = fb.AssociatedByPlatformPage.CachedData_IsChanged,

                        }:null,
                        
                        Platform = new Platform
                        {
                            Id = fb.Platform.Id,
                            PlatformName = fb.Platform.PlatformName,
                            PlatformLogoImageUrl = fb.Platform.PlatformLogoImageUrl,
                            PlatformUrl = fb.Platform.PlatformUrl
                        },
                        PageOwner = new PlatformAccount
                        {
                            PlatformAccountID = fb.PageOwner.PlatformAccountID,
                            Id = fb.PageOwner.Id,
                            CachedData_LastUpdateDate = fb.PageOwner.CachedData_LastUpdateDate,
                            CachedData_Last_name = fb.PageOwner.CachedData_Last_name,
                            CachedData_First_name = fb.PageOwner.CachedData_First_name,
                            CachedData_Email = fb.PageOwner.CachedData_Email,
                            CachedData_Name = fb.PageOwner.CachedData_Name,
                            CachedData_PictureHeight = fb.PageOwner.CachedData_PictureHeight,
                            CachedData_PictureIs_silhouette = fb.PageOwner.CachedData_PictureIs_silhouette,
                            CachedData_PictureURL = fb.PageOwner.CachedData_PictureURL,
                            CachedData_PictureWidth = fb.PageOwner.CachedData_PictureWidth,
                            CachedData_Username = fb.PageOwner.CachedData_Username,
                            CachedData_IsChanged = fb.PageOwner.CachedData_IsChanged
                        },
                        IsDeleted = fb.IsDeleted,
                        CachedData_PageName = fb.CachedData_PageName,
                        CachedData_About = fb.CachedData_About,
                        CachedData_Bio = fb.CachedData_Bio,
                        CachedData_Category = fb.CachedData_Category,
                        CachedData_Description = fb.CachedData_Description,
                        CachedData_fan_count = fb.CachedData_fan_count,
                        CachedData_followers_count = fb.CachedData_followers_count,
                        CachedData_LastUpdateDate = fb.CachedData_LastUpdateDate,
                        CachedData_Location = fb.CachedData_Location,
                        CachedData_PhoneNumber = fb.CachedData_PhoneNumber,
                        CachedData_PictureHeight = fb.CachedData_PictureHeight,
                        CachedData_PictureIs_silhouette = fb.CachedData_PictureIs_silhouette,
                        CachedData_PictureURL = fb.CachedData_PictureURL,
                        CachedData_PictureWidth = fb.CachedData_PictureWidth,
                        CachedData_WebsiteURL = fb.CachedData_WebsiteURL,
                        CachedData_IsChanged = fb.CachedData_IsChanged,
                        AssociatedPlatformPages = fb.AssociatedPlatformPages.Select(asp => new PlatformPage
                        {
                            Id = asp.Id,
                            Platform = new Platform
                            {
                                Id = asp.Platform.Id,
                                PlatformName = asp.Platform.PlatformName,
                                PlatformLogoImageUrl = asp.Platform.PlatformLogoImageUrl,
                                PlatformUrl = asp.Platform.PlatformUrl
                            },
                            PlatformPageID = asp.PlatformPageID,
                            CachedData_PageName = asp.CachedData_PageName,
                            CachedData_About = asp.CachedData_About,
                            CachedData_Bio = asp.CachedData_Bio,
                            CachedData_Category = asp.CachedData_Category,
                            CachedData_Description = asp.CachedData_Description,
                            CachedData_fan_count = asp.CachedData_fan_count,
                            CachedData_followers_count = asp.CachedData_followers_count,
                            CachedData_LastUpdateDate = asp.CachedData_LastUpdateDate,
                            CachedData_Location = asp.CachedData_Location,
                            CachedData_PhoneNumber = asp.CachedData_PhoneNumber,
                            CachedData_PictureHeight = asp.CachedData_PictureHeight,
                            CachedData_PictureIs_silhouette = asp.CachedData_PictureIs_silhouette,
                            CachedData_PictureURL = asp.CachedData_PictureURL,
                            CachedData_PictureWidth = asp.CachedData_PictureWidth,
                            CachedData_WebsiteURL = asp.CachedData_WebsiteURL,
                            CachedData_IsChanged = asp.CachedData_IsChanged,
                            IsDeleted = asp.IsDeleted
                        }).Where(p => p.IsDeleted == false).ToList()
                    }).FirstOrDefaultAsync();
                if (Page == null)
                {
                    throw new Page_Doesnt_Exist_Exception();
                }
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Pages_Informations Recieved", Result = Page });
                
            }
          
            catch (Page_Doesnt_Exist_Exception ex2)
            {
                // Handle API errors (e.g. invalid page ID)
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P006", Result = "Invalid Page ID" });
                throw new InvalidPageID();
            }
        }

        [HttpPost("DeletePages"), Authorize]
        public async Task<ActionResult<string>> DeletePages(DeletePagesDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
            var RequestUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();
            var Group = await _db.Groups.Where(g => g.Id == (Int64)Convert.ToInt64(request.GroupID) && g.IsDeleted == false)
                .Include(g => g.PlatformPages)
                .FirstOrDefaultAsync();

            try
            {       
                foreach(Page_To_Delete Page in request.ListOfPagesToDelete.ToList() )
                {
                    var P = await _db.PlatformPages.Where(p => p.PlatformPageID == (Int64)Convert.ToInt64(Page.PageID) && p.IsDeleted==false && p.GroupId==Group.Id).FirstOrDefaultAsync();
                    
                    if (P==null)
                    {
                        throw new PlatformPage_Doesnt_exist();
                    }
                    P.AssociatedByPlatformPage = null;
                    P.AssociatedPlatformPages = null;
                    P.DeleteDate = DateTime.Now;
                    P.DeleteUser = RequestUser;
                    P.IsDeleted = true;
                    
                }
                _db.SaveChanges();
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Pages_Deleted", Result = "Pages_Deleted" });
            }

            catch (PlatformPage_Doesnt_exist ex)
            {

                // Handle API errors (e.g. invalid page ID)
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P007", Result = "Page_doesnt_exist" });
               
            }

        }


        [HttpPost("GetAllPagesCategories")]
        public async Task<ActionResult<string>> GetAllPagesCategories(GetPageInfoDTO request)
        {
            try
            {
                var Page = await _db.PlatformPages.Where(p => p.PlatformPageID == (Int64)Convert.ToInt64(request.PageID) && p.IsDeleted==false).FirstOrDefaultAsync();
            var accessToken = Page.AccessToken;
            var fbClient = new FacebookClient(accessToken);
            
                dynamic result = await fbClient.GetTaskAsync("/fb_page_categories");

                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Pages_Informations Recieved", Result = result });

            }
            catch (FacebookOAuthException ex)
            {
                //Token Expired
                if (ex.ErrorCode == 190)
                {
                    return BadRequest(new ErrorResponse { StatusCode = "406", ErrorCode = "P004", Result = "Token Expired" });
                    throw new PageTokenExpired();
                }
                if (ex.ErrorCode == 4)
                {
                    return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "F004", Result = "Too Many Requests to the Facebook" });
                }

                else
                {
                    return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P005", Result = "TnvalidToken" });
                    // Handle OAuth errors (e.g. invalid access token)
                    throw new InvalidPageTokenException();
                }

            }
            catch(NullReferenceException)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P006", Result = "Page_Doesnt_Exist" });
            }
            catch (WebExceptionWrapper e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P111", Result = "Unable to Establish Connection with Facebook" });
            }

        }



        [HttpPost("UpdatePageInfo")]
        public async Task<ActionResult<string>> UpdatePageInfo(UpdatePageInfoDTO req)
        {
            try
            {
                var Group = await _db.Groups.Where(g => g.Id == (Int64)Convert.ToInt64(req.GroupID) && g.IsDeleted == false)
                .Include(g => g.PlatformPages)
                .FirstOrDefaultAsync();
                var pageId = req.PageID;
                var page = await _db.PlatformPages.Where(p => p.PlatformPageID == (Int64)Convert.ToInt64(req.PageID) && p.GroupId == Group.Id && p.IsDeleted==false).FirstOrDefaultAsync();
                var accessToken = page.AccessToken;
                string uri = $"https://graph.facebook.com/{pageId}?access_token={accessToken}";
                if(page.PlatformID==1)
                {
                    using (var httpClient = new HttpClient())
                    {
                        //Add the required fields here
                        //warning there is an issue with the page name permission, removed for now
                        //var reqbody = new { about = req.PageAbout, description = req.PageDescription, category_list =JsonConvert.SerializeObject(categoryList)
                        var reqbody = new
                        {
                            about = req.PageAbout,
                            description = req.PageDescription,

                        };
                        var jsonString = JsonConvert.SerializeObject(reqbody);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                        var httpResponse = await httpClient.PostAsync(uri, httpContent);

                        if (!httpResponse.IsSuccessStatusCode)
                        {
                            return BadRequest(new ErrorResponse { StatusCode = "406", ErrorCode = "P008", Result = httpResponse });

                        }
                        page.CachedData_About = req.PageAbout;
                        page.CachedData_Description = req.PageDescription;
                        _db.SaveChanges();
                    }
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Page_Informations_Updated", Result = null });
                }
                if(page.PlatformID == 2)
                {
                    return BadRequest(new ErrorResponse { StatusCode = "406", ErrorCode = "P088", Result = "you cant modify Instagram attributes, do it manually through their website " });
                }

               else
                {
                    return BadRequest(new ErrorResponse { StatusCode = "406", ErrorCode = "P099", Result = "This platform is not supported yet." });
                }
            }
            catch (WebExceptionWrapper e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P111", Result = "Unable to Establish Connection with Facebook" });
            }
        }



        [HttpPost("UpdatePagePicture")]
        public async Task<ActionResult<string>> UpdatePagePicture(UpdatePagePictureDTO req)
        {
            var Group = await _db.Groups.Where(g => g.Id == (Int64)Convert.ToInt64(req.GroupID) && g.IsDeleted == false)
                .Include(g => g.PlatformPages)
                .FirstOrDefaultAsync();
            var pageId = req.PageID;
            var page = await _db.PlatformPages.Where(p => p.PlatformPageID == (Int64)Convert.ToInt64(req.PageID) && p.GroupId == Group.Id && p.IsDeleted == false).FirstOrDefaultAsync();
          
            
            try
            {
                if (page.PlatformID == 1)
                {
                    var accessToken = page.AccessToken;
                    string uri = $"https://graph.facebook.com/{pageId}/picture?access_token={accessToken}";
                    using (var httpClient = new HttpClient())
                    {
                        //Add the required fields here
                        //warning there is an issue with the page name permission, removed for now
                        var reqbody = new { picture = req.PictureURL };
                        var jsonString = JsonConvert.SerializeObject(reqbody);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                        var httpResponse = await httpClient.PostAsync(uri, httpContent);
                        var responseContent = await httpResponse.Content.ReadAsStringAsync();
                        dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                        Console.Write("h");
                        if (!httpResponse.IsSuccessStatusCode)
                        {
                            return BadRequest(new ErrorResponse { StatusCode = "406", ErrorCode = "P008", Result = httpResponse });
                        }
                        page.CachedData_PictureURL = req.PictureURL;
                    }
                    _db.SaveChanges();
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Page_Picture_Updated", Result = null });
                }
                if(page.PlatformID==2)
                {
                    //-----------------------------NOTE This feature is disabled, needs permissions-----------------///
                    /* var accessToken = page.AccessToken;
                     string uri = $"https://graph.facebook.com/{pageId}/picture?access_token={accessToken}";
                     using (var httpClient = new HttpClient())
                     {
                         //Add the required fields here
                         //warning there is an issue with the page name permission, removed for now
                         var reqbody = new { picture = req.PictureURL };
                         var jsonString = JsonConvert.SerializeObject(reqbody);
                         var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                         var httpResponse = await httpClient.PostAsync(uri, httpContent);
                         var responseContent = await httpResponse.Content.ReadAsStringAsync();
                         dynamic responseObject = JsonConvert.DeserializeObject(responseContent);
                         Console.Write("h");
                         if (!httpResponse.IsSuccessStatusCode)
                         {
                             return BadRequest(new ErrorResponse { StatusCode = "406", ErrorCode = "P008", Result = httpResponse });
                         }
                         page.CachedData_PictureURL = req.PictureURL;
                     }
                     _db.SaveChanges();
                     return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Page_Picture_Updated", Result = null });*/

                    //----------------------------------END NOTE----------------------------------//

                    return BadRequest(new ErrorResponse { StatusCode = "406", ErrorCode = "P7845", Result = "Feature Disabled For Instagram pages until further updates." });
                }
                else
                {
                    throw new Exception("Platform Not supported");
                }
                

               
            }
            catch (WebExceptionWrapper e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P111", Result = "Unable to Establish Connection with Facebook" });
            }
        }

        [HttpPost("RemovePageAssociations")]
        public async Task<ActionResult<string>> RemovePageAssociations(RemovePageAssociationsDTO req)
        {
            var Group = await _db.Groups.Where(g => g.Id == (Int64)Convert.ToInt64(req.GroupID) && g.IsDeleted == false)
                .Include(g => g.PlatformPages)
                .FirstOrDefaultAsync();
            var pageId = req.PageID;
            var page = await _db.PlatformPages.Where(p => p.PlatformPageID == (Int64)Convert.ToInt64(req.PageID) && p.GroupId == Group.Id && p.IsDeleted == false).Include(p=>p.AssociatedPlatformPages).Include(p=>p.AssociatedByPlatformPage).ThenInclude(g=>g.AssociatedPlatformPages).FirstOrDefaultAsync();

            try
            {
                if (page == null) throw new InvalidPageID();
                 //Case of removing an association to the page
                if (req.AssociationType=="1")
                    {

                    PlatformPage FoundPage= null;
                        foreach(PlatformPage Pg in page.AssociatedPlatformPages)
                        {
                           if(Pg.PlatformPageID== (Int64)Convert.ToInt64(req.AssociatedPageID))
                            {
                            FoundPage = Pg;
                            }

                        }

                    if (FoundPage == null) throw new InvalidPageID();

                    page.AssociatedPlatformPages.Remove(FoundPage);
                    FoundPage.AssociatedByPlatformPage = null;
                    _db.SaveChanges();
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Association_removed", Result = null });
                }
                //Case of removing associated by
               if(req.AssociationType=="2")
                    {

                    if (page.AssociatedByPlatformPage.PlatformPageID == null) throw new InvalidPageID();
                    
                    page.AssociatedByPlatformPage.AssociatedPlatformPages.Remove(page);
                    page.AssociatedByPlatformPage = null;
                    _db.SaveChanges();
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Association_By_removed", Result = null });

                }
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P111", Result = "Wrong_Association_Type (1 for association removal,2 for association by removal)" });
            }
            catch (InvalidPageID)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P111", Result = "Unvalid Page ID" });
            }
        }


        [HttpPost("GetPagePlatformID")]
        public async Task<ActionResult<string>> GetPagePlatformID(GetPagePlatformID req)
        {

            var pagePlatformID = await _db.PlatformPages.Where(p => p.Id == (Int64)Convert.ToInt64(req.PageID)  && p.IsDeleted == false).Select(p=>p.PlatformPageID).FirstOrDefaultAsync();

            try
            {
                if (pagePlatformID == null) throw new InvalidPageID();
                //Case of removing an association to the page
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "PagePlatformID_Fetched", Result = pagePlatformID });
            }
            catch (InvalidPageID)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P111", Result = "Unvalid Page ID" });
            }
        }
        [NonAction]
        public async Task<JsonResult> GetPageInfo( string AccessToken, string PageID,Int64? PlatformID)
        {

            //if a facebook page we handle it like this
            if(PlatformID==1)
            {
                var accessToken = AccessToken;
                var fbClient = new FacebookClient(accessToken);
                try
                {
                    dynamic result = await fbClient.GetTaskAsync("/" + PageID + "?fields=name,id,personal_info,picture,bio,category,followers_count,fan_count,description,about,emails,location,website,phone");
                    return Json(result);
                }
                catch (FacebookOAuthException ex)
                {
                    //Token Expired
                    if (ex.ErrorCode == 190)
                    {
                        throw new PageTokenExpired();
                    }
                    else
                    {
                        // Handle OAuth errors (e.g. invalid access token)
                        throw new InvalidPageTokenException();
                    }

                }
                catch (FacebookApiException ex)
                {

                    // Handle API errors (e.g. invalid page ID)

                    throw new InvalidPageID();
                }
                catch (WebExceptionWrapper e)
                {
                    throw new ConnectionLostException();
                }
            }
            //If Instagram we handle it like this
            if(PlatformID == 2)
            {
                var accessToken = AccessToken;
                var fbClient = new FacebookClient(accessToken);

                try
                {
                    dynamic Temp_result = await fbClient.GetTaskAsync("/" + PageID + "?fields=id,username");
                    JObject Temp_ResJsonObject = JObject.Parse(Json(Temp_result).Value.ToString());
                    dynamic result = await fbClient.GetTaskAsync("/" + PageID + "?fields=id,username,profile_picture_url,name,biography,business_discovery.username(" + Temp_ResJsonObject["username"].ToString() + "){website,followers_count,media_count,follows_count}");

                    return Json(result);
                }
                catch (FacebookOAuthException ex)
                {
                    //Token Expired
                    if (ex.ErrorCode == 190)
                    {
                        throw new PageTokenExpired();
                    }
                    if (ex.ErrorCode == 4)
                    {
                        throw new Facebook_too_Many_Requests();
                    }
                    else
                    {
                        // Handle OAuth errors (e.g. invalid access token)
                        throw new InvalidPageTokenException();
                    }

                }
                catch (WebExceptionWrapper e)
                {
                    throw new ConnectionLostException();
                }

            }
            else
            {
                throw new PlatformNotSupported();
            }

           

            
        }




        [NonAction]
        public async Task<JsonResult> GetUserInfo(string AccessToken, string UserID)
        {
            var accessToken = AccessToken;
            var fbClient = new FacebookClient(accessToken);
            try
            {
                dynamic result = await fbClient.GetTaskAsync("/" + UserID + "?fields=id,first_name,last_name,picture,name,email");
                return Json(result);
            }


            
            catch (FacebookOAuthException ex)
            {
                //Token Expired
                if (ex.ErrorCode == 190)
                {
                    throw new UserTokenExpired();
                }
                //handling the too many requests error
                if(ex.ErrorCode==4)
                {
                    throw new Facebook_too_Many_Requests();
                }
                else
                {
                    // Handle OAuth errors (e.g. invalid access token)
                    throw new InvalidUserTokenException();
                }

            }
            catch (FacebookApiException ex)
            {

                // Handle API errors (e.g. invalid page ID)

                throw new InvalidUserID();
            }
            catch (WebExceptionWrapper e)
            {
                throw new ConnectionLostException();
            }


        }


        [NonAction]
        public async Task<JsonResult> GetIGUserInfo(string AccessToken, string UserID)
        {
            var accessToken = AccessToken;
            var fbClient = new FacebookClient(accessToken);
            try
            {
                dynamic result = await fbClient.GetTaskAsync("/" + UserID + "?fields=id,username,profile_picture_url,name");
                return Json(result);



            }
            catch (FacebookOAuthException ex)
            {
                //Token Expired
                if (ex.ErrorCode == 190)
                {
                    throw new UserTokenExpired();
                }
                else
                {
                    // Handle OAuth errors (e.g. invalid access token)
                    throw new InvalidUserTokenException();
                }
                if (ex.ErrorCode == 4)
                {
                    throw new Facebook_too_Many_Requests();
                }

            }
            catch (FacebookApiException ex2)
            {

                // Handle API errors (e.g. invalid page ID)

                throw new InvalidUserID();
            }
            catch (WebExceptionWrapper e)
            {
                throw new ConnectionLostException();
            }


        }


        [NonAction]
        public async Task<string> GetLongLivedTokenAsync(string shortLivedToken)
        {
            
                
            string appId = Configuration.GetSection("ConnectionStrings")["MetaAppID"];
            string appSecret = Configuration.GetSection("ConnectionStrings")["MetaAppCode"];
            string requestUrl = $"https://graph.facebook.com/v12.0/oauth/access_token?grant_type=fb_exchange_token&client_id={appId}&client_secret={appSecret}&fb_exchange_token={shortLivedToken}";
            try
            {


                using (var client = new HttpClient())
                {
                    var response = await client.GetAsync(requestUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        JObject responseData = JObject.Parse(await response.Content.ReadAsStringAsync());
                        return responseData.Value<string>("access_token");
                    }
                    else
                    {
                        throw new Exception($"Failed to exchange token: {response.StatusCode}");
                    }
                }
            }
            catch (WebExceptionWrapper e)
            {
                throw new ConnectionLostException();
            }
        }


        [NonAction]
        public async Task<string> GetPageShortLifeAccessToken(string UserAccessToken, string PageID,Int64 PlatformID)
        {

            String Result = "";
            try
            {
                //If the page we're adding is a facebook page
                if (PlatformID == 1)
                {
                    var fbClient = new FacebookClient(UserAccessToken);


                    dynamic result = await fbClient.GetTaskAsync("/me/accounts?fields=id,access_token");
                    // [0} to get the data not paging

                    string json = result[0].ToString();
                    JsonDocument doc = JsonDocument.Parse(json);

                    foreach (JsonElement element in doc.RootElement.EnumerateArray())
                    {
                        string id = element.GetProperty("id").GetString();
                        string access_token = element.GetProperty("access_token").GetString();
                        if (id == PageID)
                        {
                            Result = access_token;
                            break;
                        }

                    }
                    return Result;
                }
                if(PlatformID == 2)
                {
                    var fbClient = new FacebookClient(UserAccessToken);


                    dynamic result = await fbClient.GetTaskAsync("/me/accounts?fields=id,access_token,instagram_business_account{id}");
                    // [0} to get the data not paging

                    string json = result[0].ToString();
                    JsonDocument doc = JsonDocument.Parse(json);

                    foreach (JsonElement element in doc.RootElement.EnumerateArray())
                    {
                        JsonElement business_Account;
                        string id = element.GetProperty("id").GetString();
                        string access_token = element.GetProperty("access_token").GetString();
                        //testing if it has the business account or not
                     if (element.TryGetProperty("instagram_business_account", out business_Account))
                        {
                            string business_Account_ID = element.GetProperty("instagram_business_account").GetProperty("id").GetString();
                            if (business_Account_ID == PageID)
                            {
                                Result = access_token;
                                break;
                            }

                        }
                       

                    }
                    return Result;
                }

                throw new PlatformNotSupported();

            }
            catch (FacebookOAuthException ex)
            {
                //Token Expired
                if (ex.ErrorCode == 190)
                {
                    throw new PageTokenExpired();
                }
                if (ex.ErrorCode == 4)
                {
                    throw new Facebook_too_Many_Requests();
                }
                else
                {
                    // Handle OAuth errors (e.g. invalid access token)
                    throw new InvalidPageTokenException();
                }

            }
            catch (WebExceptionWrapper e)
            {
                throw new ConnectionLostException();
            }
        }


        public class PageInfo
        {
            public string name { get; set; }
            public string description { get; set; }
            public string bio { get; set; }
        }


        
    }
}
