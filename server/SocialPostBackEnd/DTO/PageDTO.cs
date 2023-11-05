namespace SocialPostBackEnd.DTO
{
    public class AddFacebookPageDTO
    {
       
      
        public string? GroupID { set; get; } = string.Empty;
        public string? OwnerFBid { set; get; } = string.Empty;
        public string? OwnerFB_shortLivedToken { set; get; } = string.Empty;
        public ICollection<PageDTO>? ListOfPages { get; set; } = null;
       
    }


    public class AddInstagramPageDTO
    {


        public string? GroupID { set; get; } = string.Empty;
        public string? OwnerFBid { set; get; } = string.Empty;
        public string? OwnerFB_shortLivedToken { set; get; } = string.Empty;
        public ICollection<PageDTO>? ListOfPages { get; set; } = null;

    }

    public class GetGroupPagesDTO
    {
        public string? GroupID { set; get; } = string.Empty;
    }

    public class PageDTO
    {
        public string? PageID { set; get; } = string.Empty;
       
        public string? Page_shortLivedToken { set; get; } = string.Empty;
        public string? AssociatedPageID { get; set; } = null;
        
    }

    public class DeletePagesDTO
    {
        public string? GroupID { set; get; } = string.Empty;
        public ICollection<Page_To_Delete>? ListOfPagesToDelete { set; get; }
    }
    public class Page_To_Delete
    {

       public string? PageID { set; get; } = string.Empty;
    }


    public class GetPageInfoDTO
    {
        
        public string? PageID { set; get; } = string.Empty;
        public string? GroupID { set; get; } = string.Empty;
    }

    public class UpdatePageInfoDTO
    {
        public string? GroupID { set; get; } = string.Empty;
        public string? PageID { set; get; } = string.Empty;

        public string? PageName { set; get; } = string.Empty;
 
        public string? PageDescription { set; get; } = string.Empty;
        public string? PageAbout { set; get; } = string.Empty;
    }
    public class UpdatePagePictureDTO
    {
        public string? GroupID { set; get; } = string.Empty;
        public string? PageID { set; get; } = string.Empty;
        public string? PictureURL { set; get; } = string.Empty;

    }

    public class GetPagePlatformID
    {
        public string? PageID { set; get; } = string.Empty;
   

    }

    public class RemovePageAssociationsDTO
    {
        public string? GroupID { set; get; } = string.Empty;
        public string? PageID { set; get; } = string.Empty;
        public string? AssociatedPageID { set; get; } = string.Empty;
        public string? AssociationType { set; get; } = string.Empty;
    }

}
