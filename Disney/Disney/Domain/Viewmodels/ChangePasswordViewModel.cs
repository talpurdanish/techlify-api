

namespace Disney.Domain.Viewmodels
{
    public class ChangePasswordViewModel
    {

        public int UserId{get; set;}
        public string Oldpassword  {get;set;} = "";
        public string Newpassword  {get;set;} = "";
    }
}
