using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using SocialPostBackEnd.Data;
using SocialPostBackEnd.DTO;
using SocialPostBackEnd.Exceptions;
using SocialPostBackEnd.Models;
using SocialPostBackEnd.Responses;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.RegularExpressions;
using static SocialPostBackEnd.DTO.SearchDTO;

namespace SocialPostBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : Controller
    {
        private readonly ApplicationDbContext _db;
        private static readonly SemaphoreSlim semaphore = new SemaphoreSlim(1);
        public IConfiguration Configuration { get; }
        public SearchController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }


        [HttpPost("SearchFBInterest")]
        public async Task<ActionResult<string>> SearchFBInterest(SearchInterestDTO request)
        {
            await semaphore.WaitAsync();
            try
            {
                /*tring accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                 var handler = new JwtSecurityTokenHandler();
                 var jwtSecurityToken = handler.ReadJwtToken(accessToken);

                 var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;*/

                //We test if the interest already exist in our DB Or not//


                var InterestLocal = await _db.Interests.Where(i => i.Interest_Name.Contains(request.InterestName) && i.Interest_PlatformId == 1).FirstOrDefaultAsync();
                //Case where the interest exist in our DB
                if(InterestLocal!=null)
                {
                    var Same_OldInterestList = await _db.Interests.Where(p => p.Interest_Name.Contains(request.InterestName)).ToListAsync();
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Interests_Reterived", Result = Same_OldInterestList });

                }
                //Case where the interest doesn't exist in our DB
                else
                {
                    //-----------------------NOTE:The Case where the Interest we searching for doesn't Exist--------------------//
                    string fb_App_accesstoken = await GetAppAccessToken();
                    string IntrestsList = await SearchForInterest_Facebook(fb_App_accesstoken, request.InterestName);
                    dynamic IntrestsListObject = JsonConvert.DeserializeObject(IntrestsList);
                    foreach (var obj in IntrestsListObject.data)
                    {
                        string InterestID = obj.id;
                        var interest = await _db.Interests.Where(i => i.Interest_PlatformCode == InterestID && i.Interest_PlatformId == 1).FirstOrDefaultAsync();
                        if (interest == null)
                        {
                            Interest NewInterest = new Interest
                            {
                                Interest_Name = obj.name,
                                Interest_Description = obj.description,
                                Interest_PlatformCode = obj.id,
                                Interest_PlatformId = 1,
                                Interest_Topic = obj.topic,
                            };
                            _db.Interests.Add(NewInterest);
                        }

                    }
                    await _db.SaveChangesAsync();
                    //-----------------------END NOTE--------------------//

                    var interestListAfterUpdate = await _db.Interests.Where(p=>p.Interest_Name.Contains(request.InterestName)).ToListAsync();
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Interests_Reterived", Result = interestListAfterUpdate });

                }            
            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }

            finally
            {
                semaphore.Release();
            }

        }





        [HttpPost("SearchFBCountry")]
        public async Task<ActionResult<string>> SearchFBCountry(SearchCountryDTO request)
        {
            await semaphore.WaitAsync();
            try
            {
                /*tring accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                 var handler = new JwtSecurityTokenHandler();
                 var jwtSecurityToken = handler.ReadJwtToken(accessToken);

                 var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;*/

                //We test if the Country already exist in our DB Or not//


                var InterestLocal = await _db.Countries.Where(i => i.Country_Name.Contains(request.CountryName) && i.Country_PlatformId == 1).FirstOrDefaultAsync();
                //Case where the country exist in our DB
                if (InterestLocal != null)
                {
                    var Same_OldCountriesList = await _db.Countries.Where(c=>c.Country_Name.Contains(request.CountryName)).ToListAsync();
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Countries_Reterived", Result = Same_OldCountriesList });

                }
                //Case where the country doesn't exist in our DB
                else
                {
                    //-----------------------NOTE:The Case where the Countries we searching for doesn't Exist--------------------//
                    string fb_App_accesstoken = await GetAppAccessToken();
                    string IntrestsList = await SearchForCountry_Facebook(fb_App_accesstoken, request.CountryName);
                    dynamic IntrestsListObject = JsonConvert.DeserializeObject(IntrestsList);
                    foreach (var obj in IntrestsListObject.data)
                    {
                        string CountryID = obj.key;
                        var Country = await _db.Countries.Where(i => i.Country_PlatformCode == CountryID && i.Country_PlatformId == 1).FirstOrDefaultAsync();
                        if (Country == null)
                        {
                            Country NewCountry = new Country
                            {
                               Country_Key=obj.key,
                               Country_Name=obj.name,
                               Country_PlatformCode=obj.country_code,
                               Country_PlatformId=1,
                               
                            };
                            _db.Countries.Add(NewCountry);
                        }

                    }
                    await _db.SaveChangesAsync();
                    //-----------------------END NOTE--------------------//

                    var CountriesListAfterUpdate = await _db.Countries.Where(c => c.Country_Name.Contains(request.CountryName)).ToListAsync();
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Countries_Reterived", Result = CountriesListAfterUpdate });

                }
            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }
            finally
            {
                semaphore.Release();
            }


        }



        [HttpPost("SearchFBRegion")]
        public async Task<ActionResult<string>> SearchFBRegion(SearchRegionDTO request)
        {
            await semaphore.WaitAsync();
            try
            {
                /*tring accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                 var handler = new JwtSecurityTokenHandler();
                 var jwtSecurityToken = handler.ReadJwtToken(accessToken);

                 var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;*/

                //We test if the region already exist in our DB Or not//

                List<Region> Response =new List<Region>();

                foreach(var country in request.CountryCodes)
                {

                    var ParentCountry = await _db.Countries.Where(c => c.Country_PlatformCode == country).FirstOrDefaultAsync();
                    //Case the Parent Country Key is  Valid
                    if (ParentCountry != null)
                    {

                        var RegionLocal = await _db.Regions.Where(i => i.Region_Name.Contains(request.RegionName) && i.Region_PlatformId == 1 && i.Region_Country.Country_PlatformCode == country).Include(p => p.Region_Country).FirstOrDefaultAsync();
                        //Case where the region exist in our DB
                        if (RegionLocal != null)
                        {
                            Response.AddRange(await _db.Regions.Where(r => r.Region_Name.Contains(request.RegionName) && r.Region_Country.Country_PlatformCode == country).Include(p => p.Region_Country).ToListAsync());

                        }
                        //Case where the region doesn't exist in our DB
                        else
                        {
                            //-----------------------NOTE:The Case where the Interest we searching for doesn't Exist--------------------//
                            string fb_App_accesstoken = await GetAppAccessToken();
                            string RegionList = await SearchForRegion_Facebook(fb_App_accesstoken, request.RegionName, country);
                            dynamic IntrestsListObject = JsonConvert.DeserializeObject(RegionList);
                            foreach (var obj in IntrestsListObject.data)
                            {
                                string RegionID = obj.key;
                                var Region = await _db.Regions.Where(i => i.Region_PlatformCode == RegionID && i.Region_PlatformId == 1).FirstOrDefaultAsync();
                                if (Region == null)
                                {
                                    Region NewRegion = new Region
                                    {
                                        Region_Country = ParentCountry,
                                        Region_Name = obj.name,
                                        Region_PlatformId = 1,
                                        Region_PlatformCode = obj.key
                                    };
                                    _db.Regions.Add(NewRegion);
                                }

                            }
                            await _db.SaveChangesAsync();
                            //-----------------------END NOTE--------------------//

                            Response.AddRange(await _db.Regions.Where(r => r.Region_Name.Contains(request.RegionName) && r.Region_Country.Country_PlatformCode == country).Include(p => p.Region_Country).ToListAsync());
                           

                        }
                    }
                    //Case the Parent Country Key is Not Valid
                    else
                    {
                        return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid_Country_Key," });
                    }
                }

                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Regions_Reterived", Result = Response });



            }

            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }
            finally
            {
                semaphore.Release();
            }


        }

        
        [HttpPost("SearchFBLocation")]
        public async Task<ActionResult<string>> SearchFBLocation(SearchLocationDTO request)
        {
            await semaphore.WaitAsync();
            try
            {
                /*tring accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                 var handler = new JwtSecurityTokenHandler();
                 var jwtSecurityToken = handler.ReadJwtToken(accessToken);

                 var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;*/

                //We test if the location already exist in our DB Or not//
                List<Location> Response = new List<Location>();

                foreach(var Region in request.RegionCodes)
                {

                    var ParentRegion = await _db.Regions.Where(c => c.Region_PlatformCode == Region).FirstOrDefaultAsync();
                    //Case the Parent Region Key is  Valid
                    if (ParentRegion != null)
                    {

                        var LocationLocal = await _db.Locations.Where(i => i.Location_Name.Contains(request.LocationName) && i.Location_PlatformId == 1 && i.Location_Region.Region_PlatformCode == Region).Include(p => p.Location_Region).FirstOrDefaultAsync();
                        //Case where the Location exist in our DB
                        if (LocationLocal != null)
                        {
                            Response.AddRange(await _db.Locations.Where(r => r.Location_Name.Contains(request.LocationName) && r.Location_Region.Region_PlatformCode == Region).Include(p => p.Location_Region).ToListAsync());
                           

                        }
                        //Case where the Location doesn't exist in our DB
                        else
                        {
                            //-----------------------NOTE:The Case where the Locations we searching for doesn't Exist--------------------//
                            string fb_App_accesstoken = await GetAppAccessToken();
                            string RegionList = await SearchForLocation_Facebook(fb_App_accesstoken, request.LocationName, Region);
                            dynamic LocationsListObject = JsonConvert.DeserializeObject(RegionList);
                            foreach (var obj in LocationsListObject.data)
                            {
                                string LocationID = obj.key;
                                var Location = await _db.Locations.Where(i => i.Location_PlatformCode == LocationID && i.Location_PlatformId == 1).FirstOrDefaultAsync();
                                if (Location == null)
                                {
                                    Location NewLocation = new Location
                                    {
                                        Location_Region = ParentRegion,
                                        Location_PlatformCode = obj.key,
                                        Location_Name = obj.name,
                                        Location_Type = obj.type,
                                        Location_PlatformId = 1
                                    };
                                    _db.Locations.Add(NewLocation);
                                }

                            }
                            await _db.SaveChangesAsync();
                            //-----------------------END NOTE--------------------//

                            Response.AddRange(await _db.Locations.Where(r => r.Location_Name.Contains(request.LocationName) && r.Location_Region.Region_PlatformCode == Region).Include(p => p.Location_Region).ToListAsync());
                            

                        }
                    }
                    //Case the Parent Region Key is Not Valid
                    else
                    {
                        return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid_Region_Key," });
                    }
                }

                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Locations_Reterived", Result = Response });
            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }
            finally
            {
                semaphore.Release();
            }


        }

        //-------------------------------------------NOTE: This Function Gets the App Access token, this will be used to get the app's request limit---------------------------//
        [NonAction]
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

                    throw new Exception($"Failed to upload photo. Status code: {response.StatusCode}");
                }
            }
        }
        //-------------------------------------------END NOTE---------------------------//


        
        //-------------------------------------------NOTE: This Function Searches for an interest using name---------------------------//
        [NonAction]
        public async Task<String?> SearchForInterest_Facebook(string AccessToken,string Interest_Name)
        {
            //Facebook allows 200 request per user, we get the App users and multiply it by 200 to get the requests limit
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                var response = await httpClient.GetAsync($"https://graph.facebook.com/v16.0/search?type=adinterest&q={Interest_Name}&access_token={AccessToken}");
                var responseContent = await response.Content.ReadAsStringAsync();
               
                if (response.IsSuccessStatusCode)
                {

                    return responseContent;
                }
                else
                {

                    throw new Exception($"Failed to upload photo. Status code: {response.StatusCode}");
                }
            }
        }
        //-------------------------------------------END NOTE---------------------------//


        //-------------------------------------------NOTE: This Function Searches for an Countries using name---------------------------//
        [NonAction]
        public async Task<String?> SearchForCountry_Facebook(string AccessToken, string Country_Name)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                var response = await httpClient.GetAsync($"https://graph.facebook.com/v16.0/search?type=adgeolocation&location_types=country&q={Country_Name}&access_token={AccessToken}");
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {

                    return responseContent;
                }
                else
                {

                    throw new Exception($"Failed to upload photo. Status code: {response.StatusCode}");
                }
            }
        }
        //-------------------------------------------END NOTE---------------------------//


        //-------------------------------------------NOTE: This Function Searches for an Countries using name---------------------------//
        [NonAction]
        public async Task<String?> SearchForRegion_Facebook(string AccessToken, string Region_Name,string Country_Code)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                var response = await httpClient.GetAsync($"https://graph.facebook.com/v16.0/search?type=adgeolocation&location_types=region&q={Region_Name}&country_code={Country_Code}&access_token={AccessToken}");
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {

                    return responseContent;
                }
                else
                {

                    throw new Exception($"Failed to upload photo. Status code: {response.StatusCode}");
                }
            }
        }
        //-------------------------------------------END NOTE---------------------------//


        //-------------------------------------------NOTE: This Function Searches for Locations using name---------------------------//
        [NonAction]
        public async Task<String?> SearchForLocation_Facebook(string AccessToken, string Location_Name,string Region_ID)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/");
                var response = await httpClient.GetAsync($"https://graph.facebook.com/v16.0/search?type=adgeolocation&location_types=['city']&region_id={Region_ID}&q={Location_Name}&access_token={AccessToken}");
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {

                    return responseContent;
                }
                else
                {

                    throw new Exception($"Failed to upload photo. Status code: {response.StatusCode}");
                }
            }
        }
        //-------------------------------------------END NOTE---------------------------//


    }
}
