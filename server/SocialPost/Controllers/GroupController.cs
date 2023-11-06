using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using SocialPostBackEnd.Data;
using SocialPostBackEnd.DTO;
using SocialPostBackEnd.Models;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SocialPostBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {

        private readonly ApplicationDbContext _db;
        public IConfiguration Configuration { get; }
        public GroupController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }

        [HttpPost("CreateSubGroup"), Authorize]
        public async Task<ActionResult<string>> CreateGroup(CreateGroupDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
            var ParentGroup = await _db.Groups.Where(g => g.Id == (long)Convert.ToDouble(request.ParentGroupId)).ToListAsync();

            var RequestUser =  _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)).ToList()[0];
            if (ParentGroup.Count == 1) {
                if (request.SubGroupActions.Count > 0)
                {


                    bool ChildHasTheSameName = false;
                    var Groupchilds = _db.Groups.Where(g => g.ParentGroupId == (long)Convert.ToDouble(request.ParentGroupId)).ToList();
                    foreach (Group grp in Groupchilds)
                    {

                        if (grp.Group_Name.ToLower().Equals(request.GroupName.ToLower()))
                        {
                            ChildHasTheSameName = true;
                            break;
                        }
                    }
                    if (ChildHasTheSameName)
                    {
                        return Ok("{\"SubGroupNameAlreadyUsed\":\"true\"}");
                    }
                    else
                    {
                        Group newSubGroup = new Group();

                        newSubGroup.Group_Name = request.GroupName;
                        newSubGroup.ParentGroup = ParentGroup[0];
                        newSubGroup.CreateUser = RequestUser;
                        newSubGroup.CreateDate = DateTime.Now;
                        newSubGroup.IsDeleted = false;
                        newSubGroup.RecentModificationDate = DateTime.Now;
                        newSubGroup.MenuActions = new List<Models.MenuItemAction>();
                        //This list contains the menuitems that this SubGroup can see
                        var AllowedMenuItems = new List<Models.MenuItem>();
                        //Associating the menuitem actions to the new SubGroup

                        foreach (DTO.MenuItemAction mia in request.SubGroupActions)
                        {

                            //{ We're gonna search if the menuitem already saved in our allowedMenuitems,if we added it already, we dont add it, else? we add it
                            bool MenuItemFound = false;
                            foreach (MenuItem mi in AllowedMenuItems)
                            {

                                if (mi.Id == (long)Convert.ToDouble(mia.MenuItemId))
                                {
                                    MenuItemFound = true; break;
                                }
                            }
                            var MenuItem = _db.MenuItems.Where(mi => mi.Id == (long)Convert.ToDouble(mia.MenuItemId)).ToList()[0];
                            if (MenuItemFound == false)
                            {
                                AllowedMenuItems.Add(MenuItem);
                            }

                            // }

                            Models.MenuItemAction MenuActionitem = _db.MenuItemActions.Where(g => g.Id == (long)Convert.ToDouble(mia.Id)).ToList()[0];

                            newSubGroup.MenuActions.Add(MenuActionitem);
                        }


                        newSubGroup.MenuItems = AllowedMenuItems;


                        GroupModification creategm = new GroupModification();
                        creategm.Group = newSubGroup;
                        creategm.ModificationLabel = "Group Created";
                        creategm.ModificationDate = DateTime.Now;
                        creategm.User = RequestUser;
                        _db.GroupModifications.Add(creategm);

                        _db.Groups.Add(newSubGroup);

                        _db.SaveChanges();
                        return Ok("{\"SubGroupCreated\":\"true\"}");
                    }
                }
                else
                {
                    return Ok("{\"CANNOTCREATEGROUPWITHOUTACTIONS\":\"true\"}");
                }

            }
            else
            {
                return Ok("{\"ParentGroupDoesntExist\":\"true\"}");
            }


        }
        [HttpPost("GetGroupInfo"), Authorize]
        public async Task<ActionResult<string>> GetGroupInfo(GetGroupInfoDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
            var Group = _db.Groups.Where(g => g.Id == (long)Convert.ToDouble(request.GroupId))
                 .Include(u => u.MenuItems)
                 .Include(u => u.MenuActions)
                 .Include(u => u.SubGroups)
                .ToList();

            return (Ok(Group));


        }


        [HttpPost("MoveGroup"), Authorize]
        public async Task<ActionResult<string>> MoveGroup(MoveGroupDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
            var ParentGroup = _db.Groups.Where(g => g.Id == (long)Convert.ToDouble(request.ParentGroupId)).ToList();
            var Group = _db.Groups.Where(g => g.Id == (long)Convert.ToDouble(request.GroupId))
                .Include(g => g.MenuActions)

                .ToList();
            var RequestUser = _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)).ToList()[0];
            var MenuActions = _db.MenuItemActions.Where(g => g.Id != null).Include(g => g.PermitedMenuItemActionGroups).ToList();

            var MenuItem = _db.MenuItems.Where(g => g.Id != null).Include(g => g.MenuItemGroups).ToList();

            if (ParentGroup.Count == 1)
            {
                if (request.NewSubGroupActions.Count > 0)
                {

                    if (Group.Count > 0)
                    {
                        if (Group[0].Id != ParentGroup[0].Id)
                        {
                            if (!VerifyThatTheDestIsAChild(request.ParentGroupId, Group[0]))
                            {
                                Group[0].ParentGroup = ParentGroup[0];

                                List<Models.MenuItemAction> newactions = new List<Models.MenuItemAction>();
                                var AllowedMenuItems = new List<Models.MenuItem>();

                                foreach (DTO.MenuItemAction mia in request.NewSubGroupActions)
                                {

                                    //{ We're gonna search if the menuitem already saved in our allowedMenuitems,if we added it already, we dont add it, else? we add it
                                    bool MenuItemFound = false;
                                    foreach (MenuItem mi in AllowedMenuItems)
                                    {

                                        if (mi.Id == (long)Convert.ToDouble(mia.MenuItemId))
                                        {
                                            MenuItemFound = true; break;
                                        }
                                    }
                                    var MenuItem1 = _db.MenuItems.Where(mi => mi.Id == (long)Convert.ToDouble(mia.MenuItemId)).ToList()[0];
                                    if (MenuItemFound == false)
                                    {
                                        AllowedMenuItems.Add(MenuItem1);
                                    }

                                    // }

                                    Models.MenuItemAction MenuActionitem = _db.MenuItemActions.Where(g => g.Id == (long)Convert.ToDouble(mia.Id)).ToList()[0];

                                    newactions.Add(MenuActionitem);
                                }

                                //removing the old menuitem and menu item actions from the group
                                foreach (Models.MenuItemAction action in Group[0].MenuActions)
                                {
                                    Group[0].MenuActions.Remove(action);
                                }
                                foreach (Models.MenuItemAction mia in MenuActions)
                                {
                                    mia.PermitedMenuItemActionGroups.Remove(Group[0]);
                                }

                                foreach (MenuItem MI in Group[0].MenuItems)
                                {
                                    Group[0].MenuItems.Remove(MI);
                                }
                                foreach (MenuItem MI in MenuItem)
                                {
                                    MI.MenuItemGroups.Remove(Group[0]);
                                }
                                _db.SaveChanges();
                                Group[0].MenuActions = newactions;
                                Group[0].MenuItems = AllowedMenuItems;
                                 //Logging the changes
                                GroupModification creategm = new GroupModification();
                                creategm.Group = Group[0];
                                creategm.ModificationLabel = "Group Moved!";
                                creategm.ModificationDate = DateTime.Now;
                                creategm.User = RequestUser;
                                _db.GroupModifications.Add(creategm);
                                _db.SaveChanges();
                            }
                            else
                            {
                                return Ok("{\"GROUPMOVEDUNDERHISOWNCHILD\":\"true\"}");
                            }
                            return Ok("{\"GROUPMOVED\":\"true\"}");
                        }
                        else
                        {
                            return Ok("{\"DESTINATIONISTHESELECTEDGROUP\":\"true\"}");
                        }
                    }
                    else
                    {
                        return Ok("{\"SELECTEDGROUPDOESNTEXIST\":\"true\"}");
                    }


                }
                else
                {
                    return Ok("{\"CANNOTCREATEGROUPWITHOUTACTIONS\":\"true\"}");
                }
            }
            else
            {
                return Ok("{\"ParentGroupDoesntExist\":\"true\"}");
            }
        }

        //This recurssive function verifies if the group we want to move under is already a child of that group
        [NonAction]
        bool VerifyThatTheDestIsAChild(in string DestGRPId, in Group GRP)
        {
            var res = false;
            if (GRP.SubGroups == null)
            {
                return false;
            }
            if (GRP.Id.ToString() == DestGRPId)
            { return true; }

            else
            {
                foreach (Group g in GRP.SubGroups)
                {
                    if (VerifyThatTheDestIsAChild(DestGRPId, g))
                    { res = true;
                        break; }
                }

            }
            return res;
        }
        [HttpPost("ChangePermission"), Authorize]
        public async Task<ActionResult<string>> ChangePermission(ChangePermissionDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;

            var Group = _db.Groups.Where(g => g.Id == (long)Convert.ToDouble(request.GroupId))

                .ToList();

            var MenuActions = _db.MenuItemActions.Where(g => g.Id != null).Include(g => g.PermitedMenuItemActionGroups).ToList();

            var MenuItem = _db.MenuItems.Where(g => g.Id != null).Include(g => g.MenuItemGroups).ToList();
            var RequestUser = _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)).ToList()[0];

            if (request.NewSubGroupActions.Count > 0)
            {

                if (Group.Count > 0)
                {


                    List<Models.MenuItemAction> newactions = new List<Models.MenuItemAction>();
                    var AllowedMenuItems = new List<Models.MenuItem>();

                    foreach (DTO.MenuItemAction mia in request.NewSubGroupActions)
                    {

                        //{ We're gonna search if the menuitem already saved in our allowedMenuitems,if we added it already, we dont add it, else? we add it
                        bool MenuItemFound = false;
                        foreach (MenuItem mi in AllowedMenuItems)
                        {

                            if (mi.Id == (long)Convert.ToDouble(mia.MenuItemId))
                            {
                                MenuItemFound = true; break;
                            }
                        }
                        var MenuItem1 = _db.MenuItems.Where(mi => mi.Id == (long)Convert.ToDouble(mia.MenuItemId)).ToList()[0];
                        if (MenuItemFound == false)
                        {
                            AllowedMenuItems.Add(MenuItem1);
                        }

                        // }

                        Models.MenuItemAction MenuActionitem = _db.MenuItemActions.Where(g => g.Id == (long)Convert.ToDouble(mia.Id)).ToList()[0];

                        newactions.Add(MenuActionitem);
                    }

                    //removing the old menuitem and menu item actions from the group
                    foreach (Models.MenuItemAction action in Group[0].MenuActions)
                    {
                        Group[0].MenuActions.Remove(action);
                    }
                    foreach (Models.MenuItemAction mia in MenuActions)
                    {
                        mia.PermitedMenuItemActionGroups.Remove(Group[0]);
                    }

                    foreach (MenuItem MI in Group[0].MenuItems)
                    {
                        Group[0].MenuItems.Remove(MI);
                    }
                    foreach (MenuItem MI in MenuItem)
                    {
                        MI.MenuItemGroups.Remove(Group[0]);
                    }
                    _db.SaveChanges();
                    Group[0].MenuActions = newactions;
                    Group[0].MenuItems = AllowedMenuItems;

                    //Logging the changes
                    GroupModification creategm = new GroupModification();
                    creategm.Group = Group[0];
                    creategm.ModificationLabel = "Group Permission Changed!";
                    creategm.ModificationDate = DateTime.Now;
                    creategm.User = RequestUser;
                    _db.GroupModifications.Add(creategm);

                    _db.SaveChanges();
                    //This function is gonna update the allowed permissions for all the childs under it
                    UpdateChildPermissions(Group[0].MenuItems, Group[0].MenuActions, Group[0].SubGroups);




                    return Ok("{\"GROUPPERMISSIONCHANGED\":\"true\"}");
                }
                else
                {
                    return Ok("{\"GROUPDOESNTEXIST\":\"true\"}");
                }
            }
            else
            {
                return Ok("{\"GROUPNEEDMOREPERMISSIONS\":\"true\"}");
            }


        }
    


        [HttpPost("ChangeGroupName"), Authorize]
        public async Task<ActionResult<string>> ChangeGroupName(ChangeGroupUsername request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
            var RequestUser = _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)).ToList()[0];
            var Group = await _db.Groups.Where(g => g.Id == (long)Convert.ToDouble(request.GroupId))

                .ToListAsync();
            Group[0].Group_Name=request.Group_Name; _db.SaveChanges();

            GroupModification creategm = new GroupModification();
            creategm.Group = Group[0];
            creategm.ModificationLabel = "Group Name Changed!";
            creategm.ModificationDate = DateTime.Now;
            creategm.User = RequestUser;
            _db.GroupModifications.Add(creategm);

            _db.SaveChanges();

            return Ok("{\"GROUPNAMECHANGED\":\"true\"}");


        }


        [HttpPost("DeleteGroup"), Authorize]
        public async Task<ActionResult<string>> DeleteGroup(DeleteGroupDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
           
            var Group = await _db.Groups.Where(g => g.Id == (long)Convert.ToDouble(request.GroupId))
                .Include(g=>g.SubGroups).Include(g => g.SubGroups).Include(g => g.SubGroups).Include(g => g.SubGroups).Include(g => g.SubGroups)
                .ToListAsync();
            var RequestUser = await _db.Users.Where(p => p.Id == (long)Convert.ToDouble(RequestUserID)) 
                .ToListAsync();
            if (Group[0].ParentGroupId!=1)
            {
                DeleteGroupCompletely(Group[0], RequestUser[0]);

                GroupModification creategm = new GroupModification();
                creategm.Group = Group[0];
                creategm.ModificationLabel = "Group Deleted!";
                creategm.ModificationDate = DateTime.Now;
                creategm.User = RequestUser[0];
                _db.GroupModifications.Add(creategm);
                _db.SaveChanges();

                return Ok("{\"GROUPDELETED\":\"true\"}");
            }
            else
            {
                return Ok("{\"IMPOSSIBLETODELETEGROUPUNDERROOT\":\"true\"}");
            }
           


        }

        //This recurssive function deletes the group and all its childs
        [NonAction]
        public void DeleteGroupCompletely(in Group grp, in User DeleteUser)
        {
            if(grp.SubGroups==null)
            {
               
                grp.DeleteDate= DateTime.Now;
                grp.IsDeleted = true;
                grp.DeleteUser= DeleteUser;

                GroupModification creategm = new GroupModification();
                creategm.Group = grp;
                creategm.ModificationLabel = "Group Deleted";
                creategm.ModificationDate = DateTime.Now;
                creategm.User = DeleteUser;
                _db.GroupModifications.Add(creategm);

            }
            else if(grp.SubGroups.ToList().Count==0)
            {
                
                grp.DeleteDate = DateTime.Now;
                grp.IsDeleted = true;
                grp.DeleteUser = DeleteUser;

                GroupModification creategm = new GroupModification();
                creategm.Group = grp;
                creategm.ModificationLabel = "Group Deleted";
                creategm.ModificationDate = DateTime.Now;
                creategm.User = DeleteUser;
                _db.GroupModifications.Add(creategm);
            }
            else
            {
                foreach(Group g in grp.SubGroups)
                {
                   
                    DeleteGroupCompletely(g,DeleteUser);
                    grp.DeleteDate = DateTime.Now;
                    grp.IsDeleted = true;
                    grp.DeleteUser = DeleteUser;

                    GroupModification creategm = new GroupModification();
                    creategm.Group = g;
                    creategm.ModificationLabel = "Group Deleted";
                    creategm.ModificationDate = DateTime.Now;
                    creategm.User = DeleteUser;
                    _db.GroupModifications.Add(creategm);
                }
               
            }
        }


        [NonAction]
        public void UpdateChildPermissions(in ICollection<MenuItem> ParentMenuItems, in ICollection<Models.MenuItemAction> ParentActions, in ICollection<Group> Childs)
        {
            if (Childs == null)
            {

            }
            else
            {

                foreach(Group grp in Childs)
                {
                    //Removing the menuitems and's actions
                    foreach(MenuItem grpmi in grp.MenuItems)
                    {
                        bool menuitemfound = false;

                        foreach(MenuItem pmi in ParentMenuItems)
                        {
                            if (pmi.Id == grpmi.Id)
                                menuitemfound = true;
                        }

                        if(menuitemfound==false)
                        {
                                grp.MenuItems.Remove(grpmi);
                                grpmi.MenuItemGroups.Remove(grp);

                            foreach(Models.MenuItemAction grpa in grp.MenuActions)
                            {
                                if(grpa.MenuItem.Id==grpmi.Id)
                                {
                                    grp.MenuActions.Remove(grpa);
                                    grpa.PermitedMenuItemActionGroups.Remove(grp);
                                }

                               
                            }
                           
                        }
                        
                    }
                    //Removing  not allowed actions
                    foreach(Models.MenuItemAction grpmia in grp.MenuActions)
                    {
                        bool ActionFound = false;

                        foreach(Models.MenuItemAction pactions in ParentActions)
                        {
                            if (grpmia.Id == pactions.Id)
                                ActionFound = true;
                        }

                        if(ActionFound==false)
                        {
                            grp.MenuActions.Remove(grpmia);
                            grpmia.PermitedMenuItemActionGroups.Remove(grp);

                        }

                    }

                    _db.SaveChanges();

                    UpdateChildPermissions(ParentMenuItems, ParentActions, grp.SubGroups);

                }
            }


        }


        [HttpGet("GetGroupInformation"), Authorize]
        public async Task<ActionResult<string>> GetGroupInformation(GetGroupInformationDTO request)
        {
            
            
            var Group = _db.Groups.Where(g => g.Id == (long)Convert.ToDouble(request.GroupId))
                .Include(p=>p.SubGroups).ThenInclude(p => p.SubGroups).ThenInclude(p => p.SubGroups).ThenInclude(p => p.SubGroups).ThenInclude(p => p.SubGroups).ThenInclude(p => p.SubGroups).ThenInclude(p => p.SubGroups)

                .ToList()[0];
           
            if(Group!=null)
            {
              bool load=LoadTheGroupHiearchy(Group.SubGroups);
                return Ok(Group);
            }
            else
            {
                return Ok("{\"GroupDoesntExist\":\"true\"}");
            }

        }
            [HttpPost("GetAllMenuItemPermissions"), Authorize]
        public async Task<ActionResult<string>> GetAllMenuItemPermissions(ChangeUserImageDTO request)
        {
            //Fetching the JWT token to know the user who's sending the request
            string accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);

            var RequestUserID = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Actor).Value;
            return Ok();
           
           

        }
        [NonAction]
        public bool LoadTheGroupHiearchy( in ICollection<Group> SubGroups)
        {
           
           if(SubGroups==null)
            {
                return true;
            }
           else
            {
               
                foreach(Group Group in SubGroups)
                {
                    LoadTheGroupHiearchy(Group.SubGroups);
                }
                return true;
            }



        }

        [NonAction]
        public int GetTreeDepth(Group root)
        {

            if (root == null)
                return 0;

            int maxDepth = 0;
            foreach (var child in root.SubGroups)
            {
                int childDepth = GetTreeDepth(child);
                if (childDepth > maxDepth)
                    maxDepth = childDepth;
            }

            return maxDepth + 1;
        }



    }
    }

