using System;
namespace gaeb_gateway_backend.Models
{
	// Response information from API
	public class AuthResult
	{
		public string Token { get; set; }
		public bool Result { get; set; }
		public List<string> Errors { get; set; }
		public IEnumerable<string>? Errors2 { get; set; }

    }
}

