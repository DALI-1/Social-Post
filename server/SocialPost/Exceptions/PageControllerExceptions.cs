namespace SocialPostBackEnd.Exceptions
{


    public class InvalidPageTokenException : Exception
    {
        public InvalidPageTokenException() : base("Invalid access token")
        {
        }
    }

    public class Page_Doesnt_Exist_Exception : Exception
    {
        public Page_Doesnt_Exist_Exception() : base("Page_Doesnt_Exist")
        {
        }
    }

    public class ConnectionLostException : Exception
    {
        public ConnectionLostException() : base("ConnectionLostException")
        {
        }
    }

    public class InvalidPageID : Exception
    {
        public InvalidPageID() : base("InvalidPageID")
        {
        }
    }

    public class PageTokenExpired : Exception
    {
        public PageTokenExpired() : base("PageTokenExpired")
        {
        }
    }

    public class InvalidUserTokenException : Exception
    {
        public InvalidUserTokenException() : base("InvalidUserTokenException")
        {
        }
    }
    public class InvalidUserID : Exception
    {
        public InvalidUserID() : base("InvalidUserID")
        {
        }
    }

    public class UserTokenExpired : Exception
    {
        public UserTokenExpired() : base("UserTokenExpired")
        {
        }
    }

    public class PlatformNotSupported : Exception
    {
        public PlatformNotSupported() : base("PlatformNotSupported")
        {
        }
    }

    public class NoPlatformPages : Exception
    {
        public NoPlatformPages() : base("NoPlatformPages")
        {
        }
    }

    public class PlatformPage_Doesnt_exist : Exception
    {
        public PlatformPage_Doesnt_exist() : base("PlatformPage_Doesnt_exist")
        {
        }
    }

    public class Facebook_too_Many_Requests : Exception
    {
        public Facebook_too_Many_Requests() : base("Too Many requests, Facebook Application reached limit")
        {
        }
    }
}
