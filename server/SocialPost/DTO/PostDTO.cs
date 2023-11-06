namespace SocialPostBackEnd.DTO
{
    public class AddPostDTO
    {
        public string? PostGroupID { set; get; }
        public string? PostText { set; get; }

        public bool RepeatPost { set; get; } //flag indicate if the post repeats or not
        public string? RepeatOption { set; get; } // Repeat option Weekly, monthly, yearly..//

        public bool? EndRepeatPost { set; get; }  //Flag that indicate if the posts end or not
        public string? EndRepeatOption { set; get; }
        public Int64? EndRepeatOnOccurence { set; get; }

        public DateTime? EndRepeatAfterDate { set; get; }

        public DateTime? PostDate { set; get; }
        public ICollection<SelectedPage>? ListOfPages { get; set; } = null;
        public ICollection<SelectedAssets>? ListOfAssets { get; set; } = null;
        public ICollection<VideoAsset>? ListOfVideoAssets { get; set; } = null;
        public ICollection<DynamicFieldDTO>? ListOfDynamicFields { get; set; } = null;

        public ICollection<AssetTagDTO>? ListOfTags { get; set; } = null;

        public ICollection<MentionPlatformAccountDTO>? ListOfMentionedPlatformAccounts { get; set; } = null;

        


        //Targeting Options

        public string? Target_AgeFrom { set; get; }
        public string? Target_AgeTo { set; get; }
        public string? Target_Gender { set; get; }  //3 for both, 1 for male, 2 for female
        public string? Target_PlatformId { set; get; } //FCBK, INSTA, others.. just to specifiy the platform we using
        public ICollection<TargetCountryDTO>? Targeted_Countries { get; set; } = null;
        public ICollection<TargetRegionDTO>? Targeted_Regions { get; set; } = null;
        public ICollection<TargetLocationDTO>? Targeted_Locations { get; set; } = null;
        public ICollection<TargetLanguageDTO>? Targeted_Languages { get; set; } = null;
        public ICollection<TargetInterestDTO>? Targeted_Interests { get; set; } = null;


        
    }

    public class EditPostDTO
    {
        public string? PostID { set; get; }
        public string? PostGroupID { set; get; }
        public string? PostText { set; get; }

        public bool RepeatPost { set; get; } //flag indicate if the post repeats or not
        public string? RepeatOption { set; get; } // Repeat option Weekly, monthly, yearly..//

        public bool? EndRepeatPost { set; get; }  //Flag that indicate if the posts end or not
        public string? EndRepeatOption { set; get; }
        public Int64? EndRepeatOnOccurence { set; get; }

        public DateTime? EndRepeatAfterDate { set; get; }

        public DateTime? PostDate { set; get; }
        public ICollection<SelectedPage>? ListOfPages { get; set; } = null;
        public ICollection<SelectedAssets>? ListOfAssets { get; set; } = null;
        public ICollection<VideoAsset>? ListOfVideoAssets { get; set; } = null;
        public ICollection<DynamicFieldDTO>? ListOfDynamicFields { get; set; } = null;

        public ICollection<AssetTagDTO>? ListOfTags { get; set; } = null;

        public ICollection<MentionPlatformAccountDTO>? ListOfMentionedPlatformAccounts { get; set; } = null;


        //Targeting Options

        public string? Target_AgeFrom { set; get; }
        public string? Target_AgeTo { set; get; }
        public string? Target_Gender { set; get; }  //3 for both, 1 for male, 2 for female
        public string? Target_PlatformId { set; get; } //FCBK, INSTA, others.. just to specifiy the platform we using
        public ICollection<TargetCountryDTO>? Targeted_Countries { get; set; } = null;
        public ICollection<TargetRegionDTO>? Targeted_Regions { get; set; } = null;
        public ICollection<TargetLocationDTO>? Targeted_Locations { get; set; } = null;
        public ICollection<TargetLanguageDTO>? Targeted_Languages { get; set; } = null;
        public ICollection<TargetInterestDTO>? Targeted_Interests { get; set; } = null;
     


    }

    public class TargetCountryDTO
    {
        public string? Country_Name { set; get; }
        public string? Country_Key { set; get; }
        public string? Country_PlatformCode { set; get; }
    }

    public class MentionPlatformAccountDTO
    {
        public string? MentionedPlatformAccount_ID { set; get; }
   
    }

    public class AssetTagDTO
    {
        public string? Asset_ID { set; get; }
        public ICollection<TagDTO>? Assetags { get; set; } = null;

    }

    public class VideoAsset
    {
        public string? Asset_ID { set; get; }

        public string? ThumbnailURL { set; get; }
    }

    public class TagDTO
    {
        public string? Tag_X { set; get; }
        public string? Tag_Y { set; get; }
        public string? Screen_x { set; get; }
        public string? Screen_y { set; get; }
        public string? ScrollLeftValue { set; get; }
        public string? ScrollTopValue { set; get; }     
        public string? TaggedUserID { set; get; }

    }

    public class TargetRegionDTO
    {
        public string? Region_Name { set; get; }
        public string? Country_PlatformId { set; get; }
        public string? Region_PlatformCode { set; get; }
    }

    public class TargetLocationDTO
    {
        public string? Location_Name { set; get; }
        public string? Location_Type { set; get; }
        public string? Location_PlatformCode { set; get; }
        public string? Location_RegionId { set; get; }
    }

    public class TargetLanguageDTO
    {
        public string? Language_Name { set; get; }
        public string? LanguagePlatform_Key { set; get; }

    }

    public class TargetInterestDTO
    {
        public string? Interest_Name { set; get; }
        public string? Interest_PlatformCode { set; get; }
        public string? Interest_Description { set; get; }
        public string? Interest_Topic { set; get; }
    }

    public class ModifyPostDTO
    {
        public string? PostID { set; get; }
        public string? PostText { set; get; }

        public bool RepeatPost { set; get; } //flag indicate if the post repeats or not
        public string? RepeatOption { set; get; } // Repeat option Weekly, monthly, yearly..//

        public bool? EndRepeatPost { set; get; }  //Flag that indicate if the posts end or not
        public string? EndRepeatOption { set; get; }
        public Int64? EndRepeatOnOccurence { set; get; }

        public DateTime? EndRepeatAfterDate { set; get; }

        public DateTime? PostDate { set; get; }
        public ICollection<SelectedPage>? ListOfPages { get; set; } = null;
        public ICollection<SelectedAssets>? ListOfAssets { get; set; } = null;
        public ICollection<DynamicFieldDTO>? ListOfDynamicFields { get; set; } = null;


    }
    public class DeletePostDTO
    {
        public string? PostID { set; get; }
    }

    public class GetGroupPostsDTO
    {
        public string? GroupID { set; get; }
    }
    
    public class SelectedPage
    {
        public string? PageID { set; get; } = string.Empty;
    }
    public class SelectedAssets
    {
        public string? AssetID { set; get; } = string.Empty;
    }
    public class DynamicFieldDTO
    {
        public string? PatternID { set; get; } = string.Empty;
        public ICollection<PageDynamicFieldValue>? ListOfPagesDynamicFieldValues { get; set; } = null;
    }
    public class PageDynamicFieldValue
    {
        public string? PageID { set; get; } = string.Empty;
        public string? DynamicFieldValue { set; get; } = string.Empty;
    }

    public class GetPostByIDDTO
    {
        public string? PostID { set; get; } = string.Empty;
       
    }
}
