using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Disney.Domain.Viewmodels
{
    public class CharacterViewModel
    {

         [Key]
        public int CharacterId { get; set; }
        [Required(ErrorMessage ="Character Name is required")]
        [MaxLength(250, ErrorMessage ="Character name can be 250 chars long")]
        [NotNull]
        [DisplayName("Name")]
        public string Name { get; set; } = String.Empty;
        public int Votes { get; set; } = 0;
        public string Description { get; set; } = String.Empty;
        [DisplayName("Picture")]
        public string Picture { get; set; } = string.Empty;
    }
}
