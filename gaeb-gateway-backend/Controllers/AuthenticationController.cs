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

namespace gaeb_gateway_backend.Controllers;

[Route("api/[controller]")] // api/authentication
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthenticationController(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration
        )
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    /// <summary>
    /// Registers a new user.
    /// </summary>
    /// <param name="requestDto">The user registration request data transfer object (DTO).</param>
    /// <returns>A 200 OK response with the user's first name, last name, email, and JWT token if the registration is successful, or a 400 Bad Request error with the validation errors if the request is invalid.</returns>
    /// <response code="200">If the registration is successful.</response>
    /// <response code="400">If the request is invalid or the email is already registered.</response>
    /// <response code="500">If an exception occurs while registering the user.</response>
    [HttpPost]
    [Route("Register")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
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
                    
                    Errors = new List<string>()
                    {
                        "Email existiert bereits. Bitte einloggen."
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
                    "Server Fehler"
                },
                
            }); ;
        }

        return BadRequest();
    }

    
    /// <summary>
    /// Logs in a user.
    /// </summary>
    /// <param name="loginRequest">The user login request data transfer object (DTO).</param>
    /// <returns>A 200 OK response with the user's first name, last name, email, and JWT token if the login is successful, or a 400 Bad Request error with the validation errors if the request is invalid.</returns>
    /// <response code="200">If the login is successful.</response>
    /// <response code="400">If the request is invalid or the email is not registered or the password is incorrect.</response>
    /// <response code="500">If an exception occurs while logging in the user.</response>
    [Route("Login")]
    [HttpPost]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> Login([FromBody] UserLoginRequestDto loginRequest)
    {
        if (ModelState.IsValid)
        {
            // Check if user exists
            var existing_user = await _userManager.FindByEmailAsync(loginRequest.Email);

            if (existing_user == null)
                return BadRequest(new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Ungültiger Payload"
                    },
                });
            var isCorrect = await _userManager.CheckPasswordAsync(existing_user, loginRequest.Password);

            if (!isCorrect)
                return BadRequest(new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Email und Passwort stimmen nicht überein."
                    },
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
                "Ungültiger Payload"
            },
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
            Issuer = "https://localhost:7043/",
            Audience = "https://localhost:7043/",
            Subject = new ClaimsIdentity(new[]
            {
            new Claim("Id", user.Id),
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Email, value:user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString()),
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




