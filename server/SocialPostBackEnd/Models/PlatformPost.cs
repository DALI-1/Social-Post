using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class PlatformPost
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? PostPlatformID { set; get; }
        public string? PostMessage { set; get; }
        public Int64? SharesCount { set; get; }
        public Platform? Platform { set; get; }     
        public Int64? PlatformId { set; get; }
        public DateTime? Platform_CreateDate { set; get; }
        public DateTime? App_AddDate { set; get; }
        public DateTime? App_DeleteDate { set; get; }
        public Boolean? IsDeleted { set; get; }       
        public bool? IsAppPosted { set; get; }
        public Post? App_Post { set; get; }
        public Int64? App_PostID { set; get; }
        public PlatformPage? PlatformPage { set; get; }
        public Int64? PlatformPage_ID { set; get; }
        public virtual ICollection<PlatformLike>? PostLikes { set; get; }
        public virtual ICollection<PlatformComment>? PostComments { set; get; }
        

    }
}
