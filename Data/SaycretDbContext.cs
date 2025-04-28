using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Saycret.Models;

namespace Saycret.Data
{
    public class SaycretDbContext : DbContext
    {
        public SaycretDbContext (DbContextOptions<SaycretDbContext> options): base(options)
        {
            
        }
        public DbSet<Confession> Confessions { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
