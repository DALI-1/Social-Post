using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient.Server;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using SocialPostBackEnd.Data;
using SocialPostBackEnd.DTO;
using SocialPostBackEnd.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace SocialPostBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController: ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public IConfiguration Configuration { get; }
        public UserController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }



        [HttpPost("RemoveUsers"), Authorize]
        public async Task<ActionResult<string>> AddUsersToGroups(DeleteUsersDTO request)
        {
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
            List<User> ReqUser = _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)).ToList();
            
            var ListOfGroups = new List<Group>();
            var ListOfUsers = new List<User>();
            foreach (string userid in request.UserIDs)
            {

                var u = _db.Users.Where(p => p.Id == (long)Convert.ToDouble(userid) && p.IsDeleted != true)
                    .Include(g => g.JoinedGroups)
                    .FirstOrDefault();
                ListOfUsers.Add(u);
                foreach (Group grp in u.JoinedGroups)
                {
                    
                    ListOfGroups.Add(grp);
                         
                        
                }
            }

           

            foreach (User usr in ListOfUsers)
            {
                usr.IsDeleted = true;
                usr.DeleteDate = DateTime.Now;
                usr.DeleteUser = ReqUser[0];
                foreach (Group grp in ListOfGroups)
                {
                    usr.JoinedGroups.Remove(grp);
                    grp.JoinedUsers.Remove(usr);

                }

            }
            if (!(ListOfUsers.Count() == 0) && !(ListOfGroups.Count() == 0))
            {

                _db.SaveChanges();
                return Ok("{\"UsersDeleted\":\"true\"}");

            }
            else
            {
                return Ok("{\"UserOrGroupsDoesntExist\":\"true\"}");
            }
        }


        [HttpPost("ChangeUserBasicInformations"), Authorize]
        public async Task<ActionResult<string>> ChangeUserBasicInformations(DTO.ChangeUserBasicInformations request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;

            List<String?> ListOfUsedUsernames = _db.Users.Select(u => new User {UserName=u.UserName }.UserName).ToList();
            List<String?> ListOfUsedEmails = _db.Users.Select(u => new User { Email = u.Email }.Email).ToList();
            List<String?> ListOfUsedPhoneNumbers = _db.Users.Select(u => new User { PhoneNumber = u.PhoneNumber }.PhoneNumber).ToList();
            
            List<User>  ListOfUsers = _db.Users.Where(p => p.Id==(long)Convert.ToDouble(RequestUserID)).ToList();
            if(!(ListOfUsers.Count()==0))
            {
                User ModifiedUser = ListOfUsers[0];
                bool UsedEmailFlag = false;
                bool UsedPhoneNumberFlag = false;
                bool UsedUsernameFlag = false;
                //Turn UsedEmailFlag to true if we find the Email
                foreach (string email in ListOfUsedEmails)
                {
                    if (email.Equals(request.Email) && ListOfUsers[0].Email!=request.Email)
                        UsedEmailFlag= true;

                }
                //Turn UsePhoneNumberFlag to true if we find the PhoneNumber
                foreach (string PhoneNumber in ListOfUsedPhoneNumbers)
                {
                    if (PhoneNumber.Equals(request.PhoneNumber) && ListOfUsers[0].PhoneNumber != request.PhoneNumber)
                        UsedPhoneNumberFlag = true;

                }
                //Turn UsernameFlag to true if we find the Username
                foreach (string Username in ListOfUsedUsernames)
                {
                    if (Username.Equals(request.UserName) && ListOfUsers[0].UserName != request.UserName)
                        UsedUsernameFlag = true;

                }


                if (!UsedEmailFlag)
                {
                    if(!UsedUsernameFlag)
                    {
                        if(!UsedPhoneNumberFlag)
                        {
                           
                            ModifiedUser.UserName = request.UserName;
                            ModifiedUser.Email = request.Email;
                            ModifiedUser.BirthdayDate = request.BirthdayDate;
                            ModifiedUser.PhoneNumber = request.PhoneNumber;
                            ModifiedUser.FirstName = request.FirstName;
                            ModifiedUser.LastName = request.LastName;
                            _db.SaveChanges();
                            return Ok("{\"UserInfoUpdated\":\"true\"}");
                        }
                        else
                        {
                            return Ok("{\"PhoneNumberUsed\":\"true\"}");
                        }

                    }
                    else
                    {
                        return Ok("{\"UserNameUsed\":\"true\"}");
                    }
                    
                }
                else

                {
                    return Ok("{\"EmailUsed\":\"true\"}");
                }   

            }
            else
            {
                return Ok("{\"UserDoesntExist\":\"true\"}");
            }
            
        }




        [HttpPost("EDITSLAVEUSERINFO"), Authorize]
        public async Task<ActionResult<string>> EDITSLAVEUSERINFO(EDITSLAVEUSERINFODTO request)
        {
            var RequestUserID = request.UserID;
            List<String?> ListOfUsedUsernames = _db.Users.Select(u => new User { UserName = u.UserName }.UserName).ToList();
            List<String?> ListOfUsedEmails = _db.Users.Select(u => new User { Email = u.Email }.Email).ToList();
            List<String?> ListOfUsedPhoneNumbers = _db.Users.Select(u => new User { PhoneNumber = u.PhoneNumber }.PhoneNumber).ToList();

            List<User> ListOfUsers = _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)).ToList();
            if (!(ListOfUsers.Count() == 0))
            {
                User ModifiedUser = ListOfUsers[0];
                bool UsedEmailFlag = false;
                bool UsedPhoneNumberFlag = false;
                bool UsedUsernameFlag = false;
                //Turn UsedEmailFlag to true if we find the Email
                foreach (string email in ListOfUsedEmails)
                {
                    if (email.Equals(request.Email) && ListOfUsers[0].Email != request.Email)
                        UsedEmailFlag = true;

                }
                //Turn UsePhoneNumberFlag to true if we find the PhoneNumber
                foreach (string PhoneNumber in ListOfUsedPhoneNumbers)
                {
                    if (PhoneNumber.Equals(request.PhoneNumber) && ListOfUsers[0].PhoneNumber != request.PhoneNumber)
                        UsedPhoneNumberFlag = true;

                }
                //Turn UsernameFlag to true if we find the Username
                foreach (string Username in ListOfUsedUsernames)
                {
                    if (Username.Equals(request.UserName) && ListOfUsers[0].UserName != request.UserName)
                        UsedUsernameFlag = true;

                }


                if (!UsedEmailFlag)
                {
                    if (!UsedUsernameFlag)
                    {
                        if (!UsedPhoneNumberFlag)
                        {

                            ModifiedUser.UserName = request.UserName;
                            ModifiedUser.Email = request.Email;
                            ModifiedUser.BirthdayDate = request.BirthdayDate;
                            ModifiedUser.PhoneNumber = request.PhoneNumber;
                            ModifiedUser.FirstName = request.FirstName;
                            ModifiedUser.LastName = request.LastName;
                            _db.SaveChanges();
                            return Ok("{\"UserInfoUpdated\":\"true\"}");
                        }
                        else
                        {
                            return Ok("{\"PhoneNumberUsed\":\"true\"}");
                        }

                    }
                    else
                    {
                        return Ok("{\"UserNameUsed\":\"true\"}");
                    }

                }
                else

                {
                    return Ok("{\"EmailUsed\":\"true\"}");
                }

            }
            else
            {
                return Ok("{\"UserDoesntExist\":\"true\"}");
            }

        }
        [HttpPost("ChangeUserImage"), Authorize]
        public async Task<ActionResult<string>> ChangeUserImage(ChangeUserImageDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;

            List<User> ListOfUsers = _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)).ToList();
            if (!(ListOfUsers.Count() == 0))
            {
                ListOfUsers[0].ProfilePictureURL = request.ProfilePictureURL;
                _db.SaveChanges();
                return Ok("{\"ImageUpdated\":\"true\"}");
            }
            else
            {
                return Ok("{\"UserDoesntExist\":\"true\"}");
            }

        }

        [HttpPost("CreateSlaveUser"), Authorize]
        public async Task<ActionResult<string>> CreateSlaveUser(CreateSlaveUserDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;

            var User = await _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)).FirstOrDefaultAsync();


            List<String?> ListOfUsedUsernames = _db.Users.Select(u => new User { UserName = u.UserName }.UserName).ToList();
            List<String?> ListOfUsedEmails = _db.Users.Select(u => new User { Email = u.Email }.Email).ToList();
            List<String?> ListOfUsedPhoneNumbers = _db.Users.Select(u => new User { PhoneNumber = u.PhoneNumber }.PhoneNumber).ToList();
                bool UsedEmailFlag = false;
                bool UsedPhoneNumberFlag = false;
                bool UsedUsernameFlag = false;             
                if (User!=null)
            {
                //Turn UsedEmailFlag to true if we find the Email
                foreach (string email in ListOfUsedEmails)
                {
                    if (email.Equals(request.Email))
                        UsedEmailFlag = true;

                }
                //Turn UsePhoneNumberFlag to true if we find the PhoneNumber
                foreach (string PhoneNumber in ListOfUsedPhoneNumbers)
                {
                    if (PhoneNumber.Equals(request.PhoneNumber) )
                        UsedPhoneNumberFlag = true;

                }
                //Turn UsernameFlag to true if we find the Username
                foreach (string Username in ListOfUsedUsernames)
                {
                    if (Username.Equals(request.UserName))
                        UsedUsernameFlag = true;

                }

                if (!UsedEmailFlag)
                {
                    if (!UsedUsernameFlag)
                    {
                        if (!UsedPhoneNumberFlag)
                        {
                            if (request.UserGroupsIDs.ToList().Count==0)
                            {
                                return Ok("{\"UserMustbeAssociatedToAGroup\":\"true\"}");
                            }
                            else
                            {
                                 //Creating a  random password for the new slave User
                                const string pool = "abcdefghijklmnopqrstuvwxyz0123456789";
                                var random = new Random();
                                var randomString = new string(Enumerable.Repeat(pool, 8)
                                  .Select(s => s[random.Next(s.Length)]).ToArray());
                                CreatePasswordHash(randomString, out byte[] PasswordHash, out byte[] PasswordSalt);

                                var NewUser = new User
                                {
                                    FirstName = request.FirstName,
                                    LastName = request.LastName,
                                    UserName = request.UserName,
                                    BirthdayDate = request.BirthdayDate,
                                    Email = request.Email,
                                    PhoneNumber = request.PhoneNumber,
                                    Role = "Normal",
                                    JoinedGroups= new List<Group>()
                                    ,IsDeleted=false
                                    ,CreateDate=DateTime.Now
                                    , CreateUser=User
                                    ,PasswordHash=PasswordHash
                                    ,PasswordSalt=PasswordSalt
                                    

                                };


                                foreach ( string GroupID in request.UserGroupsIDs.ToList())
                                {

                                    var Group = await _db.Groups.Where(g => g.Id == (long)Convert.ToDouble(GroupID)).FirstOrDefaultAsync();
                                    
                                    if (Group != null)
                                    {
                                        NewUser.JoinedGroups.Add(Group);
                                    }
                                    else
                                    {
                                        return Ok("{\"GroupDoesntExist\":\"true\"}");
                                    }
                                }
                                try
                                {
                                  await SendEmail(request.Email, User, NewUser, randomString);
                                    _db.Users.Add(NewUser);
                                    _db.SaveChanges();
                                    return Ok("{\"UserCreated\":\"true\"}");
                                }
                                catch
                                {
                                    return Ok("{\"EmailDoesntExist\":\"true\"}");
                                }
                                
                              
                                

                            }

                        }
                        else
                        {
                            return Ok("{\"PhoneNumberUsed\":\"true\"}");
                        }

                    }
                    else
                    {
                        return Ok("{\"UserNameUsed\":\"true\"}");
                    }

                }
                else

                {
                    return Ok("{\"EmailUsed\":\"true\"}");
                }

               

            }
            else
            {
                return Ok("{\"UserDoesntExist\":\"true\"}");
            }

        }

       [HttpPost("GetSlaveUsers"), Authorize]
        public async Task<ActionResult<string>> GetSlaveUser(GetSlaveUsersDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;

            var User = await _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID) && p.IsDeleted != true)
                .Include(g => g.JoinedGroups)
               .ThenInclude(s => s.SubGroups)        
                .FirstOrDefaultAsync();

            var Group = await _db.Groups.Where(p => (p.IsDeleted == false && p.Id == (long)Convert.ToDouble(request.GroupId)))
                .Select(sg1 => new Group
                {
                    Group_Name = sg1.Group_Name,
                    Id = sg1.Id,
                    MenuActions = sg1.MenuActions,
                    ParentGroupId = sg1.ParentGroupId,
                    MenuItems = sg1.MenuItems,
                    IsDeleted = sg1.IsDeleted,

                    SubGroups = sg1.SubGroups.Select(sg2 => new Group
                    {
                        Group_Name = sg2.Group_Name,
                        Id = sg2.Id,
                        MenuActions = sg2.MenuActions,
                        ParentGroupId = sg2.ParentGroupId,
                        IsDeleted = sg2.IsDeleted,
                        SubGroups = sg2.SubGroups.Select(sg3 => new Group
                        {
                            Group_Name = sg3.Group_Name,
                            Id = sg3.Id,
                            MenuActions = sg3.MenuActions,
                            ParentGroupId = sg3.ParentGroupId,
                            IsDeleted = sg3.IsDeleted,
                            SubGroups = sg3.SubGroups.Select(sg4 => new Group
                            {
                                Group_Name = sg4.Group_Name,
                                Id = sg4.Id,
                                MenuActions = sg4.MenuActions,
                                ParentGroupId = sg4.ParentGroupId,
                                IsDeleted = sg4.IsDeleted,
                                SubGroups = sg4.SubGroups.Select(sg5 => new Group
                                {
                                    Group_Name = sg5.Group_Name,
                                    Id = sg5.Id,
                                    MenuActions = sg5.MenuActions,
                                    ParentGroupId = sg5.ParentGroupId,
                                    IsDeleted = sg5.IsDeleted,
                                    SubGroups = sg5.SubGroups.Select(sg6 => new Group
                                    {
                                        Group_Name = sg6.Group_Name,
                                        Id = sg6.Id,
                                        MenuActions = sg6.MenuActions,
                                        ParentGroupId = sg6.ParentGroupId,
                                        IsDeleted = sg6.IsDeleted,
                                        SubGroups = sg6.SubGroups.Select(sg7 => new Group
                                        {
                                            Group_Name = sg7.Group_Name,
                                            Id = sg7.Id,
                                            MenuActions = sg7.MenuActions,
                                            ParentGroupId = sg7.ParentGroupId,
                                            IsDeleted = sg7.IsDeleted,
                                            SubGroups = sg7.SubGroups.Select(sg8 => new Group
                                            {
                                                Group_Name = sg8.Group_Name,
                                                Id = sg8.Id,
                                                MenuActions = sg8.MenuActions,
                                                ParentGroupId = sg8.ParentGroupId,
                                                IsDeleted = sg8.IsDeleted,
                                                SubGroups = sg8.SubGroups.Select(sg9 => new Group
                                                {
                                                    Group_Name = sg9.Group_Name,
                                                    Id = sg9.Id,
                                                    MenuActions = sg9.MenuActions,
                                                    ParentGroupId = sg9.ParentGroupId,
                                                    IsDeleted = sg9.IsDeleted,
                                                    SubGroups = sg9.SubGroups.Select(sg10 => new Group
                                                    {
                                                        Group_Name = sg10.Group_Name,
                                                        Id = sg10.Id,
                                                        MenuActions = sg10.MenuActions,
                                                        ParentGroupId = sg10.ParentGroupId,
                                                        IsDeleted = sg10.IsDeleted,


                                                    }).ToList()
                                                }).ToList()
                                            }).ToList()

                                        }).ToList()
                                    }).ToList()

                                }).ToList()
                            }).ToList()

                        }).ToList()

                    }).ToList()


                })
                .ToListAsync();

            if (User != null)
            {
                var SlaveUsers = await _db.Users.Where(p =>(p.Id!=null &&p.IsDeleted!=true && p.Id!= (long)Convert.ToDouble(RequestUserID))).ToListAsync();
                FilterSlaveForMultipleGroups(SlaveUsers, Group);
                return Ok(SlaveUsers);
            }
            else
            {
                return Ok("{\"UserDoesntExist\":\"true\"}");
            }

        }
        // function is gonna determine if a user is a slave of multiple joined Groups using the verify slave recurssive function
        [NonAction] void FilterSlaveForMultipleGroups(in List<User> slaves,List< Group> JoinedGroups)
        {
            for(int i=0;i<slaves.Count; i++)
            {
                var res = false;
                //Testing of the slave is inside one of the groups that the user is in
                foreach (Group grp in JoinedGroups)
                {

                    var resLocal = VerifySlave(slaves[i].Id,grp);
                    if (resLocal)
                    {
                        res = true;
                    }
                }

                if(res==false)
                {
                    slaves.Remove(slaves.ToList()[i]);
                    i--;
                }
            }
            
          
        }
        //This recursive function is gonna determine if a user is a slave of a group or not
        [NonAction] bool VerifySlave( Int64 slaveID, Group JoinedGroup)
        {
            
                var SlaveUser = _db.Users.Where(p => p.Id == slaveID).Include(g => g.JoinedGroups).FirstOrDefault();
                foreach (Group SlaveGroup in SlaveUser.JoinedGroups)
                {
                    if (SlaveGroup.Id == JoinedGroup.Id)
                    {
                        return true;
                    }

                }
                if(JoinedGroup!=null)
            {
                foreach (var group in JoinedGroup.SubGroups)
                {

                    var res = VerifySlave(slaveID, group);
                    if (res == true)
                        return true;
                }
            }
              
            
           
            return false;
        }
            [HttpGet("GetUserInfo"), Authorize]
        public async Task<ActionResult<string>> GetUserInfo()
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            
            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;

            /*List<User> ListOfUsers = await _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)).Include(u => u.JoinedGroups.Select(
                g => new { g.Id, g.IsDeleted, g.MenuActions, g.Group_Name, g.ParentGroup, g.SubGroups }))

              .ThenInclude(g => g.SubGroups.Select(sg1 => new {sg1.Id,sg1.ParentGroupId,sg1.Group_Name,sg1.MenuActions,sg1.MenuItems,sg1.SubGroups}))

              .ToListAsync();*/

            var User = await _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID) && p.IsDeleted != true)
   .Include(g => g.JoinedGroups)
   .Select(p => new User
   {
       IsDeleted = p.IsDeleted,
       JoinedGroups = p.JoinedGroups.Where(p => p.IsDeleted == false).ToList()
   })
   .FirstOrDefaultAsync();

            if (User.JoinedGroups.Count!=0)
    {

                var ListOfUsers = await _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID) && p.IsDeleted!=true)
         .Include(g => g.JoinedGroups)
            .ThenInclude(s => s.SubGroups)
         .Select(u => new User
         {
             Id = u.Id,
             UserName = u.UserName,
             BirthdayDate = u.BirthdayDate,
              ProfilePictureURL= u.ProfilePictureURL,
               Email= u.Email,
               FirstName = u.FirstName,
               LastName= u.LastName,
                PhoneNumber= u.PhoneNumber,
                Role= u.Role,
             IsDeleted = u.IsDeleted,
             JoinedGroups = u.JoinedGroups.Where(p =>p.IsDeleted != true).Select(sg1 => new Group
             {
                 Group_Name = sg1.Group_Name,
                 Id= sg1.Id,
                  MenuActions= sg1.MenuActions,
                  ParentGroupId= sg1.ParentGroupId,
                  MenuItems=sg1.MenuItems,
                  IsDeleted=sg1.IsDeleted,
                  CreatedUserId=sg1.CreatedUserId,

                 SubGroups = sg1.SubGroups.Where(p => p.IsDeleted != true).Select(sg2 => new Group
                 {
                     Group_Name = sg2.Group_Name,
                     Id = sg2.Id,
                     MenuActions = sg2.MenuActions,
                     ParentGroupId = sg2.ParentGroupId,
                     IsDeleted = sg2.IsDeleted,
                     CreatedUserId = sg2.CreatedUserId,
                     SubGroups = sg2.SubGroups.Where(p => p.IsDeleted != true).Select(sg3 => new Group
                     {
                         Group_Name = sg3.Group_Name,
                         Id = sg3.Id,
                         MenuActions = sg3.MenuActions,
                         ParentGroupId = sg3.ParentGroupId,
                         IsDeleted = sg3.IsDeleted,
                         CreatedUserId = sg3.CreatedUserId,
                         SubGroups = sg3.SubGroups.Where(p => p.IsDeleted != true).Select(sg4 => new Group
                         {
                             Group_Name = sg4.Group_Name,
                             Id = sg4.Id,
                             MenuActions = sg4.MenuActions,
                             ParentGroupId = sg4.ParentGroupId,
                             IsDeleted = sg4.IsDeleted,
                             CreatedUserId = sg4.CreatedUserId,
                             SubGroups = sg4.SubGroups.Where(p => p.IsDeleted != true).Select(sg5 => new Group
                             {
                                 Group_Name = sg5.Group_Name,
                                 Id = sg5.Id,
                                 MenuActions = sg5.MenuActions,
                                 ParentGroupId = sg5.ParentGroupId,
                                 IsDeleted = sg5.IsDeleted,
                                 CreatedUserId = sg5.CreatedUserId,
                                 SubGroups = sg5.SubGroups.Where(p => p.IsDeleted != true).Select(sg6 => new Group
                                 {
                                     Group_Name = sg6.Group_Name,
                                     Id = sg6.Id,
                                     MenuActions = sg6.MenuActions,
                                     ParentGroupId = sg6.ParentGroupId,
                                     IsDeleted = sg6.IsDeleted,
                                     CreatedUserId = sg6.CreatedUserId,
                                     SubGroups = sg6.SubGroups.Where(p => p.IsDeleted != true).Select(sg7 => new Group
                                     {
                                         Group_Name = sg7.Group_Name,
                                         Id = sg7.Id,
                                         MenuActions = sg7.MenuActions,
                                         ParentGroupId = sg7.ParentGroupId,
                                         IsDeleted = sg7.IsDeleted,
                                         CreatedUserId = sg7.CreatedUserId,
                                         SubGroups = sg7.SubGroups.Where(p => p.IsDeleted != true).Select(sg8 => new Group
                                         {
                                             Group_Name = sg8.Group_Name,
                                             Id = sg8.Id,
                                             MenuActions = sg8.MenuActions,
                                             ParentGroupId = sg8.ParentGroupId,
                                             IsDeleted = sg8.IsDeleted,
                                             CreatedUserId = sg8.CreatedUserId,
                                             SubGroups = sg8.SubGroups.Where(p => p.IsDeleted != true).Select(sg9 => new Group
                                             {
                                                 Group_Name = sg9.Group_Name,
                                                 Id = sg9.Id,
                                                 MenuActions = sg9.MenuActions,
                                                 ParentGroupId = sg9.ParentGroupId,
                                                 IsDeleted = sg9.IsDeleted,
                                                 CreatedUserId = sg9.CreatedUserId,
                                                 SubGroups = sg9.SubGroups.Where(p => p.IsDeleted != true).Select(sg10 => new Group
                                                 {
                                                     Group_Name = sg10.Group_Name,
                                                     Id = sg10.Id,
                                                     MenuActions = sg10.MenuActions,
                                                     ParentGroupId = sg10.ParentGroupId,
                                                     IsDeleted = sg10.IsDeleted,
                                                     CreatedUserId = sg10.CreatedUserId


                                                 }).ToList()
                                             }).ToList()
                                         }).ToList()

                                     }).ToList()
                                 }).ToList()

                             }).ToList()
                         }).ToList()

                     }).ToList()

                 }).ToList()



             }).ToList()
         })

         .ToListAsync();



                if (!(ListOfUsers.Count() == 0))
                {


                    RemoveDeletedSubGroups(ListOfUsers[0].JoinedGroups.ToList()[0]);


                    return Ok(ListOfUsers[0]);
                }
                else
                {
                    return Ok("{\"UserDoesntExist\":\"true\"}");
                }

            }
            else
            {
                if( User.IsDeleted==true)
                {
                    return Ok("{\"UserDoesntExist\":\"true\"}");
                }
                else

                {
                       var entity = await _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID) && p.IsDeleted != true)
                    .FirstOrDefaultAsync();
                    entity.IsDeleted = true;
                    entity.DeleteDate = DateTime.Now;
                    await _db.SaveChangesAsync();
                    return Ok("{\"UserExistButNoGroup_deleting\":\"true\"}");
                }
                
            }


        }

        [NonAction]
        void RemoveDeletedSubGroups(in Group grp)
        {
            if (grp.SubGroups==null)
            {
               
                
            }
            else
            {
                for(int i=0;i<grp.SubGroups.Count;i++) 
                {
                   
                    if (grp.SubGroups.ToList()[i].IsDeleted==true)
                    {
                      
                        grp.SubGroups.Remove(grp.SubGroups.ToList()[i]);
                        i--;
                    }
                    else
                    {
                        RemoveDeletedSubGroups(grp.SubGroups.ToList()[i]);
                    }
                    

                }
                
            }

        }
        [HttpPost("GetUserInfoByID"), Authorize]
        public async Task<ActionResult<string>> GetUserInfoByID(GetUserByIDDTO request)
        {
          
            var ListOfUsers = await _db.Users.Where(p => p.Id == (long)Convert.ToDouble(request.UserID) && p.IsDeleted != true)
          .Include(g => g.JoinedGroups)
        
        .Select(u => new User
          {
            Id = u.Id,
            UserName = u.UserName,
            BirthdayDate = u.BirthdayDate,
            ProfilePictureURL = u.ProfilePictureURL,
            Email = u.Email,
            FirstName = u.FirstName,
            LastName = u.LastName,
            PhoneNumber = u.PhoneNumber,
            Role = u.Role,
            IsDeleted = u.IsDeleted,
            JoinedGroups= u.JoinedGroups
            
                      })

         .ToListAsync();



            if (!(ListOfUsers.Count() == 0))
            {
                return Ok(ListOfUsers[0]);
            }
            else
            {
                return Ok("{\"UserDoesntExist\":\"true\"}");
            }
        }


        [HttpPost("AddUsersToGroups"), Authorize]
        public async Task<ActionResult<string>> AddUsersToGroups(AddUsersToGroupsDTO request)
        {
            var ListOfGroups = new List<Group>();
            var ListOfUsers=new List<User>();
            foreach ( string userid in request.UserIDs)
            {
                ListOfUsers.Add(
                     _db.Users.Where(p => p.Id == (long)Convert.ToDouble(userid) && p.IsDeleted != true)
                    .Include(g => g.JoinedGroups)
                    .FirstOrDefault()
                    );
            }

            foreach (string grpid in request.GroupIDs)
            {

                ListOfGroups.Add(
                     _db.Groups.Where(p => p.Id == (long)Convert.ToDouble(grpid) && p.IsDeleted != true)
                     .Include(g => g.JoinedUsers)
                    .FirstOrDefault()
                    );
            }

            foreach(User usr in ListOfUsers)
            {
                foreach(Group grp in ListOfGroups)
                {
                    usr.JoinedGroups.Add(grp);
                    grp.JoinedUsers.Add(usr);

                }

            }
            if (!(ListOfUsers.Count() == 0) && !(ListOfGroups.Count()==0))
            {

                _db.SaveChanges();
                return Ok("{\"UsersMovedToGroups\":\"true\"}");
                
            }
            else
            {
                return Ok("{\"UserOrGroupsDoesntExist\":\"true\"}");
            }
        }



        [HttpPost("RemoveUsersFromGroups"), Authorize]
        public async Task<ActionResult<string>> RemoveUsersFromGroups(RemoveUsersFromGroupsDTO request)
        {
            var ListOfGroups = new List<Group>();
            var ListOfUsers = new List<User>();
            foreach (string userid in request.UserIDs)
            {

                ListOfUsers.Add(
                     _db.Users.Where(p => p.Id == (long)Convert.ToDouble(userid) && p.IsDeleted != true)
                    .Include(g => g.JoinedGroups)
                    .FirstOrDefault()
                    );


            }

            foreach (string grpid in request.GroupIDs)
            {

                ListOfGroups.Add(
                     _db.Groups.Where(p => p.Id == (long)Convert.ToDouble(grpid) && p.IsDeleted != true)
                     .Include(g => g.JoinedUsers)
                    .FirstOrDefault()
                    );
            }

            foreach (User usr in ListOfUsers)
            {
                foreach (Group grp in ListOfGroups)
                {
                    usr.JoinedGroups.Remove(grp);
                    grp.JoinedUsers.Remove(usr);

                }

            }
            if (!(ListOfUsers.Count() == 0) && !(ListOfGroups.Count() == 0))
            {
                _db.SaveChanges();
                return Ok("{\"UsersRemovedFromGroups\":\"true\"}");

            }
            else
            {
                return Ok("{\"UserOrGroupsDoesntExist\":\"true\"}");
            }
        }


        [HttpPost("ChangeUserPass"), Authorize]
        public async Task<ActionResult<string>> ChangeUserPass(ChangePW2DTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;

            List<User> ListOfUsers = _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)).ToList();
            if (!(ListOfUsers.Count() == 0))
            {
                byte[] ConfirmPassHash = null;
                using (var hmac = new HMACSHA512(ListOfUsers[0].PasswordSalt))
                {
                    ConfirmPassHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(request.CPassword));
                }
                
                
                if (ConfirmPassHash.SequenceEqual(ListOfUsers[0].PasswordHash))
                {
                    byte[] NewPWHash;
                    byte[] NewPWSalt;
                    CreatePasswordHash(request.NPassword, out NewPWHash, out NewPWSalt);
                    ListOfUsers[0].PasswordHash= NewPWHash;
                    ListOfUsers[0].PasswordSalt= NewPWSalt;
                    _db.SaveChanges();
                    return Ok("{\"PasswordChanged\":\"true\"}");
                }
                else
                {
                    return Ok("{\"OldPasswordIsWrong\":\"true\"}");
                }
                
                
            }
            else
            {
                return Ok("{\"UserDoesntExist\":\"true\"}");
            }

        }

        [NonAction]
        public void CreatePasswordHash(String Password, out byte[] PasswordHash, out byte[] PasswordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                PasswordSalt = hmac.Key;
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(Password));
            }
        }


        [NonAction]
        public async Task  SendEmail( String Email,  User InvitorUser,User InvitedUser,String RandomlyGeneratedPassword)
        {
            string serviceId = Configuration.GetSection("EmailJSConstants")["serviceId"];
            string templateId = Configuration.GetSection("EmailJSConstants")["templateId"];
            string userId = Configuration.GetSection("EmailJSConstants")["userId"];
            string accessToken = Configuration.GetSection("EmailJSConstants")["accessToken"];
            string emailJSUrl = Configuration.GetSection("EmailJSConstants")["emailJSUrl"];
            var httpClient = new HttpClient();

            string grps = "";
            int i = 0;
                foreach(var grp in InvitedUser.JoinedGroups)
            {
                i++;
                if (i==InvitedUser.JoinedGroups.Count)
                {
                    grps += grp.Group_Name;
                }
                else
                {
                    grps += grp.Group_Name + ",";
                }
                
                
            }
            var parameters = new
            {
                email = Email,
                from_name = InvitorUser.FirstName + "  " + InvitorUser.LastName,
                password = RandomlyGeneratedPassword,
                username = InvitedUser.UserName,
                inviteDate = InvitedUser.CreateDate,
                groups = grps
            };

            var emailJSData = new
            {
                service_id = serviceId,
                template_id = templateId,
                user_id = userId,
                template_params= parameters,
                accessToken= accessToken
            };
            
                var response = await httpClient.PostAsJsonAsync(emailJSUrl, emailJSData);
                
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("------------------------------------Email sent successfully.----------------------------------");
                    
                }else
            
                {
                throw new ArgumentException("EmailUnvalid");
                    
                }
            
               
            
            
            
           
        }




    }



    
}
