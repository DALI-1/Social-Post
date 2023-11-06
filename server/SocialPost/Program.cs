using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SocialPostBackEnd.Data;
using SocialPostBackEnd.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews()
    .AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options=>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization Header using Bearer scheme (\"bearer {token}\")",
        In=ParameterLocation.Header,
        Name="Authorization",
        Type=SecuritySchemeType.ApiKey
    }) ;
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey=true,
            IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value))
            ,
            ValidateIssuer=false,
            ValidateAudience=false
        };
        });

builder.Services.AddDbContext<ApplicationDbContext>(
    options => {
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
            o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)
            );
      /* options.UseLazyLoadingProxies(true);
        options.ConfigureWarnings(warn => warn.Ignore(CoreEventId.DetachedLazyLoadingWarning));
        options.UseQueryTrackingBehavior(QueryTrackingBehavior.TrackAll);*/
    });
builder.Services.AddCors(p => p.AddPolicy("corspolicy", build =>
{
    build.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader();
    build.WithOrigins("https://graph.facebook.com:443").AllowAnyMethod().AllowAnyHeader();

   
}
));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseCors("corspolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
