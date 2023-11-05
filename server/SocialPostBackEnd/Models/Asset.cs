using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Asset
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }

        public string? AssetName { get; set; }
        public string? AssetType { get; set; }
        public string? ResourceURL { get; set; }
        public DateTime? CreateDate { set; get; }
        public Int64? CreatedUserId { set; get; }
        public virtual User? CreateUser { set; get; }
        public Boolean? IsDeleted { set; get; }
        public DateTime? DeleteDate { set; get; }
        public Int64? DeleteUserId { set; get; }
        public virtual User? DeleteUser { set; get; }
        public Int64? GroupId { set; get; }
        public virtual Group? Group { set; get; }

        public virtual ICollection<AssetPost>? PostsUsedAt { get; set; }
        public virtual ICollection<AssetPost>? PostsThumbnails { get; set; }
    }
}
