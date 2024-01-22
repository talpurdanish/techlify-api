using Disney.Domain.Helpers;
using Disney.Domain.Models;
using Disney.Domain.Viewmodels;
using Microsoft.EntityFrameworkCore;

namespace Disney.Managers.Interfaces
{
    public interface ICharacterManager
    {

        Task<CharacterViewModel?> GetCharacter(int id);
        Task<IEnumerable<CharacterViewModel>> GetCharacters(DataFilter filter);

        Task<string> Create(CharacterViewModel viewmodel);
        Task<string> Update(CharacterViewModel viewmodel);
        Task<bool> Delete(int id);

        Task<bool> Vote(int id, int userId);
        Task<IEnumerable<Vote>> BulkVote();
        Task<GraphTotalVotesViewModel> GetTotalVotes(DateTime startDate, DateTime endDate, bool filterByDateRange, int characterId = -1);
        Task<IEnumerable<TotalVotesViewModel>> GetTotalVotesPerCharacter(DateTime startDate, DateTime endDate, bool filterByDateRange);
        IEnumerable<CharacterViewModel> GetTopFiveCharacters(DateTime startDate, DateTime endDate, bool filterByDateRange);
        Task<CharacterByTimeViewModel> PopularCharacterByTime(DateTime startDate);
        Task<IEnumerable<string>> GetAllVoteDates();




    }
}
