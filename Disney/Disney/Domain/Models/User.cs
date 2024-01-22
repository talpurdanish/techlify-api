using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Disney.Domain.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [Required]
        [MaxLength(250)]
        [NotNull]
        public string Name { get; set; } = string.Empty;
        public DateTime Created { get; set; }
        public byte[] Picture { get; set; } = new byte[1];
        public string Gender { get; set; } = string.Empty;
        public string PhoneNo { get; set; } = string.Empty;
        public DateTime DateofBirth { get; set; }
       
        public int CityId { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string PasswordSalt { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } = string.Empty;


        public bool IsActive { get; set; }
        public bool Deleted { get; set; }

        public virtual City City { get; set; } = new City();
    }

    
}
