
using Disney.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;


namespace Disney.Context
{
    public class DisneyContext : DbContext
    {

        public DisneyContext(DbContextOptions options) : base(options)

        {

        }


        public DbSet<User> Users { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Province> Provinces { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<Vote> Votes { get; set; }


        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<DateOnly>()
                .HaveConversion<DateOnlyConverter, DateOnlyComparer>()
                .HaveColumnType("date");

            configurationBuilder.Properties<DateOnly?>()
                .HaveConversion<NullableDateOnlyConverter, NullableDateOnlyComparer>()
                .HaveColumnType("date");


        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>(etb =>
            {
                etb.HasKey(u => u.UserId);
                etb.Property(u => u.UserId).ValueGeneratedOnAdd();
                etb.Property(u => u.Name).IsRequired().HasMaxLength(250);
                etb.Property(u => u.Created)
                    .HasDefaultValueSql("getdate()");
                etb.ToTable("Users");
            });

             modelBuilder.Entity<Character>(etb =>
            {
                etb.HasKey(c => c.CharacterId);
                etb.Property(c => c.CharacterId).ValueGeneratedOnAdd();
                etb.Property(c => c.Name).IsRequired().HasMaxLength(250);
                
                etb.ToTable("Characters");
            });

             modelBuilder.Entity<Vote>(etb =>
            {
                etb.HasKey(c => c.VoteId);
                etb.Property(c => c.VoteId).ValueGeneratedOnAdd();
                etb.Property(c => c.CharacterId).IsRequired();
                etb.Property(c => c.UserId).IsRequired();
                 etb.Property(u => u.CastedOn)
                    .HasDefaultValueSql("getdate()");
                etb.ToTable("Votes");
            });




            modelBuilder.Entity<Province>(etb =>
            {
                etb.HasKey(e => e.ProvinceId);
                etb.Property(e => e.ProvinceId).ValueGeneratedOnAdd();
                etb.Property(e => e.Name).IsRequired().HasMaxLength(250);
                etb.ToTable("Provinces");
            });

            modelBuilder.Entity<City>(etb =>
            {
                etb.HasKey(e => e.CityId);
                etb.Property(e => e.CityId).ValueGeneratedOnAdd();
                etb.Property(e => e.Name).IsRequired().HasMaxLength(250);
                etb.ToTable("Cities");
            });

                    }

    }

    public class DateOnlyConverter : ValueConverter<DateOnly, DateTime>
    {
        /// <summary>
        /// Creates a new instance of this converter.
        /// </summary>
        public DateOnlyConverter() : base(
                d => d.ToDateTime(TimeOnly.MinValue),
                d => DateOnly.FromDateTime(d))
        { }
    }

    /// <summary>
    /// Compares <see cref="DateOnly" />.
    /// </summary>
    public class DateOnlyComparer : ValueComparer<DateOnly>
    {
        /// <summary>
        /// Creates a new instance of this converter.
        /// </summary>
        public DateOnlyComparer() : base(
            (d1, d2) => d1 == d2 && d1.DayNumber == d2.DayNumber,
            d => d.GetHashCode())
        {
        }
    }

    /// <summary>
    /// Converts <see cref="DateOnly?" /> to <see cref="DateTime?"/> and vice versa.
    /// </summary>
    public class NullableDateOnlyConverter : ValueConverter<DateOnly?, DateTime?>
    {
        /// <summary>
        /// Creates a new instance of this converter.
        /// </summary>
        public NullableDateOnlyConverter() : base(
            d => d == null
                ? null
                : new DateTime?(d.Value.ToDateTime(TimeOnly.MinValue)),
            d => d == null
                ? null
                : new DateOnly?(DateOnly.FromDateTime(d.Value)))
        { }
    }

    /// <summary>
    /// Compares <see cref="DateOnly?" />.
    /// </summary>
    public class NullableDateOnlyComparer : ValueComparer<DateOnly?>
    {
        /// <summary>
        /// Creates a new instance of this converter.
        /// </summary>
        public NullableDateOnlyComparer() : base(
            (d1, d2) => d1 == d2 && d1.GetValueOrDefault().DayNumber == d2.GetValueOrDefault().DayNumber,
            d => d.GetHashCode())
        {
        }
    }

}
