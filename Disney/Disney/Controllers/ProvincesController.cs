using Disney.Domain.Helpers;
using Disney.Domain.Models;
using Disney.Managers.Interfaces;
using Disney.Security.Filters;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Disney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
    public class ProvincesController : ControllerBase
    {
        private readonly IProvinceManager _manager;

        public ProvincesController(IProvinceManager manager)
        {
            _manager = manager;
        }

        // GET: api/<ProvincesController>
        [HttpGet]
        public async Task<JsonResult> Get()
        {
            try
            {
                var provinces = await _manager.GetProvinces();
                return DisneyResult.Success("", provinces, 200);
            }
            catch (Exception)
            {
                return DisneyResult.Error("Provinces could not be fetched", 500);
            }
        }


    }
}
