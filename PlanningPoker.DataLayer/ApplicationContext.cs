using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using PlanningPoker.DataModel;

namespace PlanningPoker.DataLayer;

public class ApplicationContext : DbContext
{
    public DbSet<Game> Games { get; set; }
    public DbSet<GameSubTask> GameSubTasks { get; set; }

    public ApplicationContext()
    {
        //Database.EnsureDeleted();
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Data Source=.\\SQLExpress;Initial Catalog=PlanningPoker;Integrated Security=True;TrustServerCertificate=True");
        //optionsBuilder.UseSqlite("Data Source=Database.db");

#if DEBUG
        optionsBuilder.LogTo((message) => { Debug.WriteLine(message); });
#endif
    }
}
