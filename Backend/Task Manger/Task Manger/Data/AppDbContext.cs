﻿using Microsoft.EntityFrameworkCore;
using Task_Manger.Models;

namespace Task_Manger.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Models.Task> Tasks { get; set; }
    }
}
