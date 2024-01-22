using AutoMapper;
using Disney.Domain.Models;
using Disney.Domain.Viewmodels;

namespace Disney.Profiles
{
    public class CharacterProfile : Profile
    {
        public CharacterProfile()
        {
            CreateMap<CharacterViewModel, Character>()
                .ForMember(dest => dest.CharacterId, act => act.Ignore())
                 .ForMember(dest => dest.Picture, act => act.Ignore());
            CreateMap<Character, CharacterViewModel>();

        }

    }
}
