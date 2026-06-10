using System.Text.Json;
using HardCompare.Api.Models;

namespace HardCompare.Api.Services;

public class JsonUserRepository : IUserRepository
{
    private readonly string _path;
    private static readonly JsonSerializerOptions ReadOpts = new() { PropertyNameCaseInsensitive = true };
    private static readonly JsonSerializerOptions WriteOpts = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public JsonUserRepository(string path) => _path = path;

    public List<User> GetAll()
    {
        if (!File.Exists(_path)) return [];
        try
        {
            return JsonSerializer.Deserialize<List<User>>(File.ReadAllText(_path), ReadOpts) ?? [];
        }
        catch { return []; }
    }

    public void Save(List<User> users)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(_path)!);
        File.WriteAllText(_path, JsonSerializer.Serialize(users, WriteOpts));
    }
}
