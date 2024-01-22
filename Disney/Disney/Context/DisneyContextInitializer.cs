using Microsoft.EntityFrameworkCore;

namespace Disney.Context
{
    public static class DisneyContextInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new DisneyContext(
                serviceProvider.GetRequiredService<
                    DbContextOptions<DisneyContext>>());
            // Look for any movies.

        }
    }
}