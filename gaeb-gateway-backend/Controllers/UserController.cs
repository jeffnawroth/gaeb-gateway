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


namespace gaeb_gateway_backend.Controllers;

//[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Route("api/[controller]")]
[ApiController]
    public class UserController : ControllerBase
    {

    private static ApiDbContext _context;

    public UserController(ApiDbContext context)
    {
        _context = context;
    }

   

    [HttpGet]
    public async Task<IActionResult> Get()
    {
    var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    
    [HttpGet("{id:int}")]
    public async Task<IActionResult>Get(int id)
    {
        var team = await _context.Users.FirstOrDefaultAsync(userToGet => userToGet.Id == id);

        if (team == null)
            return BadRequest("Invalid id");

        return Ok(team);
    }

    [HttpPost]
    public async Task<IActionResult> Post(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction("Get", user.Id, user);
    }

    
    [HttpPatch]
    public async Task <IActionResult> Patch(int id, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(userToPatch => userToPatch.Id == id);

        if (user == null)
            return BadRequest("Invalid id");

        user.Password = password;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(userToDelete => userToDelete.Id == id);

        if (user == null)
            return BadRequest("Invalid id");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    
}

