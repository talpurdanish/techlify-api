namespace Disney.Domain.Helpers
{
    public class ReportFilter
    {
        public DateTime StartDate{get; set; } =  DateTime.MinValue; 
        public DateTime EndDate {get; set; } =  DateTime.MaxValue;
        public bool FilterByDateRange{get; set; } = false;
        public int CharacterId{get; set; } = -1;
    }
}
