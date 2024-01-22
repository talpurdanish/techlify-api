﻿using System.ComponentModel.DataAnnotations;

namespace Disney.Domain.Models
{
    public class Province
    {
        [Key]
        public int ProvinceId { get; set; }
        [Required]
        [MaxLength(250)]
        public string Name { get; set; } =  string.Empty;

        public virtual ICollection<City> Cities { get; set; } = new List<City>();
    }
}
