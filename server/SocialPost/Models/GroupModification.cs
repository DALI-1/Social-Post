using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SocialPostBackEnd.Models
{
    public class GroupModification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int64 Id { set; get; }
        public String? ModificationLabel { set; get; }
        public Int64? UserId { get; set; }
        public Int64? GroupId { get; set; }
        public virtual User? User { get; set; }
        public virtual Group? Group { get; set; }
        public DateTime? ModificationDate { set; get; }

        

    }
}
