using SocialPostBackEnd.Models;

namespace SocialPostBackEnd.DTO
{
   
    public class Inseights_PageList
    {
        public ICollection<Inseights_PageDTO>? ListOfPages { set; get; } = null;
        public  string? PostDatetime { get; set; }
       
    }

    public class GetPostsInseights
    {
        public string Group { set; get; } = null;

    }
    public class Inseights_PageDTO
    {
        public string? Id { get; set; }
    }
    public class PlatformPostScore
    {
        public PlatformPost? Platform_post { get; set; }
        public DateTime? PostDatetime { get; set; }
        public Int64? Like_Count { get; set; }
        public Int64? Shares_Count { get; set; }
        public Int64? Comment_Count { get; set; }
        public Int64? Score { get; set; }
    }

    public class SinglePostInsightsDTO
    {
        public String? PostID { get; set; }
    }

    public class PostInseights
    {
        public String? PostID { get; set; }
        public ICollection<Inseight>? InseightsInfo { get; set; }
    }
    public class Inseight
    {
        public ICollection<string>? X_Values { get; set; }
        public ICollection<string>? Y_Values { get; set; }
        public String? Type { get; set; }
    }

    public class InseightsResult
    {
        public ICollection<PostInseights>? PostsInseights { get; set; }
        public Int64? Total_Likes_Count { get; set; }
        public Int64? Total_Comment_Count { get; set; }
        public Int64? Total_Shares_Count { get; set; }
        public Int64? Total_Pages_Count { get; set; }
        public Int64? Total_Posts_Count { get; set; }

    }
}
