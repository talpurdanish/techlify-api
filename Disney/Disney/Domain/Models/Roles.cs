namespace Disney.Domain.Models
{
    public static class Roles
    {
        public const string Administrator = "Administrator";
        
        public const string User = "User";


        public static bool CheckValidity(string value)
        {
            return value != Administrator &&  value != User;
        }
    }
}
