using System;
using Microsoft.AspNetCore.Identity;

namespace gaeb_gateway_backend.Models;

public class ApplicationUser: IdentityUser
{
	public string FirstName { get; set; }
	public string LastName { get; set; }
}

