using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography.Pkcs;
using System.Text;
using System.Threading.Tasks;
using gaeb_gateway_backend.Configurations;
using gaeb_gateway_backend.Data;
using gaeb_gateway_backend.Models;
using gaeb_gateway_backend.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace gaeb_gateway_backend.Controllers;

[Route("api/[controller]")] // api/authentication
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly TokenValidationParameters _tokenValidationParameters;
    private readonly RoleManager<IdentityRole> roleManager;

    private readonly ApiDbContext _context;

    public AuthenticationController(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration,
        ApiDbContext context,
        TokenValidationParameters tokenValidationParameters,
        RoleManager<IdentityRole> roleManager
        )
    {
        _context = context;
        _userManager = userManager;
        _configuration = configuration;
        _tokenValidationParameters = tokenValidationParameters;
        this.roleManager = roleManager;
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
                UserName = requestDto.FirstName + "." + requestDto.LastName,
                Role = requestDto.Role
                
                 
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
                
                // Adding role
                if (!await roleManager.RoleExistsAsync(requestDto.Role))
                    await roleManager.CreateAsync(new IdentityRole(requestDto.Role));
                if (await roleManager.RoleExistsAsync(requestDto.Role))
                    await _userManager.AddToRoleAsync(new_user ,requestDto.Role);
                // Generate the token
                var token = GenerateJwtToken(new_user);
                return Ok(new_user);
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
    /// <returns>A 200 OK response with the user's first name, last name, email JWT token and refresh token if the login is successful, or a 400 Bad Request error with the validation errors if the request is invalid.</returns>
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

            var jwtToken = await GenerateJwtToken(existing_user);

            return Ok(jwtToken);
        }

        return BadRequest(new AuthResult()
        {
            Errors = new List<string>()
            {
                "Ungültiger Payload"
            },
        });


     }
    /// <summary>
    /// Refreshes the access token.
    /// </summary>
    /// <param name="TokenRequest">The token request data transfer object (DTO).</param>
    /// <returns>A 200 OK response with the user's first name, last name, email, a new updatet JWT token and a refresh token if the request is successful</returns>
    /// <response code="200">If the request is successful.</response>
    [Route("RefreshToken")]
    [HttpPost]
    public async Task<IActionResult> RefreshToken([FromBody] TokenRequest tokenRequest)
    {
        if (ModelState.IsValid)
        {
            var result = await VerifyAndGenerateToken(tokenRequest);

            if(result == null)
            {
                return BadRequest(new AuthResult()
                {
                    Errors = new List<string>()
            {
                "Ungültige Token"
            },

                });
            }

            return Ok(result);

        }

        return BadRequest(new AuthResult()
        {
            Errors = new List<string>()
            {
                "Ungültige Parameter"
            },

        });
    }

    private async Task<AuthResult> VerifyAndGenerateToken(TokenRequest tokenRequest)
    {
        var jwtTokenHandler = new JwtSecurityTokenHandler();
            
            // The lifetime should not be validated because it will be expired for this operation. Otherwise an exception occurs.
            var tokenValidationParameters = _tokenValidationParameters.Clone();
            tokenValidationParameters.ValidateLifetime = false;

            var tokenInVerification = jwtTokenHandler.ValidateToken(tokenRequest.Token, tokenValidationParameters, out var validedToken);

            if (validedToken is JwtSecurityToken jwtSecurityToken)
            {
                var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);

                if (result == false)
                    return null;

            }

            var utcExpiryDate = long.Parse(tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp).Value);

            var expiryDate = UnixTimeStampToDateTime(utcExpiryDate);
            if (expiryDate > DateTime.UtcNow)
            {
                return new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Access Token noch nicht abgelaufen"
                    }
                };
            }

            

        var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == tokenRequest.RefreshToken);

            if (storedToken == null)
            {
                return new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Refresh Token ungültig"
                    }
                };


            }

            if(storedToken.IsUsed)
            {
                return new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Refresh Token ungültig"
                    }
                };
            }

            if (storedToken.IsRevoked)
            {
                return new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Refresh Token ungültig"
                    }
                };
            }

            var jti = tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

            if(storedToken.JwtId != jti)
            {
                return new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Refresh Token ungültig"
                    }
                };
            }

            if(storedToken.ExpiryDate < DateTime.UtcNow)
            {
                return new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Refreshed Token abgelaufen"
                    }
                };
            }

            

            storedToken.IsUsed = true;
            _context.RefreshTokens.Update(storedToken);
            await _context.SaveChangesAsync();

            var dbUser = await _userManager.FindByIdAsync(storedToken.UserId);
            return await GenerateJwtToken(dbUser);

        

        
    }

    private DateTime UnixTimeStampToDateTime(long unixTimeStamp)
    {
        var dateTimeVal = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        dateTimeVal = dateTimeVal.AddSeconds(unixTimeStamp).ToUniversalTime();

        return dateTimeVal;
    }

    private async Task <AuthResult> GenerateJwtToken(ApplicationUser user)
{
    var jwtTokenHandler = new JwtSecurityTokenHandler();

    // Get key from configuration
    var key = Encoding.UTF8.GetBytes(_configuration.GetSection("JwtConfig:Secret").Value);

    var userRoles = await _userManager.GetRolesAsync(user);
    
        // Token descriptor
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Issuer = _configuration.GetSection("JwtConfig:Issuer").Value,
            Audience = _configuration.GetSection("JwtConfig:Audience").Value,
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("Id", user.Id),
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Email, value: user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToUniversalTime().ToString()),
                new Claim(ClaimTypes.Role, user.Role)

            }),


            // Set expire time for token
            Expires = DateTime.UtcNow.Add(TimeSpan.Parse(_configuration.GetSection("JwtConfig:ExpireTimeFrame").Value)),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)

            
        };
        
        
        // Tokenhandler to create Token based on the tokenDescriptor information
        var token = jwtTokenHandler.CreateToken(tokenDescriptor);
        var jwtToken = jwtTokenHandler.WriteToken(token);

        var refreshToken = new RefreshToken()
        {
            JwtId = token.Id,
            Token = RandomStringGeneration(23), // Generate a refresh token
            AddedDate = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddDays(7),
            IsRevoked = false,
            IsUsed = false,
            UserId = user.Id
        };

        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();

        return new AuthResult()
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            RefreshToken = refreshToken.Token,
            Token = jwtToken,
            Role = user.Role
        };

    }




    private string RandomStringGeneration(int length)
    {
        var random = new Random();
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz_";
        return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
    }

}




