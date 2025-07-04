﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Task_Manger.Data;
using Task_Manger.DTOs;
using Task_Manger.Models;
using Microsoft.EntityFrameworkCore;

namespace Task_Manger.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext context, IConfiguration config, ILogger<AuthController> logger)
        {
            _context = context;
            _config = config;
            _logger = logger;
        }

        public AuthController(AppDbContext context, IConfiguration @object)
        {
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto request)
        {
            _logger.LogInformation("Registration attempt for Username: {Username}, Email: {Email}", request.Username, request.Email);

            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                _logger.LogWarning("Registration failed: Username already exists - {Username}", request.Username);
                return BadRequest("Username already exists");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = hashedPassword
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("User registered successfully: {Username}", request.Username);
            return Ok("User Registered");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto request)
        {
            _logger.LogInformation("Login attempt for Username: {Username}", request.Username);

            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    _logger.LogWarning("Invalid login attempt for Username: {Username}", request.Username);
                    return Unauthorized("Invalid credentials");
                }

                var token = CreateJwt(user);

                _logger.LogInformation("Login successful for Username: {Username}", request.Username);
                return Ok(new
                {
                    token = token,
                    username = user.Username,
                    id = user.Id
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for Username: {Username}", request.Username);
                return StatusCode(500, $"Login failed: {ex.Message}");
            }
        }

        private string CreateJwt(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("protected")]
        [Authorize]
        public IActionResult ProtectedData()
        {
            var user = User.Identity?.Name;
            _logger.LogInformation("Protected route accessed by: {Username}", user);
            return Ok($"You are authenticated, {user}!");
        }
    }
}


