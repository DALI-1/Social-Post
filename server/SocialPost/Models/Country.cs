using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Country
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? Country_Name { get; set; } //Tunisia for example
        public string? Country_Key { get; set; } // TN, US
        public string? Country_PlatformCode { get; set; }// TN, US for exple for Facebook, could be a number for other platforms
        public Int64? Country_PlatformId { set; get; }
        public Platform? Country_Platform { get; set; } //This indicate that the keys are specific to Facebook Only, Google Only and other platforms in case they get added in the future
        public  ICollection<Region>? Country_Regions { set; get; } //This contains the regions associated to this country

        public ICollection<Post>? Country_Targeted_Posts { set; get; }  //This has the posts that target this country
    }
}
