using Disney.Domain.Viewmodels;
using Disney.Context;
using Disney.Managers.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Disney.Managers.Managers
{
    public class ProvinceManager : IProvinceManager
    {
        private readonly DisneyContext _context;
        public ProvinceManager(DisneyContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProvinceViewModel>> GetProvinces()
        {
            var query = from province in _context.Provinces
                        select new ProvinceViewModel()
                        {
                            Name = province.Name,
                            id = province.ProvinceId
                        };
            var provinces = await query.ToListAsync();
            return provinces;
        }
    }
}
