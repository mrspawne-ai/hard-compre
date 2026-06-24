namespace HardCompare.Api;

public static class AppConfig
{
    public static string JwtKey { get; private set; } = string.Empty;
    public static string JwtIssuer { get; private set; } = string.Empty;
    public static string JwtAudience { get; private set; } = string.Empty;

    public static void Initialize(IConfiguration config)
    {
        JwtKey = config["Jwt:Key"]!;
        JwtIssuer = config["Jwt:Issuer"]!;
        JwtAudience = config["Jwt:Audience"]!;
    }
}
