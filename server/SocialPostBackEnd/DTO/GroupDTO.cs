namespace SocialPostBackEnd.DTO
{
   

    public class CreateGroupDTO
    {
        public string? ParentGroupId { set; get; } = string.Empty;
        public string? GroupName { set; get; } = string.Empty;

        public ICollection<MenuItemAction> SubGroupActions { set; get; } = null;
    }

    public class MenuItemAction
    {
        public string Id { set; get; } = string.Empty;

        public string MenuItemId { set; get; } = string.Empty;
    }

    public class GetGroupInformationDTO
    {
        public string? GroupId { set; get; } = string.Empty;
    }

    public class MoveGroupDTO
    {
        public string? ParentGroupId { set; get; } = string.Empty;
        public string? GroupId { set; get; } = string.Empty;
        public ICollection<MenuItemAction> NewSubGroupActions { set; get; } = null;
    }
    public class ChangePermissionDTO
    {

        public string? GroupId { set; get; } = string.Empty;
        public ICollection<MenuItemAction> NewSubGroupActions { set; get; } = null;
    }
    public class GetGroupInfoDTO
    {
        public string? GroupId { set; get; } = string.Empty;

    }

    public class ChangeGroupUsername
    {
        public string? GroupId { set; get; } = string.Empty;
        public string? Group_Name { set; get; } = string.Empty;
    }

    public class DeleteGroupDTO
    {
        public string? GroupId { set; get; } = string.Empty;

    }

    public class GetSlaveUsersDTO
    {
        public string? GroupId { set; get; } = string.Empty;
    }
}
