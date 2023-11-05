using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Group
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? Group_Name { set; get; } = string.Empty;
        public DateTime? CreateDate { set; get; }
        public Int64? CreatedUserId { set; get; }
        public virtual User? CreateUser { set; get; }
        public DateTime? RecentModificationDate { set; get; }
        public Boolean? IsDeleted { set; get; }
        public DateTime? DeleteDate { set; get; }
        public Int64? DeleteUserId { set; get; }
        public virtual User? DeleteUser { set; get; }

        public Int64? ParentGroupId { set; get; }
        public virtual Group? ParentGroup { set; get; }
        public virtual ICollection<GroupModification>? Modifications { set; get; }
        public virtual ICollection<User>? JoinedUsers { set; get; }

        public virtual ICollection<MenuItemAction>? MenuActions { set; get; }
        public virtual ICollection<MenuItem>? MenuItems { set; get; }
        public virtual ICollection<Pattern>? GroupPatterns { set; get; }
        public virtual ICollection<Group>? SubGroups { set; get; }

        public virtual ICollection<PlatformPage>? PlatformPages { set; get; }

        public virtual ICollection<Post>? GroupPosts { set; get; }

        public virtual ICollection<Asset>? GroupAssets { set; get; }
    }
}
