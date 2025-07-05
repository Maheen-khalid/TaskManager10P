using Xunit;
using Moq;
using Task_Manger.Controllers;
using Task_Manger.Data;
using Task_Manger.DTOs;
using Task_Manger.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Text.Json;
using System.Collections.Generic;


namespace TaskManager.Tests
{
    public class AuthControllerTests
    {
        private (AuthController controller, AppDbContext context) CreateControllerWithInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Unique in-memory DB
                .Options;

            var context = new AppDbContext(options);

            var mockConfig = new Mock<IConfiguration>();
            mockConfig.Setup(c => c["Jwt:Key"]).Returns("MyUltraSecureJwtKey_1234567890123456");
            mockConfig.Setup(c => c["Jwt:Issuer"]).Returns("https://localhost:7117/");
            mockConfig.Setup(c => c["Jwt:Audience"]).Returns("https://localhost:7117/");

            var controller = new AuthController(context, mockConfig.Object);

            return (controller, context);
        }

        [Fact]
        public async System.Threading.Tasks.Task Register_ShouldReturnOk_WhenUserIsNew()
        {
            var (controller, _) = CreateControllerWithInMemoryDb();
            var request = new UserDto
            {
                Username = "testuser",
                Email = "test@example.com",
                Password = "Password123"
            };

            var result = await controller.Register(request);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User Registered", okResult.Value);
        }

        [Fact]
        public async System.Threading.Tasks.Task Register_ShouldReturnBadRequest_WhenUsernameExists()
        {
            var (controller, _) = CreateControllerWithInMemoryDb();
            var request = new UserDto
            {
                Username = "duplicate",
                Email = "dup@example.com",
                Password = "123456"
            };

            await controller.Register(request); // First registration

            var result = await controller.Register(request); // Try duplicate

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Username already exists", badRequest.Value);
        }

        //[Fact]
        //public async Task Login_ShouldReturnOk_WhenCredentialsAreValid()
        //{
        //    var (controller, _) = CreateControllerWithInMemoryDb();

        //    // Register a test user
        //    await controller.Register(new UserDto
        //    {
        //        Username = "validuser",
        //        Email = "valid@example.com",
        //        Password = "validpass"
        //    });

        //    // Now login
        //    var result = await controller.Login(new UserDto
        //    {
        //        Username = "validuser",
        //        Password = "validpass"
        //    });

        //    // Check the HTTP result type
        //    var okResult = Assert.IsType<OkObjectResult>(result);

        //    // 🔥 Convert the result to JSON and deserialize into Dictionary
        //    var json = JsonConvert.SerializeObject(okResult.Value);
        //    var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

        //    // ✅ Validate response fields
        //    Assert.Equal("validuser", dict["username"].ToString());
        //    Assert.NotNull(dict["token"]);
        //}


        [Fact]
        public async System.Threading.Tasks.Task Login_ShouldReturnUnauthorized_WhenCredentialsAreInvalid()
        {
            var (controller, _) = CreateControllerWithInMemoryDb();
            var registerDto = new UserDto
            {
                Username = "invaliduser",
                Email = "inv@example.com",
                Password = "correctpass"
            };

            await controller.Register(registerDto);

            var result = await controller.Login(new UserDto
            {
                Username = "invaliduser",
                Password = "wrongpass"
            });

            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        //[Fact]
        //public async Task Login_ShouldReturnOk_WithEmailStoredProperly()
        //{
        //    var (controller, _) = CreateControllerWithInMemoryDb();

        //    await controller.Register(new UserDto
        //    {
        //        Username = "emailuser",
        //        Email = "email@example.com",
        //        Password = "pass123"
        //    });

        //    var result = await controller.Login(new UserDto
        //    {
        //        Username = "emailuser",
        //        Password = "pass123"
        //    });

        //    var okResult = Assert.IsType<OkObjectResult>(result);

        //    var json = JsonConvert.SerializeObject(okResult.Value);
        //    var response = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

        //    Assert.Equal("emailuser", response["username"].ToString());
        //    Assert.NotNull(response["token"]);
        //}



        [Fact]
        public async System.Threading.Tasks.Task Register_ShouldStoreEmailCorrectly()
        {
            var (controller, context) = CreateControllerWithInMemoryDb();
            var dto = new UserDto
            {
                Username = "testemail",
                Email = "storeemail@example.com",
                Password = "mypassword"
            };

            var result = await controller.Register(dto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User Registered", okResult.Value);

            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == "testemail");
            Assert.Equal("storeemail@example.com", user.Email);
        }
    }
}
