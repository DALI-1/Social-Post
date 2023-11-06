using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class MenuItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? MenuItemName { set; get; }
        public string? Label { set; get; }
        public string? URL { set; get; }

        public virtual ICollection<Group> MenuItemGroups { set; get; }
       
        }

    }

