using SocialPostBackEnd.Models;

namespace SocialPostBackEnd.DTO
{
    public class PageAssociatedByAssociate
    {
        public List<Object>? List_Of_Associated_Pages { set; get; }
        public Object? Associated_By_Page { set; get; }
    }
    public class AssociationPageObject
    {
        public Platform Platform { set; get; }
        public Object? Associated_By_Page { set; get; }
    }

}
