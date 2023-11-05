namespace SocialPostBackEnd.DTO
{
    public class ChangeUserBasicInformations
    {

        public string? UserName { set; get; } = string.Empty;
        public string? FirstName { set; get; } = string.Empty;
        public string? LastName { set; get; } = string.Empty;
        public string? BirthdayDate { set; get; } = string.Empty;
        public string? Email { set; get; } = string.Empty;
        
        public string? PhoneNumber { set; get; } = string.Empty;
    }

    public class LoginDTO
    {
        public string UserName { get; set; }

        public string Password { get; set; }

    }
    public class RegisterDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string BirthdayDate { get; set; }
        public string CampaignName { get; set; }

    }
    public class ChangePWDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ChangePW2DTO
    {
        public string CPassword { get; set; }
        public string NPassword { get; set; }

    }

    public class ForgetPWDTO
    {
        public string Email { get; set; }

    }

    public class ChangeUserImageDTO
    {
        public string? ProfilePictureURL { set; get; } = string.Empty;
    }

    public class CreateSlaveUserDTO
    {
        public ICollection<string>? UserGroupsIDs { set; get; }
        public string? UserName { set; get; } = string.Empty;
        public string? FirstName { set; get; } = string.Empty;
        public string? LastName { set; get; } = string.Empty;
        public string? BirthdayDate { set; get; } = string.Empty;
        public string? Email { set; get; } = string.Empty;
        public string? PhoneNumber { set; get; } = string.Empty;
    }
    public class GetUserByIDDTO
    {
        
        public string? UserID { set; get; } = string.Empty;
        
    }

    public class DeleteUsersDTO
    {

        public ICollection<string>? UserIDs { set; get; }
       

    }

    public class AddUsersToGroupsDTO
    {

       public ICollection<string>? UserIDs { set; get;}
       public ICollection<string>? GroupIDs { set; get;}

    }

    public class RemoveUsersFromGroupsDTO
    {

        public ICollection<string>? UserIDs { set; get; }
        public ICollection<string>? GroupIDs { set; get; }

    }
    public class EDITSLAVEUSERINFODTO
    {
        public string? UserID { set; get; } = string.Empty;
        public string? UserName { set; get; } = string.Empty;
        public string? FirstName { set; get; } = string.Empty;
        public string? LastName { set; get; } = string.Empty;
        public string? BirthdayDate { set; get; } = string.Empty;
        public string? Email { set; get; } = string.Empty;

        public string? PhoneNumber { set; get; } = string.Empty;
    }

    
}
