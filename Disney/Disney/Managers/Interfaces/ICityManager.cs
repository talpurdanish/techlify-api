using Disney.Domain.Viewmodels;

namespace Disney.Managers.Interfaces
{
    public interface ICityManager
    {
        Task<IEnumerable<CityViewModel>> GetCities(int id = -1);
    }
}
