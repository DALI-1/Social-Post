using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class Pattern
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public string? PatternName { get; set; }
        public string? PatternText { get; set; }
        public Int64? GroupId { get; set; }

        public virtual Group? Group { get; set; }
        public virtual ICollection<DynamicField>? AssociatedDynamicFields { get; set; }
    }
}
