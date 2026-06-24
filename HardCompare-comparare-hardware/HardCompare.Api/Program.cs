using System.Text;
using System.Text.Json.Serialization;
using HardCompare.Api;
using HardCompare.Api.Data;
using HardCompare.DataAccessLayer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

AppConfig.Initialize(builder.Configuration);
DbConfig.ConnectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] {}
        }
    });
});

var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]?.Split(',')
    ?? ["http://localhost:5173", "http://localhost:4173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = AppConfig.JwtIssuer,
            ValidAudience = AppConfig.JwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppConfig.JwtKey)),
            ClockSkew = TimeSpan.Zero,
        };
        options.Events = new JwtBearerEvents
        {
            OnChallenge = async ctx =>
            {
                ctx.HandleResponse();
                ctx.Response.StatusCode = 401;
                ctx.Response.ContentType = "application/json";
                await ctx.Response.WriteAsync("{\"error\":\"Authentication required\"}");
            },
            OnForbidden = async ctx =>
            {
                ctx.Response.StatusCode = 403;
                ctx.Response.ContentType = "application/json";
                await ctx.Response.WriteAsync("{\"error\":\"Access denied\"}");
            },
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(errApp => errApp.Run(async ctx =>
{
    ctx.Response.StatusCode = 500;
    ctx.Response.ContentType = "application/json";
    var ex = ctx.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
    var isDev = app.Environment.IsDevelopment();
    var msg = isDev && ex != null ? ex.Message : "Internal server error";
    await ctx.Response.WriteAsync($"{{\"error\":\"{msg}\"}}");
}));

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallback(() => Results.Json(new { error = "Not found" }, statusCode: 404));

// Auto-create tables and seed admin on startup
try
{
    using var db = new HardCompare.DataAccessLayer.Context.HardCompareDbContext();
    await db.Database.EnsureCreatedAsync();
    Console.WriteLine("[DB] Schema ready.");
}
catch (Exception ex)
{
    Console.WriteLine($"[DB ERROR] Cannot connect to database: {ex.Message}");
    Console.WriteLine("[DB] Check your connection string in appsettings.Development.json");
}

try
{
    await AdminSeeder.SeedAsync();
}
catch (Exception ex)
{
    Console.WriteLine($"[SEED ERROR] {ex.Message}");
}

Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
Console.WriteLine("  HardCompare API");
Console.WriteLine($"  Running on http://localhost:3001");
Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

app.Run();
