using SocialPost_PlatformAccountService;
using SocialPostBackEnd.Data;
using Microsoft.EntityFrameworkCore;
//Getting the configuration Object So I get the Connection String
var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();
IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
       
        services.AddHostedService<Worker>();
        services.AddDbContext<ApplicationDbContext>(options => {
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)
                );
            /* options.UseLazyLoadingProxies(true);
              options.ConfigureWarnings(warn => warn.Ignore(CoreEventId.DetachedLazyLoadingWarning));
              options.UseQueryTrackingBehavior(QueryTrackingBehavior.TrackAll);*/
        }, ServiceLifetime.Singleton);
    })
    //Disabling Queries info for the console.
    .ConfigureLogging(logging =>
    {
        logging.ClearProviders();
        logging.AddConsole();
        logging.SetMinimumLevel(LogLevel.Warning);
        logging.AddFilter("Microsoft.EntityFrameworkCore", LogLevel.Warning);
    })
    .Build();

await host.RunAsync();
