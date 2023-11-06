using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Tag
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }

        public string? TaggedImage_X { get; set; }
        public string? TaggedImage_Y { get; set; }
        public string? App_Screen_x { set; get; }      //----App_ are variables used by the App to  place the Tag properly within the web----//
        public string? App_Screen_y { set; get; }
        public string? App_ScrollLeftValue { set; get; }
        public string? App_ScrollTopValue { set; get; }
        public Int64? TaggedAssetPost_ID { set; get; }
        public virtual AssetPost? TaggedAssetPost { set; get; }
        public Int64? TaggedPlatformAccount_ID { set; get; }
        public virtual PlatformAccount? TaggedPlatformAccount { set; get; }

    }
}
