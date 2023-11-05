using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class MenuItemAction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? ActionName { get; set; }
        public Int64? MenuItemId { get; set; }

        public virtual MenuItem MenuItem { get; set; }
      public virtual ICollection<Group> PermitedMenuItemActionGroups { get; set; }
    }
}
