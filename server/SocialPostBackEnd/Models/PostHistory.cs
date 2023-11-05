using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class PostHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public Int64? PlatformPageID { set; get; }
        public Int64? PostID { set; get; }
        public virtual PlatformPage? PlatformPage { set; get; }
        public virtual Post? Post { set; get; }
        public string? Post_Shares_TotalCount { set; get; }
        public string? Post_Likes_TotalCount { set; get; }
        public string? Post_Comment_TotalCount { set; get; }
        public DateTime? InseightsTime { set; get; }




    }
}
