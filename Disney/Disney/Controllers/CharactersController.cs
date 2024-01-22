using Microsoft.AspNetCore.Mvc;
using Disney.Domain.Models;
using Disney.Managers.Interfaces;
using Disney.Domain.Helpers;
using Disney.Security.Filters;
using Disney.Domain.Viewmodels;

namespace Disney.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CharactersController : ControllerBase
    {
        private readonly ICharacterManager _manager;

        public CharactersController(ICharacterManager manager)
        {
            _manager = manager;
        }



        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {
            try
            {
                var characters = await _manager.GetCharacters(filter);

                return DisneyResult.Success(characters, 200);
            }
            catch (DisneyException ae)
            {
                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return DisneyResult.Error("Characters could not be fetched", 500);
            }
        }


        [HttpGet("{id}")]


        public async Task<JsonResult> Get(int id)
        {
            try
            {
                var character = await _manager.GetCharacter(id);

                return DisneyResult.Success(character, 200);
            }
            catch (DisneyException ae)
            {
                return DisneyResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return DisneyResult.Error("Characters could not be fetched", 500);
            }
        }
        // POST api/<UsersController>
        [Authorize(Roles.Administrator)]
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] CharacterViewModel viewModel)
        {
            try
            {
                var character = await _manager.Create(viewModel);

                return DisneyResult.Success("Character has been created", null, 200);
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
        public async Task<JsonResult> Put([FromBody] CharacterViewModel viewModel)
        {
            try
            {
                var user = await _manager.Update(viewModel);
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
                    return DisneyResult.Error("CharacterId is not valid", 500);
                var result = await _manager.Delete(id);
                if (result)
                    return DisneyResult.Success("Character has been deleted", null, 200);
                else
                    return DisneyResult.Error("Character has not been deleted", 500);
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

        [Authorize(Roles.User)]
        [HttpGet("[action]/{id}")]
        public async Task<JsonResult> Vote(int id)
        {
            try
            {
                if (id <= 0)
                    return DisneyResult.Error("CharacterId is not valid", 500);
                var user = GetCurrentUser();
                if (user is null)
                    return DisneyResult.Error("You are not authorized", 500);


                var result = await _manager.Vote(id, user.id);
                if (result)
                    return DisneyResult.Success("Vote has been registered", null, 200);
                else
                    return DisneyResult.Error("Vote has not been registered", 500);
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
        public async Task<JsonResult> BulkVote(int id)
        {
            try
            {
                var result = await _manager.BulkVote();
                return DisneyResult.Success(result, 200);
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


        //[Authorize(Roles.Administrator)]
        [HttpGet("[action]")]
        public async Task<JsonResult> GetTotalVotes([FromQuery] ReportFilter filter)
        {
            try
            {

                var result = await _manager.GetTotalVotes(filter.StartDate, filter.EndDate, filter.FilterByDateRange, filter.CharacterId);
                return DisneyResult.Success(result, 200);

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
        //[Authorize(Roles.Administrator)]
        [HttpGet("[action]")]
        public async Task<JsonResult> GetTotalVotesPerCharacter([FromQuery] ReportFilter filter)
        {
            try
            {

                var result = await _manager.GetTotalVotesPerCharacter(filter.StartDate, filter.EndDate, filter.FilterByDateRange);
                return DisneyResult.Success(result, 200);

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
        //[Authorize(Roles.Administrator)]
        [HttpGet("[action]")]
        public JsonResult GetTopFiveCharacters([FromQuery] ReportFilter filter)
        {
            try
            {

                var result = _manager.GetTopFiveCharacters(filter.StartDate, filter.EndDate, filter.FilterByDateRange);
                return DisneyResult.Success(result, 200);

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
        public async Task<JsonResult> GetAllDates()
        {
            try
            {

                var result = await _manager.GetAllVoteDates();
                return DisneyResult.Success(result, 200);

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

        //[Authorize(Roles.Administrator)]
        [HttpGet("[action]/{date}")]
        public async Task<JsonResult> PopularCharacterByTime(string date)
        {
            try
            {
                var finalDate = DateTime.Now;
                var converted = DateTime.TryParse(date, out finalDate);
                var result = await _manager.PopularCharacterByTime(converted?finalDate:DateTime.Now);
                
                return DisneyResult.Success(result, 200);

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



        private UserViewModel? GetCurrentUser()
        {
            return HttpContext.Items["User"] as UserViewModel;

        }







    }
}
