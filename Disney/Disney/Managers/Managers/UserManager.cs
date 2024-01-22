﻿using AutoMapper;
using Disney.Domain.Helpers;
using Disney.Domain.Models;
using Disney.Domain.Viewmodels;
using Disney.Context;
using Disney.Managers.Interfaces;
using Disney.Security;
using Microsoft.EntityFrameworkCore;



namespace Disney.Managers.Managers
{
    public class UserManager : IUserManager
    {
        private readonly DisneyContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtUtils _jwtUtils;
        private readonly IEncryptionHandler _encryptionHandler;

        public UserManager(DisneyContext context, IJwtUtils jwtUtils, IMapper mapper, IEncryptionHandler encryptionHandler)
        {
            _context = context;
            _mapper = mapper;
            _jwtUtils = jwtUtils;
            _encryptionHandler = encryptionHandler;
        }

        public async Task<bool> ChangeUserStatus(int id)
        {

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new DisneyException("User does not exists");
            }
            else if (user.Name == Roles.Administrator)
            {
                throw new DisneyException("Change not allowed Please contact the Administrator");
            }


            user.IsActive = !user.IsActive;
            _context.Entry(user).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return true;


        }

        public async Task<bool> AddToRole(int id, string roleCode)
        {

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new DisneyException("User does not exists");
            }
            else if (user.Name == Roles.Administrator)
            {
                throw new DisneyException("Change not allowed Please contact the Administrator");
            }
            user.Role = roleCode;
            _context.Entry(user).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return true;


        }

        public async Task<bool> AddToRole(int id)
        {

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new DisneyException("User does not exists");
            }
            else if (user.Name == Roles.Administrator)
            {
                throw new DisneyException("Change not allowed Please contact the Administrator");
            }
            user.Role = "Staff";
            _context.Entry(user).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return true;


        }

        public async Task<string> ResetSecret(int id)
        {

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                throw new DisneyException("User does not exists");
            }
            else if (user.Name == Roles.Administrator)
            {
                throw new DisneyException("Change not allowed Please contact the Administrator");
            }

            byte[] salt = HashHandler.GenerateRandomSalt();
            string hash = HashHandler.ComputeHash("123@abc", salt);

            user.Password = hash;
            user.PasswordSalt = Convert.ToBase64String(salt);
            _context.Entry(user).State = EntityState.Modified;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return "Password has been reset";

        }

        public async Task<string> ChangeSecret(string identifier, string secret, string newsecret)
        {

            if (string.IsNullOrEmpty(identifier) || string.IsNullOrEmpty(secret) || string.IsNullOrEmpty(newsecret))
            {
                throw new DisneyException("Invalid Arguments");
            }

            if (identifier.ToLowerInvariant() == "admin")
                throw new DisneyException("Change not allowed Please contact the Administrator");

            var finalSecret = _encryptionHandler.DecryptRsa(secret);
            var finalNewSecret = _encryptionHandler.DecryptRsa(newsecret);

            var result = Validate(identifier, finalSecret).Result;

            if (result == null || result.Success)
            {
                throw new DisneyException("Password is not correct");
            }

            var user = await _context.Users.FindAsync(1);

            if (user == null)
                throw new DisneyException("User does not exists");

            byte[] salt = HashHandler.GenerateRandomSalt();
            string hash = HashHandler.ComputeHash(finalNewSecret, salt);

            user.Password = hash;
            user.PasswordSalt = Convert.ToBase64String(salt);
            _context.Entry(user).State = EntityState.Modified;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return "Password has been changed";


        }

        public async Task<UserViewModel?> GetUser(int id, bool deleted = false)
        {

            if (id <= 0)
                throw new DisneyException("Id is not valid");

            var query = (from user in _context.Users
                         join city in _context.Cities on user.CityId equals city.CityId
                         join province in _context.Provinces on city.ProvinceId equals province.ProvinceId
                         where user.UserId == id && user.Deleted == deleted

                         select new UserViewModel
                         {
                             Name = user.Name,
                             id = user.UserId,
                             Created = user.Created,
                             DateofBirth = user.DateofBirth,
                             PhoneNo = user.PhoneNo,
                             Gender = user.Gender,
                             IsActive = user.IsActive,
                             //Picture = user.Picture != null ? String.Format(System.Globalization.CultureInfo.InvariantCulture, "data:image/png;base64,{0}", Convert.ToBase64String(user.Picture!)) : "",
                             Role = user.Role,
                             City = city.Name,
                             Province = province.Name,
                             Username = user.Username,
                             CityId = user.CityId,

                             ProvinceId = province.ProvinceId,
                             Deleted = user.Deleted
                         });

            return await query!.FirstOrDefaultAsync();


        }

        private async Task<IEnumerable<UserViewModel>> FetchUsers(bool v = false, bool deleted = false)
        {
            var query = (from user in _context.Users
                         join city in _context.Cities on user.CityId equals city.CityId
                         join province in _context.Provinces on city.ProvinceId equals province.ProvinceId
                         //where user.Name != Roles.Administrator
                         select new UserViewModel
                         {
                             Name = user.Name,
                             id = user.UserId,
                             Created = user.Created,
                             DateofBirth = user.DateofBirth,
                             PhoneNo = user.PhoneNo,
                             Gender = user.Gender,
                             IsActive = user.IsActive,
                             Picture = user.Picture != null ? String.Format(System.Globalization.CultureInfo.InvariantCulture, "data:image/png;base64,{0}", Convert.ToBase64String(user.Picture!)) : "",
                             Role = user.Role,
                             City = city.Name,
                             Province = province.Name,
                             Username = user.Username,
                             CityId = user.CityId,
                             ProvinceId = province.ProvinceId,
                             Deleted = user.Deleted
                         });

            var data = await query.ToListAsync();

            if (deleted)
            {
                data = data.Where(d => d.Deleted == false).ToList();
            }
            return data;
        }

        public async Task<IEnumerable<UserViewModel>> GetUsers(DataFilter filter)
        {
            var users = await FetchUsers(false, filter.Deleted);
            return Sort(filter.SortField, filter.Order, Search(filter.Term == null ? "" : filter.Term, users));
        }

        public async Task<IEnumerable<UserViewModel>> GetDoctors()
        {
            var users = await FetchUsers(true);
            return users;
        }

        private static IEnumerable<UserViewModel> Search(string term, IEnumerable<UserViewModel> user)
        {
            IEnumerable<UserViewModel> users = new List<UserViewModel>();
            if (string.IsNullOrEmpty(term))
            {
                return user;
            }
            else
            {
                var query = from u in user
                            where
                            u.Name!.Contains(term) || u.Role!.Contains(term) ||
                            u.Username!.Contains(term) || u.City!.Contains(term) || u.PhoneNo!.Contains(term)
                            select u;


                return query.ToList();
            }
        }

        private static IEnumerable<UserViewModel> Sort(int field, int order, IEnumerable<UserViewModel> user)
        {
            IEnumerable<UserViewModel> users = new List<UserViewModel>();
            users = field switch
            {
                1 => order == 1 ? user.OrderBy(p => p.Name) : user.OrderByDescending(p => p.Name),
                4 => order == 1 ? user.OrderBy(p => p.Role) : user.OrderByDescending(p => p.Role),
                5 => order == 1 ? user.OrderBy(p => p.Username) : user.OrderByDescending(p => p.Username),
                6 => order == 1 ? user.OrderBy(p => p.City) : user.OrderByDescending(p => p.City),
                _ => user,
            };
            return users;
        }

        public bool SignOut()
        {
            return true;
        }

        public async Task<string> SignUp(UserViewModel viewmodel)
        {

            var usernameExists = await _context.Users.AnyAsync(u => u.Username == viewmodel.Username);
            if (usernameExists)
                throw new DisneyException("Username already exists");


            viewmodel.Password = string.IsNullOrEmpty(viewmodel.Password) ? "123@abc" : viewmodel.Password;

            var model = _mapper.Map<User>(viewmodel);
           
            if (!string.IsNullOrEmpty(viewmodel.Password))
            {
                byte[] salt = HashHandler.GenerateRandomSalt();
                string hash = HashHandler.ComputeHash(viewmodel.Password, salt);

                model.Password = hash;
                model.PasswordSalt = Convert.ToBase64String(salt);
            }

            if (!string.IsNullOrEmpty(viewmodel.Picture))
            {
                var pictureString = viewmodel.Picture.Replace(@"\/", "/");
                try
                {
                    string converted = viewmodel.Picture.Replace('-', '+');
                    converted = converted.Replace('_', '/');
                    model.Picture = Convert.FromBase64String(converted);
                }
                catch (Exception)
                {
                    model.Picture = Convert.FromBase64String(pictureString);

                }
            }

            _context.Users.Add(model);
            await _context.SaveChangesAsync();
            return "User has been created";

        }

        public async Task<ValidateResult> Validate(string identifier, string secret)
        {

            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == identifier)!;
                if (user == null)
                {
                    throw new DisneyException("User not found");
                }
                if (!user.IsActive)
                {
                    throw new DisneyException("User is not active");
                }

                if (string.IsNullOrEmpty(secret))
                {
                    throw new DisneyException("Password is not valid");

                }
                var finalSecret =_encryptionHandler.DecryptRsa(secret);
                byte[] salt = Convert.FromBase64String(user.PasswordSalt);
                string hash = HashHandler.ComputeHash(finalSecret, salt);

                if (user.Password != hash)
                {
                    return new ValidateResult(success: false, error: ValidateErrors.SecretNotValid);
                }
                else
                {
                    var userVm = await GetUser(user.UserId);
                    if (userVm is null)
                    {
                        throw new DisneyException("User not found");
                    }
                    var jwtToken = _jwtUtils.GenerateJwtToken(userVm);
                    ValidateResult vr = new(userVm, jwtToken, success: true);
                    return vr;

                }
            }
            catch (Exception e)
            {

                throw new DisneyException(e.Message);
            }




        }

        public async Task<bool> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new DisneyException("User does not exists");
            }
            else if (user.Name == Roles.Administrator)
            {
                throw new DisneyException("Change not allowed Please contact the Administrator");
            }
            user.Deleted = false;
            _context.Entry(user).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> Update(UserViewModel viewmodel)
        {

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == viewmodel.id);
            if (user == null)
                throw new DisneyException("User does not exists");
            if (user.Name == Roles.Administrator)
                throw new DisneyException("Change not allowed Please contact the Administrator");
            var usernameExists = await _context.Users.AnyAsync(u => u.Username == viewmodel.Username && u.UserId != viewmodel.id);
            if (usernameExists)
                throw new DisneyException("Username already exists");

            user.Name = ResolveNullinString(viewmodel.Name, user.Name);
            user.DateofBirth = viewmodel.DateofBirth;
            user.Gender = ResolveNullinString(viewmodel.Gender, user.Gender);
            user.CityId = viewmodel.CityId;
            user.Role = ResolveNullinString(viewmodel.Role, user.Role);
            user.PhoneNo = ResolveNullinString(viewmodel.PhoneNo, user.PhoneNo);


            if (!string.IsNullOrEmpty(viewmodel.Picture))
            {
                var pictureString = viewmodel.Picture.Replace(@"\/", "/");
                try
                {
                    string converted = viewmodel.Picture.Replace('-', '+');
                    converted = converted.Replace('_', '/');
                    user.Picture = Convert.FromBase64String(converted);
                }
                catch (Exception)
                {
                    user.Picture = Convert.FromBase64String(pictureString);

                }
            }
            _context.Entry(user).State = EntityState.Modified;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return "User has been updated";

        }

        public async Task<bool> CheckDuplicate(DuplicateType type, string value, int id = -1)
        {
            bool user = false;

            switch (type)
            {
                case DuplicateType.Username:
                    user = id == -1 ? await _context.Users.AnyAsync(u => u.Username == value) : await _context.Users.AnyAsync(u => u.Username == value && u.UserId != id);
                    break;
            }

            return user;

        }

        private static string ResolveNullinString(string? value, string actualValue = "")
        {
            return string.IsNullOrEmpty(value) ? actualValue : value;
        }

    }
}
