namespace SocialPostBackEnd.Responses
{
    public class ErrorResponse
    {
        public string? StatusCode { get; set; }
        public string? ErrorCode { get; set; }
        public Object? Result { get; set; } = string.Empty;
       
    }
}
