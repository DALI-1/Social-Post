using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Interest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? Interest_Name { get; set; } //Sports, Shopping for exple
        public string? Interest_PlatformCode { get; set; } // 6003269553527 for sports for Meta platform, could be anything else for google and others
        public string? Interest_Description { get; set; } //Description of the interest
        public string? Interest_Topic { get; set; }  //Topic of the Interest, "Sports and Outdoors" for this exple
        public ICollection<Post>? Interest_Targeted_Posts { set; get; }  //This contains the posts related to the interest
        public Int64? Interest_PlatformId { set; get; }
        public Platform? Interest_Platform { get; set; } //This indicate that the keys are specific to Facebook Only, Google Only and other platforms in case they get added in the future
    }
}
