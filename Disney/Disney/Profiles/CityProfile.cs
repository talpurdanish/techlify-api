using AutoMapper;
using Disney.Domain.Models;
using Disney.Domain.Viewmodels;

namespace Disney.Profiles
{
    public class CityProfile : Profile
    {

        public CityProfile()
        {
            CreateMap<City, CityViewModel>();
        }
    }
}
