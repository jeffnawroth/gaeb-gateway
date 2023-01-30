using System;
using Microsoft.Build.Framework;

namespace gaeb_gateway_backend.Models.DTOs;

public class TokenRequest
{
	[Required]
	public string Token { get; set; }

	[Required]
	public string RefreshToken { get; set; }
}

