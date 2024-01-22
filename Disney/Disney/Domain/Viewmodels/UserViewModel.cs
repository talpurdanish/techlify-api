using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace Disney.Domain.Viewmodels
{
    public class UserViewModel
    {
        public int id { get; set; }

        [Required(ErrorMessage = "Name is Required")]
        [DisplayName("Name")]
        [StringLength(250, ErrorMessage = "Name should be less than 250 chars")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Username is Required")]
        [DisplayName("Username")]
        [StringLength(250, ErrorMessage = "Username should be less than 250 chars")]
        public string? Username { get; set; }

        [DisplayName("Picture")]
        public string Picture { get; set; } = string.Empty;
        [Required(ErrorMessage = "Date of Birth is Required")]
        [DisplayName("Date of Birth")]
        [DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:dd/MM/yy}", ApplyFormatInEditMode = true)]
        public DateTime DateofBirth { get; set; }

        [Required(ErrorMessage = "Gender is Required")]
        public string? Gender { get; set; }

        public DateTime Created { get; set; }

        public int CityId { get; set; }
        public string? City { get; set; }

        [DisplayName("Role")]
        public string Role { get; set; } = string.Empty;

        [DisplayName("Activated")]
        public bool? IsActive { get; set; }

        

        public int ProvinceId { get; set; }
        public string? Province { get; set; }

        public string? PhoneNo { get; set; }

        
        [DisplayName("Password")]
        [MaxLength(20, ErrorMessage = "Password should be less than 20 chars")]
        [MinLength(6, ErrorMessage = "Password should be greator than 6 chars")]
        public string? Password { get; set; }

        public bool Deleted{ get; set;}

    }
}
