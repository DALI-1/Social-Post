
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

namespace SocialPostBackEnd.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PlatformController : Controller
    {
        private readonly ApplicationDbContext _db;
        public IConfiguration Configuration { get; }
        public PlatformController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }

        [HttpPost("GetAppPlatforms"), Authorize]
        public async Task<ActionResult<string>> GetAppAvailablePlatforms()
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var platformsList = await _db.Platforms.Where(p => p.Id != null).ToListAsync();

            return Ok(new SuccessResponse()
            {
                Result = platformsList,
                StatusCode = "200",
                SuccessCode=" App platforms fetched!"
            });


        }

        [HttpPost("GetTagalePlatformAccounts")]
        public async Task<ActionResult<string>> GetCachedPlatformAccounts()
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var platformsList = await _db.PlatformAccounts.Where(p => p.Id != null &&p.IsDeleted!=true&&p.Is_Tagable==true).ToListAsync();

            return Ok(new SuccessResponse()
            {
                Result = platformsList,
                StatusCode = "200",
                SuccessCode = "TagalePlatformAccounts_fetched!"
            });


        }

        [HttpPost("GetMentionablePlatformAccounts")]
        public async Task<ActionResult<string>> GetMentionablePlatformAccounts()
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var platformsList = await _db.PlatformAccounts.Where(p => p.Id != null && p.IsDeleted != true && p.Is_Mentionable == true).ToListAsync();

            return Ok(new SuccessResponse()
            {
                Result = platformsList,
                StatusCode = "200",
                SuccessCode = "MentionablePlatformAccounts_fetched!"
            });


        }
        [HttpPost("GetAllPlatformAccounts")]
        public async Task<ActionResult<string>> GetAllPlatformAccounts()
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var platformsList = await _db.PlatformAccounts.Where(p => p.Id != null && p.IsDeleted != true).ToListAsync();

            return Ok(new SuccessResponse()
            {
                Result = platformsList,
                StatusCode = "200",
                SuccessCode = "PlatformAccounts_fetched!"
            });


        }



    }
}
