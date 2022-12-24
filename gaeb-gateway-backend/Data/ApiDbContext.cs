using System;
using Microsoft.EntityFrameworkCore;

namespace gaeb_gateway_backend.Data;

public class ApiDbContext : DbContext
{

    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }
}

