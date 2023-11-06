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
using RestSharp;
using Newtonsoft.Json;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace SocialPostBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssetController : Controller
    {
        private readonly ApplicationDbContext _db;
        public IConfiguration Configuration { get; }
        public AssetController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }

        [HttpPost("AddAsset"),Authorize]
        public async Task<ActionResult<string>> AddAssetToGroup(AddAssetDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
            var RequestUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();
            var Group = await _db.Groups.Where(p => p.Id == (long)Convert.ToDouble(request.GroupID)).FirstOrDefaultAsync();

            if (Group == null)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P001", Result = "Group_Doesnt_exist" });
            }
            else
            {

                var NewAsset = new Asset
                { AssetName= request.AssetName,
                AssetType= request.AssetType,
                CreateDate= DateTime.Now,
                CreateUser=RequestUser,
                IsDeleted=false,
                ResourceURL= request.ResourceURL,
                Group = Group };
                _db.Assets.Add(NewAsset);
                _db.SaveChanges();
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Asset_Added", Result = NewAsset });
            }

        }




        [HttpPost("DeleteAsset"), Authorize]
        public async Task<ActionResult<string>> DeletePost(RemoveAssetDTO request)
        {

            try
            {
                string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(accessToken);
                var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
                var ReqUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();

                foreach(var AssetObj in request.ListOfAssets)
                {
                    var Asset = await _db.Assets.Where(p => p.Id == (Int64)Convert.ToInt64(AssetObj.AssetID) && p.IsDeleted == false).FirstOrDefaultAsync();
                    //throw an exception if no Pattern found
                    Asset = Asset ?? throw new AssetIDInvalid();
                    Asset.DeleteUser = ReqUser;
                    Asset.DeleteDate = DateTime.Now;
                    Asset.IsDeleted = true;
                    
                }
                await _db.SaveChangesAsync();
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Asset_Deleted", Result = "Asset Deleted" });
               
            }
            catch (AssetIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Asset ID" });
            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }



        }

        [HttpPost("GetGroupAssets"), Authorize]
        public async Task<ActionResult<string>> GetGroupAssets(GetGroupAssetsDTO request)
        {

            try
            {
                var Assets = await _db.Assets.Where(p => p.GroupId == (Int64)Convert.ToInt64(request.GroupID) &&(p.AssetType== "image/jpeg" || p.AssetType == "image/png" || p.AssetType == "image/webp" || p.AssetType == "image/gif") && p.IsDeleted == false).ToListAsync();
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Assets_Retrieved", Result = Assets });

            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }



        }

        [HttpPost("GetGroupVideoAssets"), Authorize]
        public async Task<ActionResult<string>> GetGroupVideoAssets(GetGroupAssetsDTO request)
        {

            try
            {
                var Assets = await _db.Assets.Where(p => p.GroupId == (Int64)Convert.ToInt64(request.GroupID) && (p.AssetType == "video/mp4" || p.AssetType == "video/quicktime") && p.IsDeleted == false).ToListAsync();
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Assets_Retrieved", Result = Assets });

            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }



        }
        

      /*  [HttpPost("AssignVideoThumbnail"), Authorize]
        public async Task<ActionResult<string>> AssignVideoThumbnail(AssignVideoThumbnail request)
        {

            try
            {
                string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(accessToken);
                var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
                var ReqUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();

                var AssignedVideo = await _db.Assets.Where(p => p.Id == (Int64)Convert.ToInt64(request.VideoID)).FirstOrDefaultAsync();

                Asset ThubmnailAsset = new Asset
                {
                    AssetName = "Video " + AssignedVideo.Id.ToString()+" Thumbnail",
                    CreateDate = DateTime.Now,
                    CreateUser = ReqUser,
                    AssetType = "Thumbnail Image",
                    ResourceURL=request.ThumbnailURL


                };

                AssignedVideo.Thumbnail = ThubmnailAsset;

                _db.SaveChanges();


                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Thumbnail_Saved", Result = "Completed" });

            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }



        }*/





    }
}


