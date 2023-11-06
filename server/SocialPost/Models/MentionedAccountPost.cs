using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class MentionedAccountPost
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public virtual Post? Post { set; get; }
        public Int64? PostId { set; get; }
        public virtual PlatformAccount? Mentioned_PlatformAccount { set; get; }
        public Int64? Mentioned_PlatformAccount_ID { set; get; }
    }
}
