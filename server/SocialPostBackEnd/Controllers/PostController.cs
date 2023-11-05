using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using Microsoft.Net.Http.Headers;
using SocialPostBackEnd.Data;
using SocialPostBackEnd.DTO;
using SocialPostBackEnd.Exceptions;
using SocialPostBackEnd.Models;
using SocialPostBackEnd.Responses;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SocialPostBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _db;
        public IConfiguration Configuration { get; }
        public PostController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }


        [HttpPost("AddPost"), Authorize]
        public async Task<ActionResult<string>> AddPost(AddPostDTO request)
        {

            try
            {
                string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(accessToken);

                var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
                var ReqUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();

                var PostGroup = await _db.Groups.Where(p => p.Id == (Int64)Convert.ToInt64(request.PostGroupID)).FirstOrDefaultAsync();
                //throw an exception if no Group in the selection is found
                PostGroup = PostGroup ?? throw new GroupIDInvalid();

                //--------------------------in this part we gonna handle Dynamic field, Assets and Associated Pages for a post----------------------//


                //This contains the list of Platform pages that the post is related to
                List<PlatformPage> ListOfAssociatedPages = new List<PlatformPage> { };

                //This contains the list of the DynamicFields that the post is related to
                List<DynamicField> ListOfDynamicFields = new List<DynamicField> { };

                //This contains the list of the Assets that the post is related to
                List<AssetPost> ListOfAssets = new List<AssetPost> { };

                //This contains the list of the Tags for each Asset
                List<AssetTagDTO> ListOfTags = new List<AssetTagDTO> (request.ListOfTags);

                //reteriving all the related Pages

                foreach (var Page in request.ListOfPages)
                {
                    var PlatformPage = await _db.PlatformPages.Where(p => p.PlatformPageID == (Int64)Convert.ToInt64(Page.PageID)&&p.GroupId== (Int64)Convert.ToInt64(request.PostGroupID)).FirstOrDefaultAsync();
                    //throw an exception if no Page ID in the selection is found
                    PlatformPage = PlatformPage ?? throw new InvalidPageID();
                    ListOfAssociatedPages.Add(PlatformPage);
                }

                //retreiving all the Dynamicfields and associating them

                //DF stands for Dynamic FIeld
                foreach (var DF in request.ListOfDynamicFields)
                {
                    //here we itterating through different DynamicFields that uses different Patterns

                    //Getting the pattern for each DF
                    var DFPattern = await _db.Patterns.Where(p => p.Id == (Int64)Convert.ToInt64(DF.PatternID)).FirstOrDefaultAsync();
                    //throw an exception if no pattern found
                    DFPattern = DFPattern ?? throw new PatternIDInvalid();
                    //Getting the dynamic fields values for each page
                    foreach (var DFV in DF.ListOfPagesDynamicFieldValues)
                    {

                        var AssociatedPage = ListOfAssociatedPages.FirstOrDefault(x => x.PlatformPageID == (Int64)Convert.ToInt64(DFV.PageID) && x.GroupId == (Int64)Convert.ToInt64(request.PostGroupID));
                        //throw an exception if no Page ID in the selection is found
                         AssociatedPage = AssociatedPage ?? throw new InvalidPageID();

                        var NewDynamicField = new DynamicField
                        {
                            Pattern = DFPattern,
                            Value = DFV.DynamicFieldValue,
                            PlatformPage = AssociatedPage,
                            PatternId=DFPattern.Id
                            

                        };
                        _db.DynamicFields.Add(NewDynamicField);


                        ListOfDynamicFields.Add(NewDynamicField);
                       
                       
                    }
                }
               




                //----------------In this part we gonna handle Targetting if it exists----------------------------//

                //Here I will be putting the global Targetting variables that gonna be changed and updated accordingly by the treatment below
                Platform Target_Platform = await _db.Platforms.Where(p => p.Id==(Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();
                
                AgeRange Post_AgeRange = null;
                Gender Post_Target_Gender = null;
                List<Country> Post_Targeted_Countries = new List<Country>();
                List<Region> Post_Targeted_Regions = new List<Region>();
                List<Location> Post_Targeted_Locations = new List<Location>();
                List<Language> Post_Targeted_Languages = new List<Language>();
                List<Interest> Post_Targeted_Interests = new List<Interest>();
                //-----Age Targeting Check---///
                //Checking if there is an Age Range if there is the Post_AgeRange is set otherwise it stays Null
                if (request.Target_AgeFrom!="" &&request.Target_AgeTo!="")
                {
                    //Test if a similar age range is created

                    var Range = await _db.AgeRanges.Where(p => p.Max_age == request.Target_AgeTo && p.Min_age == request.Target_AgeFrom).FirstOrDefaultAsync();
                    //If Range is found we simply associate it to the post
                    if(Range!=null)
                    {
                        Post_AgeRange = Range;
                    }
                    else //if null, we create a new Age Range
                    {
                        var NewRange = new AgeRange
                        {
                            Max_age = request.Target_AgeTo,
                            Min_age = request.Target_AgeFrom
                        };
                        Post_AgeRange = NewRange;
                        _db.AgeRanges.Add(NewRange);
                    }

                }
                //---Gender Targeting Check---//
                //this will get the proper Gender based on the ID "1 for Males only, 2 for females only and 3 for both"
                Post_Target_Gender= await _db.Genders.Where(p => p.Id== (Int64)Convert.ToInt64(request.Target_Gender)).FirstOrDefaultAsync();

                //---Country Targeting Check---//

                if(request.Targeted_Countries.Count()>0)
                {

                    //itterating through every country
                   foreach(TargetCountryDTO country in request.Targeted_Countries)
                    {
                        //We will be checking, if the country exist, we just associate the instance, if not we create an other one
                      var  ctry = await _db.Countries.Where(p => p.Country_PlatformCode==country.Country_PlatformCode && p.Country_PlatformId==(Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                        if(ctry!=null)
                        {
                            Post_Targeted_Countries.Add(ctry);
                        }
                        else //Creating new country if no match found
                        {
                            var NewCountry = new Country
                            {
                                Country_Platform = Target_Platform,
                                Country_Key = country.Country_Key,
                                Country_Name = country.Country_Name,
                                Country_PlatformCode = country.Country_PlatformCode

                            };
                            _db.Countries.Add(NewCountry);
                            Post_Targeted_Countries.Add(NewCountry);
                        }

                    }
                }

                //---Region Targeting Check---//

                if (request.Targeted_Regions.Count() > 0)
                {

                    //itterating through every country
                    foreach (TargetRegionDTO Region in request.Targeted_Regions)
                    {
                        //We will be checking, if the country exist, we just associate the instance, if not we create an other one
                        var regiondb = await _db.Regions.Where(p => p.Region_PlatformCode == Region.Region_PlatformCode && p.Region_PlatformId == (Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                        if (regiondb != null)
                        {
                            Post_Targeted_Regions.Add(regiondb);
                        }
                        else //Creating new country if no match found
                        {

                            Country CurrentRegion_Country = null;
                                //Finding the Country that corrspend with the Region
                                foreach(var Country in Post_Targeted_Countries)
                            {
                                if(Country.Country_PlatformCode==Region.Country_PlatformId)
                                {
                                    CurrentRegion_Country = Country; break;
                                }
                            }

                            var NewRegion = new Region
                            {
                                Region_Platform = Target_Platform,
                                Region_Name = Region.Region_Name,
                                Region_Country= CurrentRegion_Country,
                                Region_PlatformCode = Region.Region_PlatformCode
                            };
                            _db.Regions.Add(NewRegion);
                            Post_Targeted_Regions.Add(NewRegion);
                        }

                    }
                }


                //---Location Targeting Check---//

                if (request.Targeted_Locations.Count() > 0)
                {

                    //itterating through every country
                    foreach (TargetLocationDTO Location in request.Targeted_Locations)
                    {
                        //We will be checking, if the country exist, we just associate the instance, if not we create an other one
                        var Locationdb = await _db.Locations.Where(p => p.Location_PlatformCode == Location.Location_PlatformCode && p.Location_PlatformId == (Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                        if (Locationdb != null)
                        {
                            Post_Targeted_Locations.Add(Locationdb);
                        }
                        else //Creating new country if no match found
                        {

                            Region CurrentLocation_Region = null;
                            //Finding the Country that corrspend with the Region
                            foreach (var Region in Post_Targeted_Regions)
                            {
                                if (Location.Location_RegionId == Region.Region_PlatformCode)
                                {
                                    CurrentLocation_Region = Region; break;
                                }
                            }

                            var NewLocation = new Location
                            {
                                Location_Name = Location.Location_Name,
                                Location_Platform = Target_Platform,
                                Location_PlatformCode = Location.Location_PlatformCode,
                                Location_Region = CurrentLocation_Region,
                                Location_Type = Location.Location_Type   
                            };
                            _db.Locations.Add(NewLocation);
                            Post_Targeted_Locations.Add(NewLocation);
                        }

                    }
                }


                //---Language Targeting Check---//

                if (request.Targeted_Languages.Count() > 0)
                {

                    //itterating through every country
                    foreach (TargetLanguageDTO Language in request.Targeted_Languages)
                    {
                        //We will be checking, if the country exist, we just associate the instance, if not we create an other one
                        var Languagedb = await _db.Languages.Where(p => p.Language_PlatformKey == Language.LanguagePlatform_Key && p.Language_PlatformId == (Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                        if (Languagedb != null)
                        {
                            Post_Targeted_Languages.Add(Languagedb);
                        }
                        else //Creating new country if no match found
                        {
                            var NewLanguage = new Language
                            {
                                Language_Name = Language.Language_Name,
                                Language_Platform= Target_Platform,
                                Language_PlatformKey=Language.LanguagePlatform_Key
                            };
                            _db.Languages.Add(NewLanguage);
                            Post_Targeted_Languages.Add(NewLanguage);
                        }

                    }
                }


                //---Interest Targeting Check---//

                if (request.Targeted_Interests.Count() > 0)
                {

                    //itterating through every country
                    foreach (TargetInterestDTO Interest in request.Targeted_Interests)
                    {
                        //We will be checking, if the country exist, we just associate the instance, if not we create an other one
                        var InterestDb = await _db.Interests.Where(p => p.Interest_PlatformCode == Interest.Interest_PlatformCode && p.Interest_PlatformId == (Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                        if (InterestDb != null)
                        {
                            Post_Targeted_Interests.Add(InterestDb);
                        }
                        else //Creating new country if no match found
                        {
                            var NewInterest = new Interest
                            {
                                Interest_Name=Interest.Interest_Name,
                                Interest_PlatformCode=Interest.Interest_PlatformCode,
                                Interest_Topic=Interest.Interest_Topic,
                                Interest_Description=Interest.Interest_Description,
                                Interest_Platform=Target_Platform                            
                            };
                            _db.Interests.Add(NewInterest);
                            Post_Targeted_Interests.Add(NewInterest);
                        }

                    }
                }

                //---Associating Targetting with the Post ---//

                //Flag that indicate if the post is targeted or not, will be useful later in the Scheduler Service for better performance
                bool isTargeted = true;

                var AllGendersTargeted = await _db.Genders.Where(p => p.Id ==3).FirstOrDefaultAsync();
                //Here we check if the post is targeted or not, if all the previous fields are empty, then it's not targeted by any mean
                if (Post_AgeRange==null&& Post_Target_Gender==AllGendersTargeted && Post_Targeted_Countries.Count==0&& Post_Targeted_Regions.Count==0&& Post_Targeted_Locations.Count==0&& Post_Targeted_Languages.Count==0&& Post_Targeted_Interests.Count==0)
                {
                    isTargeted = false;
                }        
                //if the post is not targeted we just create a simple post with the isTargetedFlag set to false
                if(!isTargeted)
                {

                    var NewPost = new Post
                    {
                        CreateDate = DateTime.Now,
                        RepeatPost = request.RepeatPost,
                        RepeatOption = request.RepeatOption, //Monthly, weekly, yearly.// Those are the values that these can take
                        IsDeleted = false,
                        PostDate = request.PostDate,
                        Pages = ListOfAssociatedPages,
                        PostDynamicFields = ListOfDynamicFields,
                        CreateUser = ReqUser,
                        EndRepeatAfterDate = request.EndRepeatAfterDate,
                        EndRepeatOption = request.EndRepeatOption,  //EndOccOption,EndDateOption,NoEnd // Those are the values that these can take
                        EndRepeatOnOccurence = request.EndRepeatOnOccurence,
                        EndRepeatPost = request.EndRepeatPost, // This gonna take True or False to specify if the repeat ends or not
                        PostText = request.PostText,
                        Group = PostGroup,
                        IsPosted = false,
                        Post_Occurence = 0,
                        IsTargeted = false

                    };
                    //------------------------------------------Associating the assets to the Post----------------------//
                    //Here we're gonna be itterating through the associated assets
                    foreach (var Asset in request.ListOfAssets)
                    {
                        //AST stands for Asset, a shortcut
                        var AST = await _db.Assets.Where(p => p.Id == (Int64)Convert.ToInt64(Asset.AssetID)).FirstOrDefaultAsync();
                        AssetPost AssetPos = new AssetPost
                        {
                            Post = NewPost,
                            Asset = AST
                        };

                        ListOfAssets.Add(AssetPos);

                        //-----------------------------Here we will be associating the Tags to the AssetPosts---------------------///

                        AssetTagDTO Last_Asset_Tag = null;
                        foreach (AssetTagDTO Asset_Tag in ListOfTags)
                        {
                            if (Asset_Tag.Asset_ID == Asset.AssetID)
                            {
                                Last_Asset_Tag = Asset_Tag;
                                break;
                            }
                        }
                        if(Last_Asset_Tag!=null)
                        {

                            //-------Removing the Asset Tags so that we don't use it again for an asset with the same ID---//
                            ListOfTags.Remove(Last_Asset_Tag);

                            //------------iterating through the tags and creating them----------------//
                            foreach (TagDTO tag in Last_Asset_Tag.Assetags.ToList())
                            {

                                //Getting the Tagged platform acc
                                var PlatformAccount = await _db.PlatformAccounts.Where(p => p.PlatformAccountID == tag.TaggedUserID).FirstOrDefaultAsync();
                                Tag NewTag = new Tag
                                {
                                    App_Screen_x = tag.Screen_x,
                                    App_Screen_y = tag.Screen_y,
                                    App_ScrollLeftValue = tag.ScrollLeftValue,
                                    App_ScrollTopValue = tag.ScrollTopValue,
                                    TaggedImage_X = tag.Tag_X,
                                    TaggedImage_Y = tag.Tag_Y,
                                    TaggedPlatformAccount = PlatformAccount,
                                    TaggedAssetPost = AssetPos
                                };
                                _db.Tags.Add(NewTag);
                            }
                        }
                        
                    }

                    NewPost.UsedAssets = ListOfAssets;
                    //-------------------------------------------Association Ends here---------------------------------//







                    //------------------------------------------Associating the Video to the Post----------------------//

                    foreach (var Video in request.ListOfVideoAssets)
                    {
                        //AST stands for Asset, a shortcut
                        var Vid = await _db.Assets.Where(p => p.Id == (Int64)Convert.ToInt64(Video.Asset_ID)).FirstOrDefaultAsync();

                        if(Video.ThumbnailURL!= "No_Thumbnail_Specified")
                        {
                            //=========Case of a video with a thumbnail specified=======//
                            Asset Thumbnail = new Asset
                            {
                                AssetName = "Asset " + Vid.Id + " thumbnail",
                                CreateDate = DateTime.Now,
                                CreateUser = ReqUser,
                                AssetType = "Thumbnail_Image/png",
                                ResourceURL = Video.ThumbnailURL,
                                IsDeleted = false

                            };

                            AssetPost AssetPos = new AssetPost
                            {
                                Post = NewPost,
                                Asset = Vid,
                                Thumbnail= Thumbnail,
                            };
                            ListOfAssets.Add(AssetPos);
                        }
                        else
                        {
                            //=========Case of a video without a thumbnail specified=======//
                            AssetPost AssetPos = new AssetPost
                            {
                                Post = NewPost,
                                Asset = Vid
                            };
                            ListOfAssets.Add(AssetPos);
                        }

                       
                    }

                    NewPost.UsedAssets = ListOfAssets;
                    //-------------------------------------------Association Ends here---------------------------------//


                    //--------------------------NOTE: Adding Mentions to the POST---------------------//

                    //Iterating through the platformaccounts 
                    foreach (var platformaccount in request.ListOfMentionedPlatformAccounts)
                    {
                        var PlatformAccount = await _db.PlatformAccounts.Where(p => p.PlatformAccountID == platformaccount.MentionedPlatformAccount_ID).FirstOrDefaultAsync();
                        MentionedAccountPost NewMention = new MentionedAccountPost
                        {
                            Post = NewPost,
                            Mentioned_PlatformAccount = PlatformAccount
                        };
                        _db.MentionedAccountPost.Add(NewMention);
                        NewPost.PostMentions.Add(NewMention);
                    }



                    //--------------------------NOTE: End Of Adding Mentions to the POST---------------------//
                    _db.Posts.Add(NewPost);
                }
                //if the Post is targeted with at least one option we do this
                else
                {
                    var NewPost = new Post
                    {
                        CreateDate = DateTime.Now,
                        RepeatPost = request.RepeatPost,
                        RepeatOption = request.RepeatOption, //Monthly, weekly, yearly.// Those are the values that these can take
                        IsDeleted = false,
                        PostDate = request.PostDate,
                        Pages = ListOfAssociatedPages,
                        PostDynamicFields = ListOfDynamicFields,
                        UsedAssets = ListOfAssets,
                        CreateUser = ReqUser,
                        EndRepeatAfterDate = request.EndRepeatAfterDate,
                        EndRepeatOption = request.EndRepeatOption,  //EndOccOption,EndDateOption,NoEnd // Those are the values that these can take
                        EndRepeatOnOccurence = request.EndRepeatOnOccurence,
                        EndRepeatPost = request.EndRepeatPost, // This gonna take True or False to specify if the repeat ends or not
                        PostText = request.PostText,
                        Group = PostGroup,
                        IsPosted = false,
                        Post_Occurence = 0,
                        IsTargeted = true,
                        POST_Targeted_AgeRange = Post_AgeRange,
                        POST_Targeted_Gender = Post_Target_Gender,
                        POST_Targeted_Countries = Post_Targeted_Countries,
                        POST_Targeted_Regions = Post_Targeted_Regions,
                        POST_Targeted_Locations = Post_Targeted_Locations,
                        POST_Targeted_Languages = Post_Targeted_Languages,
                        POST_Targeted_Interests = Post_Targeted_Interests,
                        PostMentions = new List<MentionedAccountPost>()

                    };
                    //------------------------------------------Associating the assets to the Post----------------------//
                    //Here we're gonna be itterating through the associated assets
                    foreach (var Asset in request.ListOfAssets)
                    {
                        //AST stands for Asset, a shortcut
                        var AST = await _db.Assets.Where(p => p.Id == (Int64)Convert.ToInt64(Asset.AssetID)).FirstOrDefaultAsync();
                        AssetPost AssetPos = new AssetPost
                        {
                            Post = NewPost,
                            Asset = AST
                        };

                        ListOfAssets.Add(AssetPos);

                        //-----------------------------Here we will be associating the Tags to the AssetPosts---------------------///

                        AssetTagDTO Last_Asset_Tag = null;
                        foreach (AssetTagDTO Asset_Tag in ListOfTags)
                        {                            
                            if (Asset_Tag.Asset_ID == Asset.AssetID)
                            {
                                Last_Asset_Tag = Asset_Tag;
                                break;
                            }
                        }
                        //We test if we found any tags for this asset; if it's null we found none, so no need for progress
                        if(Last_Asset_Tag!=null)
                        {
                            //-------Removing the Asset Tags so that we don't use it again for an asset with the same ID---//
                            ListOfTags.Remove(Last_Asset_Tag);
                            //------------iterating through the tags and creating them----------------//
                            foreach (TagDTO tag in Last_Asset_Tag.Assetags.ToList())
                            {

                                //Getting the Tagged platform acc
                                var PlatformAccount = await _db.PlatformAccounts.Where(p => p.PlatformAccountID == tag.TaggedUserID).FirstOrDefaultAsync();
                                Tag NewTag = new Tag
                                {
                                    App_Screen_x = tag.Screen_x,
                                    App_Screen_y = tag.Screen_y,
                                    App_ScrollLeftValue = tag.ScrollLeftValue,
                                    App_ScrollTopValue = tag.ScrollTopValue,
                                    TaggedImage_X = tag.Tag_X,
                                    TaggedImage_Y = tag.Tag_Y,
                                    TaggedPlatformAccount = PlatformAccount,
                                    TaggedAssetPost = AssetPos
                                };
                                _db.Tags.Add(NewTag);
                            }
                        }
                       
                    }

                    NewPost.UsedAssets = ListOfAssets;
                    //-------------------------------------------Association Ends here---------------------------------//

                    //------------------------------------------Associating the Video to the Post----------------------//

                    foreach (var Video in request.ListOfVideoAssets)
                    {
                        //AST stands for Asset, a shortcut
                        var Vid = await _db.Assets.Where(p => p.Id == (Int64)Convert.ToInt64(Video.Asset_ID)).FirstOrDefaultAsync();

                        if (Video.ThumbnailURL != "No_Thumbnail_Specified")
                        {
                            //=========Case of a video with a thumbnail specified=======//
                            Asset Thumbnail = new Asset
                            {
                                AssetName = "Asset " + Vid.Id + " thumbnail",
                                CreateDate = DateTime.Now,
                                CreateUser = ReqUser,
                                AssetType = "Thumbnail_Image/png",
                                ResourceURL = Video.ThumbnailURL,
                                IsDeleted = false

                            };

                            AssetPost AssetPos = new AssetPost
                            {
                                Post = NewPost,
                                Asset = Vid,
                                Thumbnail = Thumbnail,
                            };
                            ListOfAssets.Add(AssetPos);
                        }
                        else
                        {
                            //=========Case of a video without a thumbnail specified=======//
                            AssetPost AssetPos = new AssetPost
                            {
                                Post = NewPost,
                                Asset = Vid
                            };
                            ListOfAssets.Add(AssetPos);
                        }


                    }

                    NewPost.UsedAssets = ListOfAssets;
                    //-------------------------------------------Association Ends here---------------------------------//


                    //--------------------------NOTE: Adding Mentions to the POST---------------------//

                    //Iterating through the platformaccounts 
                    foreach (var platformaccount in request.ListOfMentionedPlatformAccounts)
                    {
                        var PlatformAccount = await _db.PlatformAccounts.Where(p => p.PlatformAccountID == platformaccount.MentionedPlatformAccount_ID).FirstOrDefaultAsync();
                        MentionedAccountPost NewMention = new MentionedAccountPost
                        {
                            Post = NewPost,
                            Mentioned_PlatformAccount = PlatformAccount
                        };
                        _db.MentionedAccountPost.Add(NewMention);
                        NewPost.PostMentions.Add(NewMention);
                    }
                    
                   

                    //--------------------------NOTE: End Of Adding Mentions to the POST---------------------//


                    _db.Posts.Add(NewPost);
                }  
                _db.SaveChanges();

                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Post_Scheduleded", Result = "Added" });
            }

            catch (InvalidPageID e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Page" });
            }

            catch (PatternIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Pattern" });
            }
            catch (GroupIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Group" });
            }
            
            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:"+ex.Message });
            }

        }





        [HttpPost("EditPost"), Authorize]
        public async Task<ActionResult<string>> EditPost(EditPostDTO request)
        {

            try
            {
                string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(accessToken);

                var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
                var ReqUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();

                var PostGroup = await _db.Groups.Where(p => p.Id == (Int64)Convert.ToInt64(request.PostGroupID)).FirstOrDefaultAsync();

                     var Post = await _db.Posts
                    .Include(p => p.Pages)
                    .Include(p => p.UsedAssets)
                    .ThenInclude(p => p.Asset)
                    .Include(p => p.PostMentions)
                    .Include(p => p.PostDynamicFields)
                    .ThenInclude(p => p.Pattern)
                    .Include(p => p.POST_Targeted_AgeRange)
                    .Include(p => p.POST_Targeted_Countries)
                    .Include(p => p.POST_Targeted_Interests)
                    .Include(p => p.POST_Targeted_Languages)
                    .Include(p => p.POST_Targeted_Regions)
                    .Include(p => p.POST_Targeted_Locations)
                    .Include(p => p.POST_Targeted_Gender)
                    .Where(p => p.Id == (Int64)Convert.ToInt64(request.PostID)).FirstOrDefaultAsync();

                //----------Clearing---------------//

                Post.Pages.Clear();
                List<MentionedAccountPost> Temp_PostMentions = new List<MentionedAccountPost>();
                Temp_PostMentions = Post.PostMentions.ToList();            
                Post.PostMentions.Clear();
                 List<DynamicField> Temp_DynamicFields = new List<DynamicField>();
                Temp_DynamicFields = Post.PostDynamicFields.ToList();
                Post.PostDynamicFields.Clear();
                List<AssetPost> Temp_UsedAssets = new List<AssetPost>();
                Temp_UsedAssets = Post.UsedAssets.ToList();
                Post.UsedAssets.Clear();
                Post.POST_Targeted_Countries.Clear();
                Post.POST_Targeted_Languages.Clear();
                Post.POST_Targeted_Interests.Clear();
                Post.POST_Targeted_Locations.Clear();
                Post.POST_Targeted_Regions.Clear();
                Post.POST_Targeted_AgeRange = null;
                Post.POST_Targeted_Gender = null;
                _db.SaveChanges();

                //Deleting the DB values that's not associated to a POST
                //Removing deleted mentions
                foreach(var mention in Temp_PostMentions)
                {
                    var Mention = await _db.MentionedAccountPost.Where(p => p.Id == (Int64)Convert.ToInt64(mention.Id)).FirstOrDefaultAsync();
                    _db.MentionedAccountPost.Remove(Mention);
                }
                //removing deleted Dynamicfields
                foreach (var dyf in Temp_DynamicFields)
                {
                    var dynamicfield = await _db.DynamicFields.Where(p => p.Id == (Int64)Convert.ToInt64(dyf.Id)).FirstOrDefaultAsync();
                    _db.DynamicFields.Remove(dynamicfield);
                }
                //removing deleted assets
                foreach (var Asset in Temp_UsedAssets)
                {
                    var Asset_Entity = await _db.PostAssets.Where(p => p.Id == (Int64)Convert.ToInt64(Asset.Id)).Include(p=>p.Asset_Tags).FirstOrDefaultAsync();           
                    List<Tag> Temp_Tags = new List<Tag>();
                    Temp_Tags = Asset_Entity.Asset_Tags.ToList();
                    Asset_Entity.Asset_Tags.Clear();
                    _db.PostAssets.Remove(Asset_Entity);
                    foreach(var tag in Temp_Tags)
                    {
                        _db.Tags.Remove(tag);
                    }
                }
                _db.SaveChanges();


                Post = await _db.Posts.Where(p => p.Id == (Int64)Convert.ToInt64(request.PostID)).FirstOrDefaultAsync();

                //throw an exception if no Group in the selection is found
                PostGroup = PostGroup ?? throw new GroupIDInvalid();

                //--------------------------in this part we gonna handle Dynamic field, Assets and Associated Pages for a post----------------------//


                //This contains the list of Platform pages that the post is related to
                List<PlatformPage> ListOfAssociatedPages = new List<PlatformPage> { };

                //This contains the list of the DynamicFields that the post is related to
                List<DynamicField> ListOfDynamicFields = new List<DynamicField> { };

                //This contains the list of the Assets that the post is related to
                List<AssetPost> ListOfAssets = new List<AssetPost> { };

                //This contains the list of the Tags for each Asset
                List<AssetTagDTO> ListOfTags = new List<AssetTagDTO>(request.ListOfTags);

                //reteriving all the related Pages

                foreach (var Page in request.ListOfPages)
                {
                    var PlatformPage = await _db.PlatformPages.Where(p => p.PlatformPageID == (Int64)Convert.ToInt64(Page.PageID) && p.GroupId == (Int64)Convert.ToInt64(request.PostGroupID)).FirstOrDefaultAsync();
                    //throw an exception if no Page ID in the selection is found
                    PlatformPage = PlatformPage ?? throw new InvalidPageID();
                    ListOfAssociatedPages.Add(PlatformPage);
                }

                //retreiving all the Dynamicfields and associating them

                //DF stands for Dynamic FIeld
                foreach (var DF in request.ListOfDynamicFields)
                {
                    //here we itterating through different DynamicFields that uses different Patterns

                    //Getting the pattern for each DF
                    var DFPattern = await _db.Patterns.Where(p => p.Id == (Int64)Convert.ToInt64(DF.PatternID)).FirstOrDefaultAsync();
                    //throw an exception if no pattern found
                    DFPattern = DFPattern ?? throw new PatternIDInvalid();
                    //Getting the dynamic fields values for each page
                    foreach (var DFV in DF.ListOfPagesDynamicFieldValues)
                    {

                        var AssociatedPage = ListOfAssociatedPages.FirstOrDefault(x => x.PlatformPageID == (Int64)Convert.ToInt64(DFV.PageID) && x.GroupId == (Int64)Convert.ToInt64(request.PostGroupID));
                        //throw an exception if no Page ID in the selection is found
                        AssociatedPage = AssociatedPage ?? throw new InvalidPageID();

                        var NewDynamicField = new DynamicField
                        {
                            Pattern = DFPattern,
                            Value = DFV.DynamicFieldValue,
                            PlatformPage = AssociatedPage,
                            PatternId = DFPattern.Id


                        };
                        _db.DynamicFields.Add(NewDynamicField);


                        ListOfDynamicFields.Add(NewDynamicField);


                    }
                }





                //----------------In this part we gonna handle Targetting if it exists----------------------------//

                //Here I will be putting the global Targetting variables that gonna be changed and updated accordingly by the treatment below
                Platform Target_Platform = await _db.Platforms.Where(p => p.Id == (Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                AgeRange Post_AgeRange = null;
                Gender Post_Target_Gender = null;
                List<Country> Post_Targeted_Countries = new List<Country>();
                List<Region> Post_Targeted_Regions = new List<Region>();
                List<Location> Post_Targeted_Locations = new List<Location>();
                List<Language> Post_Targeted_Languages = new List<Language>();
                List<Interest> Post_Targeted_Interests = new List<Interest>();
                //-----Age Targeting Check---///
                //Checking if there is an Age Range if there is the Post_AgeRange is set otherwise it stays Null
                if (request.Target_AgeFrom != "" && request.Target_AgeTo != "")
                {
                    //Test if a similar age range is created

                    var Range = await _db.AgeRanges.Where(p => p.Max_age == request.Target_AgeTo && p.Min_age == request.Target_AgeFrom).FirstOrDefaultAsync();
                    //If Range is found we simply associate it to the post
                    if (Range != null)
                    {
                        Post_AgeRange = Range;
                    }
                    else //if null, we create a new Age Range
                    {
                        var NewRange = new AgeRange
                        {
                            Max_age = request.Target_AgeTo,
                            Min_age = request.Target_AgeFrom
                        };
                        Post_AgeRange = NewRange;
                        _db.AgeRanges.Add(NewRange);
                    }

                }
                //---Gender Targeting Check---//
                //this will get the proper Gender based on the ID "1 for Males only, 2 for females only and 3 for both"
                Post_Target_Gender = await _db.Genders.Where(p => p.Id == (Int64)Convert.ToInt64(request.Target_Gender)).FirstOrDefaultAsync();

                //---Country Targeting Check---//

                if (request.Targeted_Countries.Count() > 0)
                {

                    //itterating through every country
                    foreach (TargetCountryDTO country in request.Targeted_Countries)
                    {
                        //We will be checking, if the country exist, we just associate the instance, if not we create an other one
                        var ctry = await _db.Countries.Where(p => p.Country_PlatformCode == country.Country_PlatformCode && p.Country_PlatformId == (Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                        if (ctry != null)
                        {
                            Post_Targeted_Countries.Add(ctry);
                        }
                        else //Creating new country if no match found
                        {
                            var NewCountry = new Country
                            {
                                Country_Platform = Target_Platform,
                                Country_Key = country.Country_Key,
                                Country_Name = country.Country_Name,
                                Country_PlatformCode = country.Country_PlatformCode

                            };
                            _db.Countries.Add(NewCountry);
                            Post_Targeted_Countries.Add(NewCountry);
                        }

                    }
                }

                //---Region Targeting Check---//

                if (request.Targeted_Regions.Count() > 0)
                {

                    //itterating through every country
                    foreach (TargetRegionDTO Region in request.Targeted_Regions)
                    {
                        //We will be checking, if the country exist, we just associate the instance, if not we create an other one
                        var regiondb = await _db.Regions.Where(p => p.Region_PlatformCode == Region.Region_PlatformCode && p.Region_PlatformId == (Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                        if (regiondb != null)
                        {
                            Post_Targeted_Regions.Add(regiondb);
                        }
                        else //Creating new country if no match found
                        {

                            Country CurrentRegion_Country = null;
                            //Finding the Country that corrspend with the Region
                            foreach (var Country in Post_Targeted_Countries)
                            {
                                if (Country.Country_PlatformCode == Region.Country_PlatformId)
                                {
                                    CurrentRegion_Country = Country; break;
                                }
                            }

                            var NewRegion = new Region
                            {
                                Region_Platform = Target_Platform,
                                Region_Name = Region.Region_Name,
                                Region_Country = CurrentRegion_Country,
                                Region_PlatformCode = Region.Region_PlatformCode
                            };
                            _db.Regions.Add(NewRegion);
                            Post_Targeted_Regions.Add(NewRegion);
                        }

                    }
                }


                //---Location Targeting Check---//

                if (request.Targeted_Locations.Count() > 0)
                {

                    //itterating through every country
                    foreach (TargetLocationDTO Location in request.Targeted_Locations)
                    {
                        //We will be checking, if the country exist, we just associate the instance, if not we create an other one
                        var Locationdb = await _db.Locations.Where(p => p.Location_PlatformCode == Location.Location_PlatformCode && p.Location_PlatformId == (Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                        if (Locationdb != null)
                        {
                            Post_Targeted_Locations.Add(Locationdb);
                        }
                        else //Creating new country if no match found
                        {

                            Region CurrentLocation_Region = null;
                            //Finding the Country that corrspend with the Region
                            foreach (var Region in Post_Targeted_Regions)
                            {
                                if (Location.Location_RegionId == Region.Region_PlatformCode)
                                {
                                    CurrentLocation_Region = Region; break;
                                }
                            }

                            var NewLocation = new Location
                            {
                                Location_Name = Location.Location_Name,
                                Location_Platform = Target_Platform,
                                Location_PlatformCode = Location.Location_PlatformCode,
                                Location_Region = CurrentLocation_Region,
                                Location_Type = Location.Location_Type
                            };
                            _db.Locations.Add(NewLocation);
                            Post_Targeted_Locations.Add(NewLocation);
                        }

                    }
                }


                //---Language Targeting Check---//

                if (request.Targeted_Languages.Count() > 0)
                {

                    //itterating through every country
                    foreach (TargetLanguageDTO Language in request.Targeted_Languages)
                    {
                        //We will be checking, if the country exist, we just associate the instance, if not we create an other one
                        var Languagedb = await _db.Languages.Where(p => p.Language_PlatformKey == Language.LanguagePlatform_Key && p.Language_PlatformId == (Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                        if (Languagedb != null)
                        {
                            Post_Targeted_Languages.Add(Languagedb);
                        }
                        else //Creating new country if no match found
                        {
                            var NewLanguage = new Language
                            {
                                Language_Name = Language.Language_Name,
                                Language_Platform = Target_Platform,
                                Language_PlatformKey = Language.LanguagePlatform_Key
                            };
                            _db.Languages.Add(NewLanguage);
                            Post_Targeted_Languages.Add(NewLanguage);
                        }

                    }
                }


                //---Interest Targeting Check---//

                if (request.Targeted_Interests.Count() > 0)
                {

                    //itterating through every country
                    foreach (TargetInterestDTO Interest in request.Targeted_Interests)
                    {
                        //We will be checking, if the country exist, we just associate the instance, if not we create an other one
                        var InterestDb = await _db.Interests.Where(p => p.Interest_PlatformCode == Interest.Interest_PlatformCode && p.Interest_PlatformId == (Int64)Convert.ToInt64(request.Target_PlatformId)).FirstOrDefaultAsync();

                        if (InterestDb != null)
                        {
                            Post_Targeted_Interests.Add(InterestDb);
                        }
                        else //Creating new country if no match found
                        {
                            var NewInterest = new Interest
                            {
                                Interest_Name = Interest.Interest_Name,
                                Interest_PlatformCode = Interest.Interest_PlatformCode,
                                Interest_Topic = Interest.Interest_Topic,
                                Interest_Description = Interest.Interest_Description,
                                Interest_Platform = Target_Platform
                            };
                            _db.Interests.Add(NewInterest);
                            Post_Targeted_Interests.Add(NewInterest);
                        }

                    }
                }

                //---Associating Targetting with the Post ---//

                //Flag that indicate if the post is targeted or not, will be useful later in the Scheduler Service for better performance
                bool isTargeted = true;

                var AllGendersTargeted = await _db.Genders.Where(p => p.Id == 3).FirstOrDefaultAsync();
                //Here we check if the post is targeted or not, if all the previous fields are empty, then it's not targeted by any mean
                if (Post_AgeRange == null && Post_Target_Gender == AllGendersTargeted && Post_Targeted_Countries.Count == 0 && Post_Targeted_Regions.Count == 0 && Post_Targeted_Locations.Count == 0 && Post_Targeted_Languages.Count == 0 && Post_Targeted_Interests.Count == 0)
                {
                    isTargeted = false;
                }
                //if the post is not targeted we just create a simple post with the isTargetedFlag set to false
                if (!isTargeted)
                {

                        Post.CreateDate = DateTime.Now;
                        Post.RepeatPost = request.RepeatPost;
                        Post.RepeatOption = request.RepeatOption;
                        Post.IsDeleted = false;
                        Post.PostDate = request.PostDate;
                        Post.Pages = ListOfAssociatedPages;
                        Post.PostDynamicFields = ListOfDynamicFields;
                        Post.CreateUser = ReqUser;
                        Post.EndRepeatAfterDate = request.EndRepeatAfterDate;
                        Post.EndRepeatOption = request.EndRepeatOption;
                        Post.EndRepeatOnOccurence = request.EndRepeatOnOccurence;
                        Post.EndRepeatPost = request.EndRepeatPost;
                        Post.PostText = request.PostText;
                        Post.Group = PostGroup;
                        Post.IsPosted = false;
                        Post.Post_Occurence = 0;
                        Post.IsTargeted = false;


                    
                    //------------------------------------------Associating the assets to the Post----------------------//
                    //Here we're gonna be itterating through the associated assets
                    foreach (var Asset in request.ListOfAssets)
                    {
                        //AST stands for Asset, a shortcut
                        var AST = await _db.Assets.Where(p => p.Id == (Int64)Convert.ToInt64(Asset.AssetID)).FirstOrDefaultAsync();
                        AssetPost AssetPos = new AssetPost
                        {
                            Post = Post,
                            Asset = AST
                        };

                        ListOfAssets.Add(AssetPos);

                        //-----------------------------Here we will be associating the Tags to the AssetPosts---------------------///

                        AssetTagDTO Last_Asset_Tag = null;
                        foreach (AssetTagDTO Asset_Tag in ListOfTags)
                        {
                            if (Asset_Tag.Asset_ID == Asset.AssetID)
                            {
                                Last_Asset_Tag = Asset_Tag;
                                break;
                            }
                        }
                        if (Last_Asset_Tag != null)
                        {

                            //-------Removing the Asset Tags so that we don't use it again for an asset with the same ID---//
                            ListOfTags.Remove(Last_Asset_Tag);

                            //------------iterating through the tags and creating them----------------//
                            foreach (TagDTO tag in Last_Asset_Tag.Assetags.ToList())
                            {

                                //Getting the Tagged platform acc
                                var PlatformAccount = await _db.PlatformAccounts.Where(p => p.PlatformAccountID == tag.TaggedUserID).FirstOrDefaultAsync();
                                Tag NewTag = new Tag
                                {
                                    App_Screen_x = tag.Screen_x,
                                    App_Screen_y = tag.Screen_y,
                                    App_ScrollLeftValue = tag.ScrollLeftValue,
                                    App_ScrollTopValue = tag.ScrollTopValue,
                                    TaggedImage_X = tag.Tag_X,
                                    TaggedImage_Y = tag.Tag_Y,
                                    TaggedPlatformAccount = PlatformAccount,
                                    TaggedAssetPost = AssetPos
                                };
                                _db.Tags.Add(NewTag);
                            }
                        }

                    }

                    Post.UsedAssets = ListOfAssets;
                    //-------------------------------------------Association Ends here---------------------------------//



                    //------------------------------------------Associating the Video to the Post----------------------//

                    foreach (var Video in request.ListOfVideoAssets)
                    {
                        //AST stands for Asset, a shortcut
                        var Vid = await _db.Assets.Where(p => p.Id == (Int64)Convert.ToInt64(Video.Asset_ID)).FirstOrDefaultAsync();

                        if (Video.ThumbnailURL != "No_Thumbnail_Specified")
                        {
                            //=========Case of a video with a thumbnail specified=======//
                            Asset Thumbnail = new Asset
                            {
                                AssetName = "Asset " + Vid.Id + " thumbnail",
                                CreateDate = DateTime.Now,
                                CreateUser = ReqUser,
                                AssetType = "Thumbnail_Image/png",
                                ResourceURL = Video.ThumbnailURL,
                                IsDeleted = false

                            };

                            AssetPost AssetPos = new AssetPost
                            {
                                Post = Post,
                                Asset = Vid,
                                Thumbnail = Thumbnail,
                            };
                            ListOfAssets.Add(AssetPos);
                        }
                        else
                        {
                            //=========Case of a video without a thumbnail specified=======//
                            AssetPost AssetPos = new AssetPost
                            {
                                Post = Post,
                                Asset = Vid
                            };
                            ListOfAssets.Add(AssetPos);
                        }


                    }

                    Post.UsedAssets = ListOfAssets;
                    //-------------------------------------------Association Ends here---------------------------------//


                    //--------------------------NOTE: Adding Mentions to the POST---------------------//

                    //Iterating through the platformaccounts 
                    foreach (var platformaccount in request.ListOfMentionedPlatformAccounts)
                    {
                        var PlatformAccount = await _db.PlatformAccounts.Where(p => p.PlatformAccountID == platformaccount.MentionedPlatformAccount_ID).FirstOrDefaultAsync();
                        MentionedAccountPost NewMention = new MentionedAccountPost
                        {
                            Post = Post,
                            Mentioned_PlatformAccount = PlatformAccount
                        };
                        _db.MentionedAccountPost.Add(NewMention);
                        Post.PostMentions.Add(NewMention);
                    }



                    //--------------------------NOTE: End Of Adding Mentions to the POST---------------------//
                    
                }
                //if the Post is targeted with at least one option we do this
                else
                {
                        Post.CreateDate = DateTime.Now; ;
                        Post.CreateDate = DateTime.Now;
                        Post.RepeatPost = request.RepeatPost;
                        Post.RepeatOption = request.RepeatOption;
                        Post.IsDeleted = false;
                        Post.PostDate = request.PostDate;
                        Post.Pages = ListOfAssociatedPages;
                        Post.PostDynamicFields = ListOfDynamicFields;
                        Post.UsedAssets = ListOfAssets;
                        Post.CreateUser = ReqUser;
                        Post.EndRepeatAfterDate = request.EndRepeatAfterDate;
                        Post.EndRepeatOption = request.EndRepeatOption;
                        Post.EndRepeatOnOccurence = request.EndRepeatOnOccurence;
                        Post.EndRepeatPost = request.EndRepeatPost;
                        Post.PostText = request.PostText;
                        Post.Group = PostGroup;
                        Post.IsPosted = false;
                        Post.Post_Occurence = 0;
                        Post.IsTargeted = true;
                        Post.POST_Targeted_AgeRange = Post_AgeRange;
                        Post.POST_Targeted_Gender = Post_Target_Gender;
                        Post.POST_Targeted_Countries = Post_Targeted_Countries;
                        Post.POST_Targeted_Regions = Post_Targeted_Regions;
                        Post.POST_Targeted_Locations = Post_Targeted_Locations;
                        Post.POST_Targeted_Languages = Post_Targeted_Languages;
                        Post.POST_Targeted_Interests = Post_Targeted_Interests;
                        Post.PostMentions = new List<MentionedAccountPost>();



                    //------------------------------------------Associating the assets to the Post----------------------//
                    //Here we're gonna be itterating through the associated assets
                    foreach (var Asset in request.ListOfAssets)
                    {
                        //AST stands for Asset, a shortcut
                        var AST = await _db.Assets.Where(p => p.Id == (Int64)Convert.ToInt64(Asset.AssetID)).FirstOrDefaultAsync();
                        AssetPost AssetPos = new AssetPost
                        {
                            Post = Post,
                            Asset = AST
                        };

                        ListOfAssets.Add(AssetPos);

                        //-----------------------------Here we will be associating the Tags to the AssetPosts---------------------///

                        AssetTagDTO Last_Asset_Tag = null;
                        foreach (AssetTagDTO Asset_Tag in ListOfTags)
                        {
                            if (Asset_Tag.Asset_ID == Asset.AssetID)
                            {
                                Last_Asset_Tag = Asset_Tag;
                                break;
                            }
                        }
                        //We test if we found any tags for this asset; if it's null we found none, so no need for progress
                        if (Last_Asset_Tag != null)
                        {
                            //-------Removing the Asset Tags so that we don't use it again for an asset with the same ID---//
                            ListOfTags.Remove(Last_Asset_Tag);
                            //------------iterating through the tags and creating them----------------//
                            foreach (TagDTO tag in Last_Asset_Tag.Assetags.ToList())
                            {

                                //Getting the Tagged platform acc
                                var PlatformAccount = await _db.PlatformAccounts.Where(p => p.PlatformAccountID == tag.TaggedUserID).FirstOrDefaultAsync();
                                Tag NewTag = new Tag
                                {
                                    App_Screen_x = tag.Screen_x,
                                    App_Screen_y = tag.Screen_y,
                                    App_ScrollLeftValue = tag.ScrollLeftValue,
                                    App_ScrollTopValue = tag.ScrollTopValue,
                                    TaggedImage_X = tag.Tag_X,
                                    TaggedImage_Y = tag.Tag_Y,
                                    TaggedPlatformAccount = PlatformAccount,
                                    TaggedAssetPost = AssetPos
                                };
                                _db.Tags.Add(NewTag);
                            }
                        }

                    }

                    Post.UsedAssets = ListOfAssets;
                    //-------------------------------------------Association Ends here---------------------------------//


                    //------------------------------------------Associating the Video to the Post----------------------//

                    foreach (var Video in request.ListOfVideoAssets)
                    {
                        //AST stands for Asset, a shortcut
                        var Vid = await _db.Assets.Where(p => p.Id == (Int64)Convert.ToInt64(Video.Asset_ID)).FirstOrDefaultAsync();

                        if (Video.ThumbnailURL != "No_Thumbnail_Specified")
                        {
                            //=========Case of a video with a thumbnail specified=======//
                            Asset Thumbnail = new Asset
                            {
                                AssetName = "Asset " + Vid.Id + " thumbnail",
                                CreateDate = DateTime.Now,
                                CreateUser = ReqUser,
                                AssetType = "Thumbnail_Image/png",
                                ResourceURL = Video.ThumbnailURL,
                                IsDeleted = false

                            };

                            AssetPost AssetPos = new AssetPost
                            {
                                Post = Post,
                                Asset = Vid,
                                Thumbnail = Thumbnail,
                            };
                            ListOfAssets.Add(AssetPos);
                        }
                        else
                        {
                            //=========Case of a video without a thumbnail specified=======//
                            AssetPost AssetPos = new AssetPost
                            {
                                Post = Post,
                                Asset = Vid
                            };
                            ListOfAssets.Add(AssetPos);
                        }


                    }

                    Post.UsedAssets = ListOfAssets;
                    //-------------------------------------------Association Ends here---------------------------------//


                    //--------------------------NOTE: Adding Mentions to the POST---------------------//

                    //Iterating through the platformaccounts 
                    foreach (var platformaccount in request.ListOfMentionedPlatformAccounts)
                    {
                        var PlatformAccount = await _db.PlatformAccounts.Where(p => p.PlatformAccountID == platformaccount.MentionedPlatformAccount_ID).FirstOrDefaultAsync();
                        MentionedAccountPost NewMention = new MentionedAccountPost
                        {
                            Post = Post,
                            Mentioned_PlatformAccount = PlatformAccount
                        };
                        _db.MentionedAccountPost.Add(NewMention);
                        Post.PostMentions.Add(NewMention);
                    }



                    //--------------------------NOTE: End Of Adding Mentions to the POST---------------------//


                    
                }
                _db.SaveChanges();

                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Post_Edited", Result = "Edited" });
            }

            catch (InvalidPageID e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Page" });
            }

            catch (PatternIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Pattern" });
            }
            catch (GroupIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Group" });
            }

            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }

        }




        [HttpPost("DeletePost"), Authorize]
        public async Task<ActionResult<string>> DeletePost(DeletePostDTO request)
        {

            try
            {


                string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(accessToken);

                var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
                var ReqUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();

                var Post = await _db.Posts.Where(p => p.Id == (Int64)Convert.ToInt64(request.PostID)).FirstOrDefaultAsync();
                //throw an exception if no Post found
                Post = Post ?? throw new PostIDInvalid();

                Post.IsDeleted = true;
                await _db.SaveChangesAsync();
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Post_Removed", Result ="Success" });
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

        [HttpPost("GetGroupPosts"), Authorize]
        public async Task<ActionResult<string>> GetGroupPosts(GetGroupPostsDTO request)
        {
            try
            {
                string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(accessToken);

                var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
                var ReqUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();
                var Group= await _db.Groups.Where(p => p.Id == (Int64)Convert.ToInt64(request.GroupID)).FirstOrDefaultAsync();
                Group = Group ?? throw new GroupIDInvalid();
                var Posts = await _db.Posts
               .Where(p => p.PostGroupID == (Int64)Convert.ToInt64(request.GroupID))
               .Include(p => p.PostDynamicFields)
               .Include(p => p.Pages)
               .Select(p => new Post {
                   Id = p.Id,
                   RepeatOption = p.RepeatOption,
                   Pages = p.Pages.Select(b => new PlatformPage
                   {
                       PlatformPageID = b.PlatformPageID,
                       CachedData_PageName = b.CachedData_PageName,
                       CachedData_About = b.CachedData_About,
                       CachedData_Bio = b.CachedData_Bio,
                       CachedData_Category = b.CachedData_Category,
                       CachedData_Description = b.CachedData_Description,
                       CachedData_fan_count = b.CachedData_fan_count,
                       CachedData_followers_count = b.CachedData_followers_count,
                       CachedData_LastUpdateDate = b.CachedData_LastUpdateDate,
                       CachedData_Location = b.CachedData_Location,
                       CachedData_PhoneNumber = b.CachedData_PhoneNumber,
                       CachedData_PictureHeight = b.CachedData_PictureHeight,
                       CachedData_PictureIs_silhouette = b.CachedData_PictureIs_silhouette,
                       CachedData_PictureURL = b.CachedData_PictureURL,
                       CachedData_PictureWidth = b.CachedData_PictureWidth,
                       CachedData_WebsiteURL = b.CachedData_WebsiteURL,
                       CachedData_IsChanged = b.CachedData_IsChanged,
                       PlatformID=b.PlatformID,

                   }).ToList(),
                   PostDate = p.PostDate,
                   PostDynamicFields = p.PostDynamicFields,
                   PostGroupID = p.PostGroupID,
                   PostText = p.PostText,
                   Post_Occurence = p.Post_Occurence,
                   EndRepeatPost = p.EndRepeatPost,
                   IsPosted = p.IsPosted,
                   RepeatPost = p.RepeatPost,
                   CreateDate = p.CreateDate,
                   EndRepeatAfterDate = p.EndRepeatAfterDate,
                   EndRepeatOnOccurence = p.EndRepeatOnOccurence,
                   EndRepeatOption = p.EndRepeatOption,
                   IsDeleted = p.IsDeleted,
               })
                    .ToListAsync();
                //throw an exception if no Post found
                Posts = Posts ?? throw new PostIDInvalid();
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Posts_Reterived", Result = Posts });
            }

            catch (PostIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Post ID" });
            }
            catch(GroupIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Group ID" });
            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }



        }

        [HttpPost("GetPostInfoByID")]
        public async Task<ActionResult<string>> GetPostInfoByID(GetPostByIDDTO request)
        {
            try
            {
                /*string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(accessToken);

                var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;*/
                var Post = await _db.Posts
               .Where(p => p.Id== (Int64)Convert.ToInt64(request.PostID))
               .Include(p => p.PostDynamicFields)
               .Include(p => p.Pages)
               .Include(p=>p.POST_Targeted_Gender)              
               .Include(p=>p.POST_Targeted_Countries)
               .Include(p=>p.POST_Targeted_Regions)
               .Include(p => p.POST_Targeted_Locations)
               .Include(p => p.POST_Targeted_Languages)
               .Include(p => p.POST_Targeted_Interests)
               .Include(p => p.POST_Targeted_AgeRange)
               .Include(p => p.UsedAssets).ThenInclude(g=>g.Asset)
               .Include(p => p.UsedAssets).ThenInclude(g => g.Asset_Tags).ThenInclude(b=>b.TaggedPlatformAccount)
               .Include(p => p.UsedAssets).ThenInclude(g => g.Thumbnail)
               .Include(p => p.PostMentions).ThenInclude(p=>p.Mentioned_PlatformAccount)
               .Select(p => new Post
               {
                   UsedAssets= p.UsedAssets,
                   IsTargeted= p.IsTargeted,                 
                   Id = p.Id,
                   RepeatOption = p.RepeatOption,
                   
                   Pages = p.Pages.Select(b=>new PlatformPage
                   {                    
                       Id = b.Id,
                       PlatformPageID = b.PlatformPageID,
                       CachedData_PageName = b.CachedData_PageName,
                       CachedData_About = b.CachedData_About,
                       CachedData_Bio = b.CachedData_Bio,
                       CachedData_Category = b.CachedData_Category,
                       CachedData_Description = b.CachedData_Description,
                       CachedData_fan_count = b.CachedData_fan_count,
                       CachedData_followers_count = b.CachedData_followers_count,
                       CachedData_LastUpdateDate = b.CachedData_LastUpdateDate,
                       CachedData_Location = b.CachedData_Location,
                       CachedData_PhoneNumber = b.CachedData_PhoneNumber,
                       CachedData_PictureHeight = b.CachedData_PictureHeight,
                       CachedData_PictureIs_silhouette = b.CachedData_PictureIs_silhouette,
                       CachedData_PictureURL = b.CachedData_PictureURL,
                       CachedData_PictureWidth = b.CachedData_PictureWidth,
                       CachedData_WebsiteURL = b.CachedData_WebsiteURL,
                       CachedData_IsChanged = b.CachedData_IsChanged,
                       IsDeleted = b.IsDeleted,
                       PlatformID= b.PlatformID,
                   }).ToList(),
                   PostDate = p.PostDate,
                   PostDynamicFields = p.PostDynamicFields,
                   PostGroupID = p.PostGroupID,
                   PostText = p.PostText,
                   Post_Occurence = p.Post_Occurence,
                   EndRepeatPost = p.EndRepeatPost,
                   IsPosted = p.IsPosted,
                   RepeatPost = p.RepeatPost,
                   CreateDate = p.CreateDate,
                   EndRepeatAfterDate = p.EndRepeatAfterDate,
                   EndRepeatOnOccurence = p.EndRepeatOnOccurence,
                   EndRepeatOption = p.EndRepeatOption,
                   IsDeleted = p.IsDeleted,
                   POST_Targeted_AgeRange=p.POST_Targeted_AgeRange,
                   POST_Targeted_Countries=p.POST_Targeted_Countries,
                   PostMentions=p.PostMentions,
                   POST_Targeted_Gender=p.POST_Targeted_Gender,
                   POST_Targeted_Interests= p.POST_Targeted_Interests,
                   POST_Targeted_Languages=p.POST_Targeted_Languages,
                   POST_Targeted_Locations= p.POST_Targeted_Locations,
                   POST_Targeted_Regions = p.POST_Targeted_Regions,
                   
               })
               .FirstOrDefaultAsync();
                //throw an exception if no Post found
                Post = Post ?? throw new PostIDInvalid();
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "PostInfo_Reterived", Result = Post });
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

    }
}
