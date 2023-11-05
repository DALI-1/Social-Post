namespace SocialPostBackEnd.DTO
{
    public class AddAssetDTO
    {
        public string? GroupID { set; get; } = string.Empty;
        public string? AssetName { set; get; } = string.Empty;
        public string? AssetType { set; get; } = string.Empty;
        public string? ResourceURL { set; get; } = string.Empty;
        

    }

    public class AssignVideoThumbnail
    {
        public string? VideoID { set; get; } = string.Empty;
        public string? ThumbnailURL { set; get; } = string.Empty;
    }

    public class RemoveAssetDTO
    {

        public ICollection<AssetObj>? ListOfAssets { set; get; }
       

    }

    public class AssetObj
    {
        public string? AssetID { set; get; } = string.Empty;
    }

    public class GetGroupAssetsDTO
    {

        public string? GroupID { set; get; } = string.Empty;


    }
    

}
