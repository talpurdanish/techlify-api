using System.ComponentModel.DataAnnotations;

namespace Disney.Domain.Models
{
    public class Vote
    {
        [Key]
        public int VoteId { get; set; }
        [Required]
        public int CharacterId {get;set; }
        [Required]
        public int UserId{get; set;}
        [Required]
        public DateTime CastedOn{get; set; }

        //public virtual Character Character { get; set; }    = new Character();
        //public virtual User User { get; set; } = new User();
    }
}
