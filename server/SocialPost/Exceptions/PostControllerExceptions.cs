namespace SocialPostBackEnd.Exceptions
{
    public class PatternIDInvalid : Exception
    {
        public PatternIDInvalid() : base("Platform_ID_Doesnt_Exist")
        {
        }
    }

    public class AssetsIDInvalid : Exception
    {
        public AssetsIDInvalid() : base("Asset_ID_Doesnt_Exist")
        {
        }
    }

    public class PostIDInvalid : Exception
    {
        public PostIDInvalid() : base("Post_ID_Doesnt_Exist")
        {
        }
    }
    public class GroupIDInvalid : Exception
    {
        public GroupIDInvalid() : base("Group_ID_Doesnt_Exist")
        {
        }
    }

    public class AssetIDInvalid : Exception
    {
        public AssetIDInvalid() : base("Asset_ID_Doesnt_Exist")
        {
        }
    }
}
