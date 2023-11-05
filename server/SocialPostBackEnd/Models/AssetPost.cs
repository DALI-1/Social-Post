using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class AssetPost
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public virtual Post? Post { set; get; }
        public Int64? PostId { set; get; }
        public virtual Asset? Asset { set; get; }
        public Int64? AssetId { set; get; }
        public Int64? ThumbnailID { set; get; }
        public virtual Asset? Thumbnail { set; get; }
        public virtual ICollection<Tag>? Asset_Tags { get; set; }
    }
}
