using gaeb_gateway_backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace gaeb_gateway_backend.Data;

public class ApiDbContext : IdentityDbContext<ApplicationUser>
{
    // Represents a database table of users.
    public DbSet<User> Users { get; set; }

    // Represents a database table of refresh tokens.
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    // Constructor that takes in an instance of DbContextOptions<ApiDbContext> and calls the base constructor with the same parameter.
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {

    }
}


