using AutoMapper;
using Disney.Domain.Models;
using Disney.Domain.Viewmodels;

namespace Disney.Profiles
{
    public class ProvinceProfile : Profile
    {

        public ProvinceProfile()
        {
            CreateMap<Province, ProvinceViewModel>();
        }
    }
}
