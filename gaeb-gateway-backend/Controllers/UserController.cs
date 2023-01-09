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

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Route("api/[controller]")]
[ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

    public UserController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

   

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
    var users = await _userManager.Users.ToListAsync();
        return Ok(users);
    }

    
    [HttpGet("{id}")]
    public async Task<IActionResult>GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ApplicationUser user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var result = await _userManager.CreateAsync(user);
        if (result.Succeeded)
        {
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }
        return BadRequest(result.Errors);
    }

    
    [HttpPut("{id}")]
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

        var emailUser = await _userManager.FindByEmailAsync(user.Email);

        if(emailUser != null && emailUser.Email != existingUser.Email)
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

    [HttpDelete("{id}")]
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



