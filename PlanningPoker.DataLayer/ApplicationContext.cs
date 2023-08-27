using ElectroPrognizer.Utils.Helpers;
using Microsoft.EntityFrameworkCore;

namespace PlanningPoker.DataLayer;

public class ApplicationContext : DbContext
{
    public ApplicationContext()
    {
        //Database.EnsureDeleted();
        Database.EnsureCreated();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(ConfigurationHelper.ConntectionString);

#if DEBUG
        //optionsBuilder.LogTo((message) => { Debug.WriteLine(message); });
#endif
    }
}
