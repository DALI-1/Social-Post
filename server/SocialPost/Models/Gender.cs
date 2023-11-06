using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Gender
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? Gender_Name { get; set; }    
    }
}
