using Disney.Domain.Helpers;
using Disney.Domain.Models;
using Disney.Domain.Viewmodels;
using Disney.Managers.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuthorizeAttribute = Disney.Security.Filters.AuthorizeAttribute;

namespace Disney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly IUserManager _userManager;
        public UsersController(IUserManager userManager)
        {
            _userManager = userManager;

        }
        // GET: api/<UsersController>
        [Authorize(Roles.Administrator,Roles.User)]
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {

            try
            {
                var users = await _userManager.GetUsers(filter);

                return DisneyResult.Success(users, 200);
            }
            catch (DisneyException ae)
            {
                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return DisneyResult.Error("Users could not be fetched", 500);
            }
        }
       



        // GET api/<UsersController>/5
        [Authorize(Roles.Administrator,Roles.User)]
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return DisneyResult.Error("UserId is not valid", 500);
                var user = await _userManager.GetUser(id);
                if (user!.Name == Roles.Administrator)
                {
                    return DisneyResult.Error("User does not exists", 500);
                }
                return DisneyResult.Success(user, 200);
            }
            catch (DisneyException ae)
            {
                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return DisneyResult.Error("User does not exists", 500);
            }
        }

        // POST api/<UsersController>
        
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] UserViewModel viewModel)
        {
            try
            {
                var signUpResult = await _userManager.SignUp(viewModel);

                return DisneyResult.Success("User has been created", null, 200);
            }
            catch (DisneyException ae)
            {
                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return DisneyResult.Error(e.Message, 500);
            }
        }

        // PUT api/<UsersController>
        [Authorize(Roles.Administrator)]
        [HttpPut]
        public async Task<JsonResult> Put([FromBody] UserViewModel viewModel)
        {
            try
            {
                var user = await _userManager.Update(viewModel);
                return DisneyResult.Success(user, 200);
            }
            catch (DisneyException ae)
            {
                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return DisneyResult.Error(e.Message, 500);
            }
        }

        // DELETE api/<UsersController>/5
        [Authorize(Roles.Administrator)]
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return DisneyResult.Error("UserId is not valid", 500);
                var result = await _userManager.Delete(id);
                if (result)
                    return DisneyResult.Success("User has been deleted", null, 200);
                else
                    return DisneyResult.Error("User has not been deleted", 500);
            }
            catch (DisneyException ae)
            {

                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return DisneyResult.Error(e.Message, 500);
            }
        }
        
        [HttpGet("[action]")]
        public async Task<bool> CheckUsername([FromQuery] string value = "", int id = -1)
        {
            try
            {
                if (string.IsNullOrEmpty(value))
                    return false;
                var signUpResult = await _userManager.CheckDuplicate(DuplicateType.Username, value, id);

                return signUpResult;
            }
            catch (DisneyException)
            {

                return true;
            }
            catch (Exception)
            {

                return true;
            }
        }

       
        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<JsonResult> Login(LoginViewModel login)
        {
            try
            {
                var response = await _userManager.Validate(login.Username, login.Password);
                if (response != null && response.Success)
                {
                    Thread.Sleep(500);
                    return
                        DisneyResult.Success("", response, 200);
                }
                else
                {

                    return DisneyResult.Error(response != null && response.Message != null ? response.Message : "Invalid Username/Password", 500);
                }

            }
            catch (DisneyException ae)
            {
                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return DisneyResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator,Roles.User)]
        [HttpGet("[action]")]
        public JsonResult Logout()
        {
            try
            {

                HttpContext.Items["User"] = null;
                return DisneyResult.Success("User has been Logged Out", 200);
            }
            catch (Exception e)
            {

                return DisneyResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator)]
        [HttpPost("[action]/{id}")]
        public async Task<JsonResult> ChangeRole(int id, [FromQuery] string value)
        {

            try
            {
                if (id <= 0)
                    return DisneyResult.Error("UserId is not valid", 500);

                if (string.IsNullOrEmpty(value))
                    return DisneyResult.Error("Role cannot be empty", 500);

                if (Roles.CheckValidity(value))
                {
                    return DisneyResult.Error("Role is not valid", 500);
                }

                var result = await _userManager.AddToRole(id, value);


                return DisneyResult.Success("Role has been changed", null, 200);

            }
            catch (DisneyException ae)
            {

                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return DisneyResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator)]
        [HttpPost("[action]/{id}")]
        public async Task<JsonResult> ChangeStatus(int id)
        {

            try
            {
                var result = await _userManager.ChangeUserStatus(id);

                return DisneyResult.Success("User Status has been changed", 200);

            }

            catch (DisneyException ae)
            {

                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return DisneyResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator)]
        [HttpPost("[action]/{id}")]
        public async Task<JsonResult> ResetPassword(int id)
        {

            try
            {
                if (id <= 0)
                    return DisneyResult.Error("UserId is not valid", 500);


                var result = await _userManager.ResetSecret(id);


                return DisneyResult.Success("Password has been reset", null, 200);

            }
            catch (DisneyException ae)
            {

                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return DisneyResult.Error(e.Message, 500);
            }
        }

    }
}
