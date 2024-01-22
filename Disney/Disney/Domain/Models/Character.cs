using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Disney.Domain.Models
{
    public class Character
    {
        [Key]
        public int CharacterId { get; set; }
        [Required]
        [MaxLength(250)]
        [NotNull]
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public byte[] Picture { get; set; } = new byte[1];

        

    }
}
