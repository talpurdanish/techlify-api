namespace Disney.Domain.Helpers
{
     public class DataFilter
    {
        public string? Term { get; set; } = "";
        public int SearchField { get; set; } = 1;
        public int SortField { get; set; } = 1;
        
        public int Order { get; set; } = 1;
        public bool Deleted{ get; set;}
    }

    public enum FieldTypes
    {
        Name = 1,
     
        Role = 4,
        Username = 5, 
        CityName = 6, 
        PhoneNo = 7,
        Gender = 8,
     
    }
}
