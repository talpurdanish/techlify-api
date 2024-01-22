using Disney.Domain.Models;

namespace Disney.Domain.Viewmodels
{
    public class CharacterByTimeViewModel
    {
        public string? Day { get; set; } = String.Empty;
        
        public CharacterViewModel? MorningPopularCharacter { get; set; }
        public CharacterViewModel? AfternoonPopularCharacter { get; set; }
        public CharacterViewModel? EveningPopularCharacter { get; set; }

        
    }



   
}


