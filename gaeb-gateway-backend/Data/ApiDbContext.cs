using System;
using gaeb_gateway_backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace gaeb_gateway_backend.Data;

public class ApiDbContext : IdentityDbContext
{
    public DbSet<User> Users { get; set; }

    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {

    }
}

