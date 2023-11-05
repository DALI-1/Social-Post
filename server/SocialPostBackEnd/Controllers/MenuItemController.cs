using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialPostBackEnd.Data;
using SocialPostBackEnd.DTO;
using SocialPostBackEnd.Models;

namespace SocialPostBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public IConfiguration Configuration { get; }
        public MenuItemController(IConfiguration configuration, ApplicationDbContext db)
        {
            Configuration = configuration;
            _db = db;
        }


        [HttpPost("AddMenuItem")]
        public async Task<ActionResult<string>> AddMenuItem(AddMenuItemDTO request)
        {
            MenuItem menuItem = new MenuItem()
            {
                MenuItemName = request.MenuItemName,
                Label = request.MenuItemLabel,
                URL = request.MenuItemURL,

            };

            _db.MenuItems.Add(menuItem);
            List<string> ListOfPossibleActions = new List<string>()
            {
                "Add","Edit","Delete","View"
            };

            
                foreach (string Action in ListOfPossibleActions)
                {
                Models.MenuItemAction mia = new Models.MenuItemAction()
                    {
                        ActionName = Action,
                        MenuItem = menuItem
                    };

                    
                    _db.MenuItemActions.Add(mia);
                }
            _db.SaveChanges();
            return Ok(menuItem);

        }
        [HttpGet("GetAllMenuItems")]
        public async Task<ActionResult<string>> GetAllMenuItems()
        {
            return Ok(_db.MenuItems.Where(mi => mi.Id != null).ToList());

        }

        [HttpGet("GetAllMenuItemActions")]
        public async Task<ActionResult<string>> GetAllMenuItemActions()
        {
            return Ok(_db.MenuItemActions.Where(mi => mi.Id != null)
                .Include(mi=>mi.MenuItem)  
                .ToList());

        }
    }
}
