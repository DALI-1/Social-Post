using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class PlatformPage 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { get; set; }
       
        public string? AccessToken { get; set; }
        public DateTime? AccessTokenExpireDate { get; set; }
        public Int64? PlatformPageID { get; set; }
        public Int64? PlatformID { get; set; }
        public Int64? PageOwnerID { get; set; }
        public Int64? AssociatedByPlatformPageID { get; set; }
        public DateTime? AddDate { set; get; }
        public Int64? AddUserId { set; get; }
        public virtual User? AddUser { set; get; }
        public Boolean? IsDeleted { set; get; }
        public DateTime? DeleteDate { set; get; }
        public Int64? DeleteUserId { set; get; }
        public Int64? GroupId { set; get; }

        //--------------------The data here is cached to avoid Too many requests error from Facebook, the data will be updated via a service later on------------------------///
        public DateTime? CachedData_LastUpdateDate { set; get; }
        public string? CachedData_PageName { set; get; }
        public string? CachedData_Description { set; get; }
        public string? CachedData_Bio { set; get; }
        public string? CachedData_About { set; get; }
        public string? CachedData_Category { set; get; }
        public string? CachedData_WebsiteURL { set; get; }
        public string? CachedData_Location { set; get; }
        public string? CachedData_followers_count { set; get; }
        public string? CachedData_fan_count { set; get; }
        public string? CachedData_PhoneNumber { set; get; }    
        public string? CachedData_PictureURL { set; get; }
        public string? CachedData_PictureHeight { set; get; }
        public string? CachedData_PictureWidth { set; get; }
        public bool CachedData_PictureIs_silhouette { set; get; }
        public bool CachedData_IsChanged { set; get; }


        //---------------------------------Cached data Ends here----------------------------///
        public virtual User? DeleteUser { set; get; }
        //Platforms I'm associated to
        public virtual PlatformPage? AssociatedByPlatformPage { get; set; }
        public virtual PlatformAccount? PageOwner { get; set; }
        public virtual Platform? Platform { get; set; }
        public virtual Group? Group { get; set; }
        //Platforms that are associated to me
        public virtual ICollection<PlatformPage>? AssociatedPlatformPages { get; set; }
        public virtual ICollection<Post>? Posts { get; set; }
        public virtual ICollection<PlatformPost>? Posted_PlatformPosts { get; set; }
        public virtual ICollection<PostHistory>? PageInseightsHistory{ set; get; }
    }
}
