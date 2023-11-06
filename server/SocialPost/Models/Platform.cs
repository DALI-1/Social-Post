using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace SocialPostBackEnd.Models
{
    public class Platform
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { get; set; }
        public string? PlatformName { get; set; }
        public string? PlatformLogoImageUrl { get; set; }
        public string? PlatformPolicyUrl { get; set; }
        public string? PlatformUrl { get; set; }
    }
}
