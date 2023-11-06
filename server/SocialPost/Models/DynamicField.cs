using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class DynamicField
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public Int64? PatternId { set; get; }
        public Int64? PostID { set; get; }
        public Int64? PageID { set; get; }
        public string? Value { set; get; }
        public virtual PlatformPage? PlatformPage { set; get; }
        public virtual Pattern? Pattern { set; get; }
        public virtual Post? Post { set; get; }
    
        
    }
}
