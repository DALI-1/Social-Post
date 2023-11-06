using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Location
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? Location_Name { get; set; }
        public string? Location_Type { get; set; } //CITY, SUBCITY
        public string? Location_PlatformCode { set; get; } //The ID Of the Location in a specific Platform exple Meta,Google
        public Region? Location_Region { set; get; } //Specifies the Region the location is under
        public Int64? Location_RegionId { set; get; }
        public Int64? Location_PlatformId { set; get; }
        public Platform? Location_Platform { get; set; } //This indicate that the keys are specific to Facebook Only, Google Only and other platforms in case they get added in the future
        public ICollection<Post>? Location_Targeted_Posts { set; get; } //this has the posts that target this locations
    }
}
