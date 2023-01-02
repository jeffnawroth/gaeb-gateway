using System;
using System.ComponentModel.DataAnnotations;

namespace gaeb_gateway_backend.Models.DTOs
{
    // The expecting body of the request
	public class UserRegistrationRequestDto
	{

        [Required]
		public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
	}
}

