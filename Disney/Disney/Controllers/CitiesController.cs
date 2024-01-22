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
    public class CitiesController : ControllerBase
    {
        private readonly ICityManager _manager;

        public CitiesController(ICityManager manager)
        {
            _manager = manager;
        }

        // GET: api/<CitiesController>
        [HttpGet]
        public async Task<JsonResult> Get()
        {
            try
            {
                var Cities = await _manager.GetCities();
                return DisneyResult.Success(Cities, 200);
            }
            catch (Exception)
            {
                return DisneyResult.Error("Cities could not be fetched", 500);
            }
        }

        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                var Cities = await _manager.GetCities(id);
                return DisneyResult.Success("", Cities, 200);
            }
            catch (Exception)
            {
                return DisneyResult.Error("Cities could not be fetched", 500);
            }
        }


    }
}
