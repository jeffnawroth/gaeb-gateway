using System;
using System.ComponentModel.DataAnnotations;

namespace gaeb_gateway_backend.Models.DTOs;

public class UserLoginRequestDto
{
	[Required]
	public string email { get; set; }

    [Required]
    public string password { get; set; }
}

