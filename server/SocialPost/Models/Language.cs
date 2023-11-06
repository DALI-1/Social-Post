using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Language
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? Language_Name { get; set; } //Language Name, English, French for exple
        public string? Language_PlatformKey { get; set; } // 6 for English, 1 for Catalan for the platform Meta, could be anything else for Google or other platforms
        public ICollection<Post>? Language_Targeted_Posts { set; get; }  //This has the posts that target this language
        public Int64? Language_PlatformId { set; get; }
        public Platform? Language_Platform { get; set; } //This indicate that the keys are specific to Facebook Only, Google Only and other platforms in case they get added in the future
    }
}
