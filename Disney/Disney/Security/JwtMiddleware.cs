﻿//using Disney.Helpers;
using Disney.Managers.Interfaces;
using Microsoft.Extensions.Options;

namespace Disney.Security
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly AppSettings _appSettings;
        private readonly ILogger<JwtMiddleware> _logger;

        public JwtMiddleware(RequestDelegate next, IOptions<AppSettings> appSettings, ILogger<JwtMiddleware> logger)
        {
            _next = next;
            _appSettings = appSettings.Value;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context, IUserManager userManager, IJwtUtils jwtUtils)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token is not null)
            {
                var userId = jwtUtils.ValidateJwtToken(token);
                if (userId is not null)
                {
                    context.Items["User"] = await userManager.GetUser((int)userId.Value);
                }
            }



            await _next(context);
        }


    }
}
