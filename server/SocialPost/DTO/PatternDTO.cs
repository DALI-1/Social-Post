 namespace SocialPostBackEnd.DTO
{
    public class CreatePatternDTO
    {
        public string? PatternName { set; get; } = string.Empty;
        public string? PatternText { set; get; } = string.Empty;
        public string? GroupID { set; get; } = string.Empty;

    }

    public class DeletePatternDTO
    {

        public ICollection<Pater>? ListOfPatternsToDelete { get; set; } = null;

        public class Pater
        {

            public string? PatternID { set; get; } = string.Empty;


        }
    }
   
    public class GetGroupPatternsDTO
    {

        public string? GroupID { set; get; } = string.Empty;


    }
}
