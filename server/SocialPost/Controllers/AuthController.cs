using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SocialPostBackEnd.Data;
using SocialPostBackEnd.Models;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mime;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;

namespace SocialPostBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public AuthController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }
        public IConfiguration Configuration { get; }

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(DTO.RegisterDTO request)
        {
            
            Boolean UserExist = false;
            //Fetching all users and checking if one has the same username, UserExist Flag is true if the name exist
            List<User> ListOfUsers=_db.Users.ToList<User>();

            foreach(User user in ListOfUsers)
            {
                if(user.UserName.Equals(request.UserName))
                {
                    UserExist = true;
                }
            }

            if(!UserExist)
            {
                List<Group> ListOfGroupsWithTheSameGRPName = _db.Groups.Where(g => g.Group_Name == request.CampaignName).ToList();
                List<User> ListOfUsersWithTheSameEmail = _db.Users.Where(p => p.Email == request.Email).ToList();
                List<User> ListOfUsersWithTheSamePhoneNumber = _db.Users.Where(p => p.PhoneNumber == request.PhoneNumber).ToList();
                if (ListOfGroupsWithTheSameGRPName.Count==0)

                {
                    if (ListOfUsersWithTheSameEmail.Count == 0)
                    {
                        if (ListOfUsersWithTheSamePhoneNumber.Count == 0)
                        {
                            //Creating a User Object if the number, email and the username is not the same as the requested one
                                CreatePasswordHash(request.Password, out byte[] PasswordHash, out byte[] PasswordSalt);
                            User User = new User
                            {
                                UserName = request.UserName,

                                FirstName = request.FirstName,
                                LastName = request.LastName,
                                BirthdayDate = request.BirthdayDate,
                                Role = "Normal",
                                PasswordHash = PasswordHash,
                                PasswordSalt = PasswordSalt,
                                Email = request.Email,
                                PhoneNumber = request.PhoneNumber,
                                IsDeleted=false,
                                CreateDate= DateTime.Now,

                            };
                            _db.Users.Add(User);
                                
                
                                    List<Group> ListOfGroups = _db.Groups.Where(g=>g.Group_Name!=null).ToList();
                                    List<MenuItem> ListOfMenuItems = null;
                                    List<MenuItemAction> Actions = new List<MenuItemAction>();
                                    Group RootGroup = null;
                            if (ListOfGroups.Count == 0)
                            {
                                
                                //Creating the Root Group if no group exist

                                RootGroup = new Group();
                                RootGroup.CreateDate = DateTime.Now;
                                RootGroup.Group_Name = "Root";
                                RootGroup.CreatedUserId = null;
                                RootGroup.RecentModificationDate = DateTime.Now;
                                RootGroup.IsDeleted = false;
                                RootGroup.DeleteDate = null;
                                RootGroup.DeleteUserId = null;
                                RootGroup.JoinedUsers= null;
                                RootGroup.ParentGroupId = null;
                                //Creating the Menu Items that our App have !DEVELOPER! : If you're adding a feature that creates a new menuItem..
                                //.. Make sure to add your MenuItem here with the Control URL, Name and all.
                                List<String> MenuItemNames = new List<String>
                                {
                                    "Group Management","User Management","Page Management", "Publish Management"
                                };
                                List<String> MenuItemLabel = new List<String>
                                {
                                    "Group Management label ","User Management label","Page Management label", "Publish Management label"
                                };
                                List<String> MenuItemURLs = new List<String>
                                {
                                    "Group/","User/","Page/", "Publish/"
                                };


                                //IF YOU WANT TO ADD MORE PAGES TYPE, ADD THEM HERE

                                List<String> PlatformNames = new List<String>
                                {
                                    "Facebook","Instagram"
                                };
                                List<String> PlatformsImageUrls = new List<String>
                                {
                                    "https://firebasestorage.googleapis.com/v0/b/socialpost-58454.appspot.com/o/PlatformsLogo%2FFacebook-logo.png?alt=media&token=63432642-202b-46f8-8c36-bea3d9995650",
                                    "https://firebasestorage.googleapis.com/v0/b/socialpost-58454.appspot.com/o/PlatformsLogo%2FInstagram_logo_2016.svg.webp?alt=media&token=47c86867-fdfc-4608-97c4-591ecdc446af"
                                };
                                List<String> PlatformsPolicyUrls = new List<String>
                                {
                                    "PolicyURL1","PolicyURL2"
                                };

                                List<String> PlatformsUrl = new List<String>
                                {
                                    "https://www.facebook.com/",
                                    "https://www.instagram.com/"
                                };


                                //Creating Platforms for the first time
                                for(int i=0;i<PlatformNames.Count;i++)
                                {
                                    Platform newplat = new Platform()
                                    {
                                        PlatformLogoImageUrl = PlatformsImageUrls[i],
                                        PlatformName = PlatformNames[i],
                                        PlatformPolicyUrl = PlatformsPolicyUrls[i],
                                        PlatformUrl = PlatformsUrl[i]

                                    };
                                    _db.Platforms.Add(newplat);
                                }


                                //Creating GenderOptions for Targeting for the first time
                                Gender Male = new Gender
                                {
                                    Gender_Name = "Target_Males_ONLY"
                                };
                                Gender Female = new Gender
                                {
                                    Gender_Name = "Target_Females_ONLY"
                                };
                                Gender Both = new Gender
                                {
                                    Gender_Name = "Target_Both"
                                };

                                _db.Genders.Add(Male);
                                _db.Genders.Add(Female);
                                _db.Genders.Add(Both);

                                //Creating Default Patterns
                                Pattern DefaultNamePattern = new Pattern
                                {
                                    PatternName = "Name",
                                    PatternText="//NAME//",
                                    Group = RootGroup
                                };
                                Pattern DefaultWebsitePattern = new Pattern
                                {
                                    PatternName = "Website",
                                    PatternText = "//WEBSITE//",
                                    Group = RootGroup

                                };
                                Pattern DefaultLocationPattern = new Pattern
                                {
                                    PatternName = "Location",
                                    PatternText = "//LOCATION//",
                                    Group = RootGroup
                                };
                                Pattern DefaultPhoneNumberPattern = new Pattern
                                {
                                    PatternName = "PhoneNumber",
                                    PatternText = "//PHONENUMBER//",
                                    Group= RootGroup
                                };
                                _db.Patterns.Add(DefaultNamePattern);
                                _db.Patterns.Add(DefaultWebsitePattern);
                                _db.Patterns.Add(DefaultLocationPattern);
                                _db.Patterns.Add(DefaultPhoneNumberPattern);

                                ListOfMenuItems = new List<MenuItem>();

                                // Just add ur menuitem to the string and it will be added automatically
                                for(int i=0;i<MenuItemNames.Count;i++)
                                {
                                    MenuItem menuItem = new MenuItem()
                                    {
                                        MenuItemName = MenuItemNames[i],
                                        Label = MenuItemLabel[i],
                                        URL = MenuItemURLs[i],
                                       
                                    };
                                   
                                    ListOfMenuItems.Add(menuItem);
                                }
                                //Adding All the Menu Items
                                foreach (MenuItem mi in ListOfMenuItems)
                                {
                                    _db.MenuItems.Add(mi);
                                }

                                //Create for each Menu's menuItemAction
                                
                                List<string> ListOfPossibleActions = new List<string>()
                                {
                                    "Add","Edit","Delete"
                                };

                                foreach (MenuItem mi in ListOfMenuItems)
                                {
                                    foreach (string Action in ListOfPossibleActions)
                                    {
                                        MenuItemAction mia = new MenuItemAction()
                                        {
                                            ActionName = Action,
                                            MenuItem = mi
                                        };

                                        Actions.Add(mia);     
                                       _db.MenuItemActions.Add(mia);
                                    }

                                }
                               
                                //Assigning the Root Group all the menu items
                                RootGroup.MenuItems = ListOfMenuItems;
                                RootGroup.MenuActions= Actions;
                                _db.Groups.Add(RootGroup);


                                
                            }
                            // Test if it's the first time running the app, if it is? we load the MenuItems object that was added
                            // Else? we made a call to the Db to fetch the list of MenuItems
                            
                            if (ListOfGroups.Count > 0)
                            { RootGroup = _db.Groups.Where(p => p.Group_Name == "Root").ToList()[0];                            
                                ListOfMenuItems = _db.MenuItems.Where(p => p.MenuItemName != null).ToList();
                                Actions = _db.MenuItemActions.Where(p => p.Id!= null).ToList();
                            }
                            
                            
                                
                            
                            
                            //creating a group for a new user under ROOT
                            Group grp = new Group();
                                grp.Group_Name = request.CampaignName;
                                grp.CreateDate = DateTime.Now;
                                grp.CreateUser = User;
                                grp.RecentModificationDate = DateTime.Now;
                                grp.IsDeleted = false;
                                grp.DeleteDate = null;
                                grp.DeleteUser = null;
                                grp.JoinedUsers = new List<User>
                                    {
                                        User
                                    };
                                grp.ParentGroup = RootGroup;
                                //Adding All the MenuItems that the user can see
                                grp.MenuItems = ListOfMenuItems;
                               
                                //Adding All the Menuitem rights to the Group
                                 grp.MenuActions = Actions;
                             
                                //Logging the create modification to the Group
                                GroupModification creategm=new GroupModification();
                                creategm.Group = grp;
                                creategm.ModificationLabel = "Group Created";
                                creategm.ModificationDate= DateTime.Now;
                                creategm.User = User;
                                    _db.Groups.Add(grp);
                                _db.GroupModifications.Add(creategm);
                                    _db.SaveChanges();
                            
                                return Ok(User);
                        }
                        else
                        {
                            return Ok("{\"PhoneNumberUsed\":\"true\"}");
                        }
                    }
                    else
                    {
                        return Ok("{\"EmailUsed\":\"true\"}");
                    }   
                }
                else
                {
                    return Ok("{\"GroupNameExist\":\"true\"}");
                }
            }
            else
            {
                return Ok("{\"UsernameExist\":\"true\"}");
            }
            

        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(DTO.LoginDTO request)
        {

            Boolean UserExist = false;
            User User = new User();
            List<User> ListOfUsers = _db.Users.Where(u=>u.IsDeleted==false).ToList<User>();

            foreach (User user in ListOfUsers)
            {
                if (user.UserName.Equals(request.UserName))
                {
                    UserExist = true;
                    User = user;
                }
            }

            if (User.UserName!=request.UserName)
            {
                return Ok("{\"UserNotFound\":\"true\"}");
            }
            if(!VerifyPasswordHash(request.Password,User.PasswordHash,User.PasswordSalt))
            {
                return Ok("{\"WrongPassword\":\"true\"}");
            }

            string token = CreateToken(User);
           
            _db.SaveChanges();
            
            return Ok("{\"JWT_AccessToken\":\""+token+"\"}");
        }



        [HttpPost("ForgotPW")]
        public async Task<ActionResult<string>> ForgetPassword(DTO.ForgetPWDTO request)
        {
            
            List<User> lu = _db.Users.Where(p => p.Email == request.Email &&p.IsDeleted==false).ToList();
            
            if(lu.Count>0)
            {
                String token = CreatePWRestToken(lu[0]);
                return Ok(new { token, lu[0].Email });
            }
            else
            {
                return Ok("{\"UserNotFound\":\"true\"}");
            }
        }

        [HttpPost("ChangePW"),Authorize]
        public async Task<ActionResult<string>> ChangePassword(DTO.ChangePWDTO request)
        {
            User u = _db.Users.Where(p => p.Email == request.Email && p.IsDeleted==false).ToList()[0];
            if(u!=null)
            {
                CreatePasswordHash(request.Password, out byte[] PasswordHash, out byte[] PasswordSalt);
                u.PasswordSalt = PasswordSalt;
                u.PasswordHash = PasswordHash;
                
                _db.SaveChanges();
                return Ok("{\"PasswordChanged\":\"true\"}");
            }
            else
            {
                return Ok("{\"UserNotFound\":\"true\"}");
            }
           

        }

        [HttpPost("VerifyToken"), Authorize]
        public async Task<ActionResult<string>> VerifyToken()
        {
            return Ok("{\"TokenValidated\":\"true\"}");
        }
        [NonAction]
        public void CreatePasswordHash (String Password, out byte[] PasswordHash, out byte[] PasswordSalt)
        {
            using (var hmac=new HMACSHA512())
            {
                PasswordSalt = hmac.Key;
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(Password));
            }
        }
        [NonAction]
        private bool VerifyPasswordHash(string Password, byte[] PasswordHash, byte[] PasswordSalt)
        {
            using (var hmac=new HMACSHA512(PasswordSalt))
            {
                var computedHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(Password));
                return computedHash.SequenceEqual(PasswordHash);
            }
            
        }
        [NonAction]
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
               new Claim(ClaimTypes.Name,user.UserName),
                new Claim(ClaimTypes.Role,user.Role),
                new Claim(ClaimTypes.Actor,user.Id.ToString()),

            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(6),
                signingCredentials:cred
                ) ;
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        [NonAction]
        private string CreatePWRestToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,user.UserName),
                new Claim(ClaimTypes.Role,user.Role),
                new Claim(ClaimTypes.Actor,user.Id.ToString()),
                 


            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: cred
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}
