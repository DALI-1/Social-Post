using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Region
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? Region_Name { get; set; } //Sousse for example
        public string? Region_PlatformCode { get; set; }// Random key, 3640 for sousse for example, for Facebook, could be anything else for Google
        public Country? Region_Country { set; get; }
        public Int64? Region_CountryId { set; get; }
        public Int64? Region_PlatformId { set; get; }
        public Platform? Region_Platform { get; set; } //This indicate that the keys are specific to Facebook Only, Google Only and other platforms in case they get added in the future
        public ICollection<Location>? Region_Locations { set; get; }
        public ICollection<Post>? Region_Targeted_Posts { set; get; }  //this has the Posts that target this region
    }
}
