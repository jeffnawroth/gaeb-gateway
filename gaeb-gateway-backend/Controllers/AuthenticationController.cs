using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using gaeb_gateway_backend.Configurations;
using gaeb_gateway_backend.Models;
using gaeb_gateway_backend.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NuGet.Common;

namespace gaeb_gateway_backend.Controllers;

[Route("api/[controller]")] // api/authentication
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    //private readonly JwtConfig _jwtConfig;

    public AuthenticationController(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration
        //JwtConfig jwtConfig
        )
    {
        _userManager = userManager;
        _configuration = configuration;
        //_jwtConfig = jwtConfig;
    }

    [HttpPost]
    [Route("Register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationRequestDto requestDto)
    {
        // Validate the incoming request
        if (ModelState.IsValid)
        {
            // Check if email already exists
            var user_exist = await _userManager.FindByEmailAsync(requestDto.Email);

            if(user_exist != null)
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>()
                    {
                        "Email already exists. Please Log in."
                    }
                });
            }

            // Create a user
            var new_user = new ApplicationUser()
            {
                FirstName = requestDto.FirstName,
                LastName = requestDto.LastName,
                Email = requestDto.Email,
                UserName = requestDto.FirstName + "." + requestDto.LastName
                 
            };

                      
            var is_created = await _userManager.CreateAsync(new_user, requestDto.Password);

            if (!is_created.Succeeded)
            {
                // Get the errors from the result
                var errors = is_created.Errors.Select(e => e.Description);
                // Return a BadRequest response with the errors
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors2 = errors
                });
            }


            if (is_created.Succeeded)
            {
                // Generate the token
                var token = GenerateJwtToken(new_user);

                return Ok(new AuthUserResult()
                {
                    FirstName = requestDto.FirstName,
                    LastName = requestDto.LastName,
                    Email = requestDto.Email,
                    Token = token

                });
            }

            return BadRequest(new AuthResult()
            {
                Errors = new List<string>()
                {
                    "Server error"
                },
                Result = false
            });
        }

        return BadRequest();
    }

    
    [Route("Login")]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] UserLoginRequestDto loginRequest)
    {
        if (ModelState.IsValid)
        {
            // Check if user exists
            var existing_user = await _userManager.FindByEmailAsync(loginRequest.email);

            if (existing_user == null)
                return BadRequest(new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Invalid payload"
                    },
                    Result = false
                });
            var isCorrect = await _userManager.CheckPasswordAsync(existing_user, loginRequest.password);

            if (!isCorrect)
                return BadRequest(new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Invalid credentials"
                    },
                    Result = false
                });

            var jwtToken = GenerateJwtToken(existing_user);

            return Ok(new AuthUserResult()
            {
                FirstName = existing_user.FirstName,
                LastName = existing_user.LastName,
                Email = existing_user.Email,
                Token = jwtToken

            });
        }

        return BadRequest(new AuthResult()
        {
            Errors = new List<string>()
            {
                "Invalid payload"
            },
            Result = false
        });


     }
   

private string GenerateJwtToken(ApplicationUser user)
{
    var jwtTokenHandler = new JwtSecurityTokenHandler();

    // Get key from configuration
    var key = Encoding.UTF8.GetBytes(_configuration.GetSection("JwtConfig:Secret").Value);

        // Token descriptor
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim("Id", user.Id),
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Email, value:user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString())
                }),

            // Set expire time for token
            Expires = DateTime.Now.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        };

        // Tokenhandler to create Token based on the tokenDescriptor information
        var token = jwtTokenHandler.CreateToken(tokenDescriptor);
        return jwtTokenHandler.WriteToken(token);

   }

}




