using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Post
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
           
        public string? PostText { set; get; }

        public bool? RepeatPost { set; get; } //flag indicate if the post repeats or not
        public string? RepeatOption { set; get; } // Repeat option Weekly, monthly, yearly..//

        public bool? EndRepeatPost { set; get; }  //Flag that indicate if the posts end or not
        public string? EndRepeatOption { set; get; } //Indicate how the Repeat is gonna end, After X nb of occurences, or after an X date

        public Int64? EndRepeatOnOccurence{ set; get; }

        public DateTime? EndRepeatAfterDate{ set; get; }

        public DateTime? PostDate { set; get; }
        public DateTime? CreateDate { set; get; }
        public Int64? CreatedUserId { set; get; }
        public virtual User? CreateUser { set; get; }
        public Boolean? IsDeleted { set; get; }
        public DateTime? DeleteDate { set; get; }
        public Int64? DeleteUserId { set; get; }
        public virtual User? DeleteUser { set; get; }
        public Int64? PostGroupID { set; get; }
        public virtual Group? Group { set; get; }
        public bool? IsPosted { set; get; }
        public Int64? Post_Occurence { set; get; }
        public virtual ICollection<AssetPost>? UsedAssets { set; get; }

        public virtual ICollection<PlatformPage> Pages { set; get; }

        public virtual ICollection<DynamicField> PostDynamicFields { set; get; }

        public virtual ICollection<MentionedAccountPost> PostMentions { set; get; }
        public bool IsTargeted{ set; get; }

        //This gonna contain all the targets info
        public Gender? POST_Targeted_Gender { set; get; }
        public Int64? POST_Targeted_GenderId { set; get; }
        public AgeRange? POST_Targeted_AgeRange { set; get; }
        public Int64? POST_Targeted_AgeRangeId { set; get; }
        public  ICollection<Interest>? POST_Targeted_Interests { set; get; }
        public ICollection<Location>? POST_Targeted_Locations { set; get; }
        public ICollection<Region>? POST_Targeted_Regions { set; get; }
        public ICollection<Country>? POST_Targeted_Countries { set; get; }
        public ICollection<Language>? POST_Targeted_Languages { set; get; }
        public ICollection<PlatformPost>? Posted_PlatformPosts { set; get; }
        public ICollection<PostHistory>? PostInseightsHistory { set; get; }
    }
}
