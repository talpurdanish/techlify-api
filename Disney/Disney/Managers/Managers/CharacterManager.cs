using AutoMapper;
using Disney.Context;
using Disney.Domain.Helpers;
using Disney.Domain.Models;
using Disney.Domain.Viewmodels;
using Disney.Managers.Interfaces;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Disney.Managers.Managers
{
    public class CharacterManager : ICharacterManager
    {
        private readonly DisneyContext _context;
        private readonly IMapper _mapper;


        public CharacterManager(DisneyContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }


        public async Task<CharacterViewModel?> GetCharacter(int id)
        {
            if (id <= 0)
                throw new DisneyException("Id is not valid");

            var votesQuery = _context.Votes.Where(v => v.CharacterId == id).Count();

            var query = from c in _context.Characters
                        where c.CharacterId == id
                        select new CharacterViewModel()
                        {
                            CharacterId = c.CharacterId,
                            Name = c.Name,
                            Votes = votesQuery,
                            Description = c.Description,
                            Picture = c.Picture != null ? String.Format(System.Globalization.CultureInfo.InvariantCulture, "data:image/png;base64,{0}", Convert.ToBase64String(c.Picture!)) : "",

                        };
            return await query.FirstOrDefaultAsync();
        }

        private async Task<IEnumerable<CharacterViewModel>> FetchCharacters()
        {
            try
            {
                var query1 = from c in _context.Characters
                             join v in ((from v in _context.Votes
                                         group v by v.CharacterId into votesGroup
                                         select new VotesViewModel()
                                         {
                                             CharacterId = votesGroup.Key,
                                             Votes = votesGroup.Count()
                                         })) on c.CharacterId equals v.CharacterId into cv
                             from vv in cv.DefaultIfEmpty()
                             orderby vv.Votes
                             select new CharacterViewModel()
                             {
                                 CharacterId = c.CharacterId,
                                 Name = c.Name,
                                 Votes = (vv == null ? 0 : vv.Votes == null ? 0 : vv.Votes) ?? 0,
                                 Description = c.Description,
                                 Picture = c.Picture != null ? String.Format(System.Globalization.CultureInfo.InvariantCulture, "data:image/png;base64,{0}", Convert.ToBase64String(c.Picture!)) : "",
                             };


                var data = await query1.ToListAsync();
                return data;
            }
            catch (Exception e)
            {

                throw new DisneyException(e.Message);
            }


        }



        public async Task<IEnumerable<CharacterViewModel>> GetCharacters(DataFilter filter)
        {

            var Characters = await FetchCharacters();
            return Sort(filter.SortField, filter.Order, Search(filter.Term == null ? "" : filter.Term, Characters));


        }
        private static IEnumerable<CharacterViewModel> Search(string term, IEnumerable<CharacterViewModel> Character)
        {
            IEnumerable<CharacterViewModel> Characters = new List<CharacterViewModel>();
            if (string.IsNullOrEmpty(term))
            {
                return Character;
            }
            else
            {
                var query = from u in Character
                            where
                           u.Name!.Contains(term)
                            select u;


                return query.ToList();
            }
        }
        private static IEnumerable<CharacterViewModel> Sort(int field, int order, IEnumerable<CharacterViewModel> list)
        {
            IEnumerable<CharacterViewModel> listO = new List<CharacterViewModel>();

            listO = field switch
            {
                1 => order == 1 ? list.OrderBy(p => p.Name) : list.OrderByDescending(p => p.Name),
                _ => list,
            };
            return listO;
        }


        public async Task<string> Update(CharacterViewModel viewmodel)
        {
            var character = await _context.Characters.FindAsync(viewmodel.CharacterId);
            if (character is null)
                throw new DisneyException("Character could not be found");

            character = _mapper.Map<Character>(viewmodel);

            _context.Entry(character).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return "Character has been updated";
        }

        public async Task<string> Create(CharacterViewModel viewmodel)
        {
            try
            {
                var character = _mapper.Map<Character>(viewmodel);


                if (!string.IsNullOrEmpty(viewmodel.Picture))
                {
                    var pictureString = viewmodel.Picture.Replace(@"\/", "/");
                    try
                    {
                        string converted = viewmodel.Picture.Replace('-', '+');
                        converted = converted.Replace('_', '/');
                        character.Picture = Convert.FromBase64String(converted);
                    }
                    catch (Exception)
                    {
                        character.Picture = Convert.FromBase64String(pictureString);

                    }
                }

                _context.Characters.Add(character);
                await _context.SaveChangesAsync();
                return "Character has been created";
            }
            catch (Exception e)
            {

                throw new DisneyException(e.Message);
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var Character = await _context.Characters.FindAsync(id);
                if (Character == null)
                {
                    return false;
                }

                _context.Entry(Character).State = EntityState.Deleted;
                _context.Characters.Remove(Character);

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public async Task<bool> Vote(int id, int userId)
        {
            try
            {
                var character = await _context.Characters.FindAsync(id);
                if (character == null)
                {
                    return false;
                }

                var user = await _context.Users.FindAsync(userId);
                if (user is null)
                {
                    return false;
                }

                var vote = new Vote
                {
                    CharacterId = character.CharacterId,
                    UserId = user.UserId,
                    CastedOn = DateTime.Now,
                };


                _context.Votes.Add(vote);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }


        public async Task<IEnumerable<Vote>> BulkVote()
        {
            var votesList = new List<Vote>();
            try
            {

                var characterIds = await _context.Characters.Select(c => c.CharacterId).ToListAsync();
                var randomizer = new Random();

                for (int i = 0; i < 400; i++)
                {
                    var index = randomizer.Next(0, characterIds.Count);
                    var cId = characterIds[index];
                    var uId = index > (characterIds.Count / 2) ? 3 : 5;

                    var rYear = randomizer.Next(1990, 2023);
                    var rMonth = randomizer.Next(1, 12);
                    var rDay = randomizer.Next(1, 30);
                    var hour = randomizer.Next(1, 24);
                    var min = randomizer.Next(1, 60);
                    var sec = randomizer.Next(1, 60);

                    var date = new DateTime(rYear, rMonth, rDay, hour, min, sec);

                    var vote = new Vote
                    {
                        CharacterId = cId,
                        UserId = uId,
                        CastedOn = date
                    };

                    votesList.Add(vote);
                    _context.Votes.Add(vote);
                    await _context.SaveChangesAsync();

                }


                return votesList;
            }
            catch (Exception)
            {

                return votesList;
            }
        }




        public async Task<GraphTotalVotesViewModel> GetTotalVotes(DateTime startDate, DateTime endDate, bool filterByDateRange, int characterId = -1)
        {

            startDate = filterByDateRange ? startDate : DateTime.MinValue;
            endDate = filterByDateRange ? endDate : DateTime.MaxValue;

            IQueryable<TotalVotesViewModel> query;
            if (characterId <= 0)
            {
                query = (from v in _context.Votes
                         where v.CastedOn >= startDate && v.CastedOn <= endDate
                         orderby v.CastedOn
                         group v by v.CastedOn.Date
                             into votesGroup
                         select new TotalVotesViewModel()
                         {
                             Day = votesGroup.Key.ToString("dd/MM/yy"),
                             TotalVotes = votesGroup.Count()
                         });
            }
            else
            {
                query = (from v in _context.Votes
                         where v.CastedOn >= startDate && v.CastedOn <= endDate && v.CharacterId == characterId
                         orderby v.CastedOn
                         group v by v.CastedOn.Date
                            into votesGroup
                         select new TotalVotesViewModel()
                         {
                             Day = votesGroup.Key.ToString("dd/MM/yy"),
                             TotalVotes = votesGroup.Count()
                         });
            }

            var result = await query.ToListAsync();

            var days = result.Select(t=>t.Day).ToArray();
            var votes = result.Select(t=>t.TotalVotes).ToArray();




            return  new GraphTotalVotesViewModel{ Days=days,Votes=votes};
        }



        public async Task<IEnumerable<TotalVotesViewModel>> GetTotalVotesPerCharacter(DateTime startDate, DateTime endDate, bool filterByDateRange)
        {

            startDate = filterByDateRange ? startDate : DateTime.MinValue;
            endDate = filterByDateRange ? endDate : DateTime.MaxValue;

            var query = (from v in _context.Votes
                         where v.CastedOn >= startDate && v.CastedOn <= endDate
                         group v by new { v.CastedOn.Day, v.CharacterId }
                               into votesGroup
                         select new TotalVotesViewModel()
                         {
                             CharacterId = votesGroup.Key.CharacterId,
                             Day = ((DayOfWeek)votesGroup.Key.Day).ToString(),
                             TotalVotes = votesGroup.Count()
                         });

            return await query.ToListAsync();
        }


        public IEnumerable<CharacterViewModel> GetTopFiveCharacters(DateTime startDate, DateTime endDate, bool filterByDateRange)
        {

            startDate = filterByDateRange ? startDate : DateTime.MinValue;
            endDate = filterByDateRange ? endDate : DateTime.MaxValue;

            var query = from c in _context.Characters
                        join v in ((from v in _context.Votes
                                    where v.CastedOn >= startDate && v.CastedOn <= endDate
                                    group v by v.CharacterId into votesGroup
                                    select new VotesViewModel()
                                    {
                                        CharacterId = votesGroup.Key,
                                        Votes = votesGroup.Count()
                                    })) on c.CharacterId equals v.CharacterId into cv
                        from vv in cv.DefaultIfEmpty()
                        orderby vv.Votes descending
                        select new CharacterViewModel()
                        {
                            CharacterId = c.CharacterId,
                            Name = c.Name,
                            Votes = (vv == null ? 0 : vv.Votes == null ? 0 : vv.Votes) ?? 0,
                            Description = c.Description,
                            Picture = c.Picture != null ? String.Format(System.Globalization.CultureInfo.InvariantCulture, "data:image/png;base64,{0}", Convert.ToBase64String(c.Picture!)) : "",
                        };

            return query.Take(5);

        }


        public async Task<CharacterByTimeViewModel> PopularCharacterByTime(DateTime startDate)
        {
             
            try
            {
                
                var Characters = await FetchCharacters();

                var query = (from v in _context.Votes
                             where v.CastedOn == startDate
                             group v by new { v.CastedOn.Date, v.CharacterId } into votesGroup
                             orderby votesGroup.Key.Date
                             select new TotalVotesViewModel()
                             {
                                 Day = (votesGroup.Key.Date).ToString("dd-MM-yyyy"),
                                 CharacterId = votesGroup.Key.CharacterId,
                                 TotalVotes = votesGroup.Count(),
                                 MorningVotes = votesGroup.Count(v => v.CastedOn.Hour > 1 && v.CastedOn.Hour < 12),
                                 AfternoonVotes = votesGroup.Count(v => v.CastedOn.Hour > 12 && v.CastedOn.Hour < 19),
                                 EveningVotes = votesGroup.Count(v => v.CastedOn.Hour > 19),
                             });

                var finalList = query.ToList();

               
               
                var day = finalList.Select(q => q.Day).FirstOrDefault();
                //var list = new List<CharacterByTimeViewModel>();
               
                CharacterViewModel? mpc = new(), apc = new(), epc = new();
                //foreach (var day in days)


                //{
                    try
                    {
                        var mpcSum = finalList.Where(q => q.Day == day).Sum(q => q.MorningVotes);
                        if (mpcSum > 0)
                        {
                            var mpcId = finalList.Where(q => q.Day == day).OrderByDescending(q => q.MorningVotes).Select(q => q.CharacterId).FirstOrDefault();
                            mpc = Characters.Where(c => c.CharacterId == mpcId).FirstOrDefault();
                            mpc!.Picture = "";
                        }
                        else
                        {
                            mpc = null;
                        }



                        var apcSum = finalList.Where(q => q.Day == day).Sum(q => q.AfternoonVotes);
                        if (apcSum > 0)
                        {
                            var apcId = finalList.Where(q => q.Day == day).OrderByDescending(q => q.AfternoonVotes).Select(q => q.CharacterId).FirstOrDefault();
                            apc = Characters.Where(c => c.CharacterId == apcId).FirstOrDefault();
                            apc!.Picture = "";
                        }
                        else
                        {
                            apc = null;
                        }


                        var epcSum = finalList.Where(q => q.Day == day).Sum(q => q.EveningVotes);
                        if (epcSum > 0)
                        {
                            var epcId = finalList.Where(q => q.Day == day).OrderByDescending(q => q.EveningVotes).Select(q => q.CharacterId).FirstOrDefault();
                            epc = Characters.Where(c => c.CharacterId == epcId).FirstOrDefault();
                            epc!.Picture = "";
                        }
                        else
                        {
                            epc = null;
                        }

                    }
                    catch (Exception e)
                    {


                    }

                   var viewModel = new CharacterByTimeViewModel
                    {
                        Day = day,
                        MorningPopularCharacter = mpc,
                        AfternoonPopularCharacter = apc,
                        EveningPopularCharacter = epc,
                    };
                    //list.Add(viewModel);
                //}

               return viewModel;
            }
            catch (Exception e)
            {

                throw new DisneyException(e.Message);
            }

        }

        public async Task<IEnumerable<string>> GetAllVoteDates()
        {
             
            try
            {
                var query = await _context.Votes.Select(v=>v.CastedOn.Date.ToString("dd-MM-yyyy")).Distinct().ToListAsync();


               return query;
            }
            catch (Exception e)
            {

                throw new DisneyException(e.Message);
            }

        }



    }
}
