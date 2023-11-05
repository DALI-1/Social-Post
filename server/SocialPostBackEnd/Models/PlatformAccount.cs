using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class PlatformAccount 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { get; set; }
        public string? PlatformAccountID { get; set; }
        public string? AccessToken { get; set; }
        public DateTime? AccessTokenExpireDate { get; set; }
        public Int64? PlatformID { get; set; }
        public Platform? Platform { get; set; }
        public DateTime? AddDate { set; get; }
        public Int64? AddUserId { set; get; }
        public virtual User? AddUser { set; get; }
        public Boolean? IsDeleted { set; get; }
        public DateTime? DeleteDate { set; get; }
        public Int64? DeleteUserId { set; get; }
        public virtual User? DeleteUser { set; get; }
        public Boolean? Is_AddedBySearchService { set; get; }  //This flag is set to true if  it's added by a tag service//
        public Boolean? Is_Tagable { set; get; }  //This flag indiate if this account can be tagged or not//
        public Boolean? Is_Mentionable { set; get; } //This flag indiate if this account can be Mentioned or not//

        //--------------------The data here is cached to avoid Too many requests error from Facebook, the data will be updated via a service later on------------------------///
        public DateTime? CachedData_LastUpdateDate { set; get; }
        public string? CachedData_Username { set; get; }  //This is only because of IG//
        public string? CachedData_First_name { set; get; }
        public string? CachedData_Last_name { set; get; }
        public string? CachedData_Name { set; get; }
        public string? CachedData_Email { set; get; }
        public string? CachedData_PictureURL { set; get; }
        public string? CachedData_PictureHeight { set; get; }
        public string? CachedData_PictureWidth { set; get; }
        public bool CachedData_PictureIs_silhouette { set; get; }
        public bool CachedData_IsChanged { set; get; }

        //---------------------------------Cached data Ends here----------------------------///
        public ICollection<Tag>? ListOfTags { set; get; }
        public ICollection<MentionedAccountPost>? Mentions { set; get; }
    }
}
