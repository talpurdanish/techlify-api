using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Disney.Context
{
    public class DisneyContextFactory : IDesignTimeDbContextFactory<DisneyContext>
    {
        public DisneyContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<DisneyContext>();
            optionsBuilder.UseSqlServer("Data Source=THINKPAD;Initial Catalog=DisneyContext;Integrated Security=True;MultipleActiveResultSets=True;TrustServerCertificate=True;Encrypt=False");
            //optionsBuilder.UseSqlServer("Data Source=SQL8005.site4now.net;Initial Catalog=db_a981df_medicalcontext;User Id=db_a981df_medicalcontext_admin;Password=lup@fg3WT3");
            return new DisneyContext(optionsBuilder.Options);
        }
    }
}
