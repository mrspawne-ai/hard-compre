namespace HardCompare.Api.Infrastructure;

public class JwtConfig
{
    public string Secret { get; }
    public JwtConfig(string secret) => Secret = secret;
}
