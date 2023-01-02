using System;
using System.ComponentModel.DataAnnotations;

namespace gaeb_gateway_backend.Models.DTOs
{
    // The expecting body of the request
	public class UserRegistrationRequestDto
	{
        
        
		public string firstName { get; set; }
        
       
        //public string lastName { get; set; }

       
        public string email { get; set; }

        
        public string password { get; set; }
	}
}

