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
    public class PatternController : Controller
    {
        private readonly ApplicationDbContext _db;
        public IConfiguration Configuration { get; }
        public PatternController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }


        [HttpPost("AddPatternToGroup")]
        public async Task<ActionResult<string>> AddPatternToGroup(CreatePatternDTO request)
        {
            
       
            var Group = await _db.Groups.Where(p => p.Id== (long)Convert.ToDouble(request.GroupID)).FirstOrDefaultAsync();
            if(Group==null)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P001", Result = "Group_Doesnt_exist" });
            }
            var Pattern = await _db.Patterns.Where(p => (p.PatternName == request.PatternName || p.PatternText == request.PatternText) && p.GroupId == (long)Convert.ToDouble(request.GroupID)).FirstOrDefaultAsync();
            if (Pattern != null)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "P001", Result = "Pattern_Exist" });
            }
            else
            {

                var NewPattern=new Pattern {  PatternName= request.PatternName, PatternText=request.PatternText,Group=Group};
                _db.Patterns.Add(NewPattern);
                _db.SaveChanges();
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Pattern_Added", Result = "Pattern Added To the Group Successfully:" });
            }

        }

        [HttpPost("DeletePattern"), Authorize]
        public async Task<ActionResult<string>> DeletePost(DeletePatternDTO request)
        {

            try
            {
                string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(accessToken);
                var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
                var ReqUser = await _db.Users.Where(p => p.Id == (Int64)Convert.ToInt64(RequestUserID)).FirstOrDefaultAsync();
                bool UsedPattern = false;
                foreach(var pattern in request.ListOfPatternsToDelete)
                {
                    var Pattern = await _db.Patterns.Where(p => p.Id == (Int64)Convert.ToInt64(pattern.PatternID)).Include(p => p.AssociatedDynamicFields).FirstOrDefaultAsync();
                    //throw an exception if no Pattern found
                    Pattern = Pattern ?? throw new PatternIDInvalid();

                    if (Pattern.AssociatedDynamicFields.Count() == 0)
                    {
                        //here we test if it's a default pattern owned by the root hidden group or not
                        if(Pattern.GroupId==1)
                        {
                            return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO117", Result = "Default_Pattern_CannotBe_Deleted" });
                        }else
                        {
                            _db.Remove(Pattern);
                        }

                        
                       
                    }
                    else
                    {
                        UsedPattern = true;
                        
                    }

                }

                if(UsedPattern)
                {
                    return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Pattern_In_Use" });

                } else
                {
                    await _db.SaveChangesAsync();
                    return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Pattern_Deleted", Result = "Pattern Deleted" });
                }
            }
            catch (PatternIDInvalid e)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Invalid Pattern ID" });
            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }



        }


        [HttpPost("GetGroupPatterns"), Authorize]
        public async Task<ActionResult<string>> GetGroupPatterns(GetGroupPatternsDTO request)
        {

            try
            {
                //here we get the patterns that are specific to the group and the default patterns which are found under the group id 1 (the root)
                var Patterns = await _db.Patterns.Where(p => p.GroupId == (Int64)Convert.ToInt64(request.GroupID)|| p.GroupId==1).ToListAsync();
                return Ok(new SuccessResponse { StatusCode = "200", SuccessCode = "Patterns_Retrieved", Result = Patterns });

            }


            catch (Exception ex)
            {
                return BadRequest(new ErrorResponse { StatusCode = "400", ErrorCode = "PO111", Result = "Unknown Internal Error Has occured, Please contact Dev Team, ERROR:" + ex.Message });
            }



        }
    }
}
