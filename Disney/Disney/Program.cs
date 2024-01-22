using AutoMapper;
using Disney.Context;
using Disney.Managers.Interfaces;
using Disney.Managers.Managers;
using Disney.Profiles;
using Disney.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
var services = builder.Services;
// Add services to the container.

services.AddHttpLogging(logging =>
{
    logging.LoggingFields = HttpLoggingFields.All;
    logging.RequestHeaders.Add("sec-ch-ua");
    logging.ResponseHeaders.Add("MyResponseHeader");
    logging.MediaTypeOptions.AddText("application/javascript");
    logging.RequestBodyLogLimit = 4096;
    logging.ResponseBodyLogLimit = 4096;
});
services.AddDbContext<DisneyContext>(options =>
    options.UseSqlServer("name=ConnectionStrings:DefaultConnection"));
services.AddSession(options =>
{
    options.Cookie.Name = ".Disney.Session";
    options.IdleTimeout = TimeSpan.FromSeconds(300);
    options.Cookie.IsEssential = true;
});
services.Configure<JsonOptions>(options =>
{
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    options.SerializerOptions.PropertyNamingPolicy = null;
});
services.AddControllers();
services.Configure<FormOptions>(o =>
{
    o.ValueLengthLimit = int.MaxValue;
    o.MultipartBodyLengthLimit = int.MaxValue;
    o.MemoryBufferThreshold = int.MaxValue;
});
services.AddMvc().AddRazorOptions(options =>
{
    options.ViewLocationFormats.Add("/{0}.cshtml");
});

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["AppSettings:Issuer"],
        ValidAudience = builder.Configuration["AppSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Secret"]!))
    };
});
services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
{
    builder
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    .WithOrigins("http://localhost:4200");
}));
var configuration = new MapperConfiguration(cfg =>
{
    cfg.AddProfile<UserProfile>();
    cfg.AddProfile<CityProfile>();
    cfg.AddProfile<ProvinceProfile>();
    cfg.AddProfile<CharacterProfile>();
});
var mapper = new Mapper(configuration);
services.AddSingleton(mapper);
services.AddAutoMapper(typeof(UserProfile));
services.AddAutoMapper(typeof(CityProfile));
services.AddAutoMapper(typeof(ProvinceProfile));
services.AddAutoMapper(typeof(CharacterProfile));


services.AddScoped<IJwtUtils, JwtUtils>();
services.AddScoped<IEncryptionHandler, EncryptionHandler>();
services.AddScoped<IUserManager, UserManager>();
services.AddScoped<ICityManager, CityManager>();
services.AddScoped<IProvinceManager, ProvinceManager>();
services.AddScoped<ICharacterManager, CharacterManager>();

services.AddLogging(logging => logging.AddConsole());
var app = builder.Build();

// Configure the HTTP request pipeline.
//app.UseStaticFiles();
//app.UseStaticFiles(new StaticFileOptions()
//{

app.UseHttpsRedirection();
app.UseHttpLogging();
app.UseMiddleware<JwtMiddleware>();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();
app.UseCors("CorsPolicy");
app.MapControllers();
app.Run("https://localhost:4000");

