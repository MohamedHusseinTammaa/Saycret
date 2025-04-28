using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;

namespace Saycret.Data
{
    public class SaycretDbContextFactory : IDesignTimeDbContextFactory<SaycretDbContext>
    {
        public SaycretDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<SaycretDbContext>();
            optionsBuilder.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));

            return new SaycretDbContext(optionsBuilder.Options);
        }
    }
}
