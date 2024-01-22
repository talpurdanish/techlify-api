using Disney.Domain.Viewmodels;

namespace Disney.Security
{
    public interface IJwtUtils
    {
        public string GenerateJwtToken(UserViewModel user);
        public int? ValidateJwtToken(string token);
    }
}
