﻿using Disney.Domain.Viewmodels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Disney.Security.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : TypeFilterAttribute
    {
        public AuthorizeAttribute(params string[] claim) : base(typeof(AuthorizeFilter))
        {
            Arguments = [claim];
        }
    }

    public class AuthorizeFilter(params string[] claim) : IAuthorizationFilter
    {
        readonly string[] _claim = claim;

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
            if (allowAnonymous)
                return;

            if (context.HttpContext.Items["User"] is UserViewModel user)
            {
                bool flagClaim = false;
                foreach (var item in _claim)
                {
                    flagClaim = user.Role == item;
                    if (flagClaim)
                        break;
                }


                if (!flagClaim)
                {
                    // authorization
                    // not logged in or role not authorized
                    context.Result = new JsonResult(new { message = "Unauthorized" })
                    { StatusCode = StatusCodes.Status401Unauthorized };

                }
            }
            else
            {

                context.Result = new JsonResult(new { message = "Unauthorized" })
                { StatusCode = StatusCodes.Status401Unauthorized };
            }
            return;
        }
    }
}
