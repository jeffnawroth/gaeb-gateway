using System;
using gaeb_gateway_backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using static Npgsql.PostgresTypes.PostgresCompositeType;

namespace gaeb_gateway_backend.Data;

public class ApiDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {

    }
    
}

