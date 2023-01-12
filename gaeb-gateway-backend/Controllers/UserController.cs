using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using gaeb_gateway_backend.Data;
using gaeb_gateway_backend.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace gaeb_gateway_backend.Controllers;

/// <summary>
/// A controller for managing users.
/// </summary>
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Route("api/[controller]")]
[ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

    /// <summary>
    /// Creates a new instance of the <see cref="UserController"/> class.
    /// </summary>
    /// <param name="userManager">The user manager to use for managing users.</param>
    public UserController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

   
    /// <summary>
    /// Gets a list of all users.
    /// </summary>
    /// <returns>A list of all users.</returns>
    /// <response code="200">Returns the list of users.</response>
    /// <response code="500">If an exception occurs while retrieving the users.</response>
    [HttpGet]
    [ProducesResponseType(200, Type = typeof(List<ApplicationUser>))]
    [ProducesResponseType(500)]
    public async Task<IActionResult> GetAll()
    {
    var users = await _userManager.Users.ToListAsync();
        return Ok(users);
    }

    /// <summary>
    /// Gets a user with the specified ID.
    /// </summary>
    /// <param name="id">The ID of the user to get.</param>
    /// <returns>The user with the specified ID, or a 404 Not Found error if no such user exists.</returns>
    /// <response code="200">Returns the user with the specified ID.</response>
    /// <response code="404">If the user with the specified ID is not found.</response>
    /// <response code="500">If an exception occurs while retrieving the user.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(200, Type = typeof(ApplicationUser))]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<IActionResult>GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="user">The user to create.</param>
    /// <returns>The created user, or a 400 Bad Request error if the user is invalid.</returns>
    /// <response code="201">Returns the newly created user.</response>
    /// <response code="400">If the user is invalid.</response>
    /// <response code="500">If an exception occurs while creating the user.</response>
    [HttpPost]
    [ProducesResponseType(201, Type = typeof(ApplicationUser))]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> Create([FromBody] ApplicationUser user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        user.UserName = user.FirstName + "." + user.LastName;
        user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, user.PasswordHash);

        var user_exist = await _userManager.FindByEmailAsync(user.Email);
        if (user_exist != null)
        {
            return BadRequest(new AuthResult()
            {

                Errors = new List<string>()
                    {
                        "Email existiert bereits. Bitte einloggen."
                    }
            });
        }

        var result = await _userManager.CreateAsync(user);
        if (result.Succeeded)
        {
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }
        return BadRequest(result.Errors);
    }

    /// <summary>
    /// Updates an existing user.
    /// </summary>
    /// <param name="id">The ID of the user to update.</param>
    /// <param name="user">The updated user information.</param>
    /// <returns>The updated user, or a 400 Bad Request error if the user is invalid or a 404 Not Found error if no such user exists.</returns>
    /// <response code="200">Returns the updated user.</response>
    /// <response code="400">If the user is invalid.</response>
    /// <response code="404">If the user with the specified ID is not found.</response>
    /// <response code="500">If an exception occurs while updating the user.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(200, Type = typeof(ApplicationUser))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> Update(string id, [FromBody] ApplicationUser user)
    {
        if (id != user.Id)
        {
            return BadRequest();
        }
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var existingUser = await _userManager.FindByIdAsync(id);
        if (existingUser == null)
        {
            return NotFound();
        }
        existingUser.Id = user.Id;
        existingUser.UserName = user.UserName;
        existingUser.FirstName = user.FirstName;
        existingUser.LastName = user.LastName;
        existingUser.Email = user.Email;
        existingUser.ConcurrencyStamp = user.ConcurrencyStamp;
        existingUser.NormalizedUserName = user.NormalizedUserName;
        existingUser.NormalizedEmail = user.NormalizedEmail;
        existingUser.EmailConfirmed = user.EmailConfirmed;
        existingUser.PasswordHash = user.PasswordHash;
        existingUser.SecurityStamp = user.SecurityStamp;
        existingUser.PhoneNumber = user.PhoneNumber;
        existingUser.PhoneNumberConfirmed = user.PhoneNumberConfirmed;
        existingUser.TwoFactorEnabled = user.TwoFactorEnabled;
        existingUser.LockoutEnd = user.LockoutEnd;
        existingUser.LockoutEnabled = user.LockoutEnabled;
        existingUser.AccessFailedCount = user.AccessFailedCount;

        var user_exist = await _userManager.FindByEmailAsync(existingUser.Email);
        if (user_exist != null && user_exist.Email == user.Email)
        {
            return BadRequest(new AuthResult()
            {

                Errors = new List<string>()
                    {
                        "Nutzer mit der Email existiert bereits. Bitte andere Email-Adresse verwenden."
                    }
            });
        }
       
        var result = await _userManager.UpdateAsync(existingUser);
        if (result.Succeeded)
        {
            return Ok(user);
        }
        return BadRequest(result.Errors);
    }

    /// <summary>
    /// Deletes a user with the specified ID.
    /// </summary>
    /// <param name="id">The ID of the user to delete.</param>
    /// <returns>A 200 OK response if the user was deleted successfully, or a 404 Not Found error if no such user exists.</returns>
    /// <response code="204">If the user is successfully deleted.</response>
    /// <response code="404">If the user with the specified ID is not found.</response>
    /// <response code="500">If an exception occurs while deleting the user.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        var result = await _userManager.DeleteAsync(user);
        if (result.Succeeded)
        {
            return Ok();
        }
        return BadRequest(result.Errors);
    }
    
}



