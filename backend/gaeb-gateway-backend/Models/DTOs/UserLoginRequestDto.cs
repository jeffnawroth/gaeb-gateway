using System;
using System.ComponentModel.DataAnnotations;

namespace gaeb_gateway_backend.Models.DTOs;

public class UserLoginRequestDto
{
	[Required]
	public string Email { get; set; }

    [Required]
    public string Password { get; set; }
}

