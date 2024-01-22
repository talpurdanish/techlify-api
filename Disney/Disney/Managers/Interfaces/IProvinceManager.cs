using Disney.Domain.Viewmodels;

namespace Disney.Managers.Interfaces
{
    public interface IProvinceManager
    {
        Task<IEnumerable<ProvinceViewModel>> GetProvinces();
    }
}
