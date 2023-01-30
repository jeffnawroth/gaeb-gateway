using System;
namespace gaeb_gateway_backend.Models
{
	public class AuthUserResult
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public string Token { get; set; }
		public string RefreshToken {get; set;}
	}
}

