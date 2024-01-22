using AutoMapper.Internal.Mappers;

namespace Disney.Domain.Viewmodels
{
    public class TotalVotesViewModel
    {
        public string Day { get; set; } = String.Empty;
        public int TotalVotes { get; set; }
        public int MorningVotes { get; set; }
        public int AfternoonVotes { get; set; }
        public int EveningVotes { get; set; }
        public int CharacterId { get; set; }
        public string Name { get; set; } = String.Empty;

     


        override
        public string ToString()
        {

            return Day + "," +CharacterId + "," + MorningVotes + "," + AfternoonVotes + "," + EveningVotes;

        }

    }


    public class GraphTotalVotesViewModel{ 
           public string[] Days { get; set; } = new string[0];
        public int[] Votes { get; set; } = new int[0];
        }
}
