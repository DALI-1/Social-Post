using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class PlatformLike
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? Platform_LikeID { set; get; }
        public string? PlatfromAccount_Name { set; get; }
        public Platform? Platform { set; get; }
        public Int64? PlatformId { set; get; }
        public PlatformPost? PlatformPost { set; get; }
        public Int64? PlatformPost_ID { set; get; } 
        public DateTime? App_AddDate { set; get; }
        public DateTime? App_DeleteDate { set; get; }
        public Boolean? IsDeleted { set; get; }       
        
    }
}
