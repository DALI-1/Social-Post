using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace SocialPostBackEnd.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }

        public string? UserName { set; get; } = string.Empty;
        public string? FirstName { set; get; } = string.Empty;
        public string? LastName { set; get; } = string.Empty;
        public string? BirthdayDate { set; get; } = string.Empty;
        public string? Email { set; get; } = string.Empty;
        public string? ProfilePictureURL { set; get; } = string.Empty;
        public string? PhoneNumber { set; get; } = string.Empty;
        public byte[]? PasswordHash { set; get; } 
        public byte[]? PasswordSalt { set; get; }  
        public string? Role { set; get; }
        public DateTime? CreateDate { set; get; }
        public Int64? CreatedUserId { set; get; }
        public virtual User? CreateUser { set; get; }      
        public Boolean? IsDeleted { set; get; }
        public DateTime? DeleteDate { set; get; }
        public Int64? DeleteUserId { set; get; }
        public virtual User? DeleteUser { set; get; }
        public virtual ICollection<GroupModification>? Modifications { set; get; }
        public virtual ICollection<Group>? JoinedGroups { set; get; }
        public virtual ICollection<Group>? DeletedGroups { set; get; }
        public virtual ICollection<Group>? CreatedGroups { set; get; }
        public virtual ICollection<PlatformPage>? DeletedPlatformPages { set; get; }
        public virtual ICollection<PlatformPage>? AddedPlatformPages { set; get; }
        public virtual ICollection<PlatformAccount>? DeletedPlatformAccounts { set; get; }
        public virtual ICollection<PlatformAccount>? AddedPlatformAccounts { set; get; }

        public virtual ICollection<Post>? DeletedPosts { set; get; }
        public virtual ICollection<Post>? AddedPosts { set; get; }
    }
}
