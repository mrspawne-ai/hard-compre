using System.Text.Json;
using System.Text.Json.Serialization;
using HardCompare.Api.Models;

namespace HardCompare.Api.Services;

public class JsonContactRepository : IContactRepository
{
    private readonly string _path;
    private static readonly JsonSerializerOptions ReadOpts = new() { PropertyNameCaseInsensitive = true };
    private static readonly JsonSerializerOptions WriteOpts = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    public JsonContactRepository(string path) => _path = path;

    public List<Contact> GetAll()
    {
        if (!File.Exists(_path)) return [];
        try
        {
            return JsonSerializer.Deserialize<List<Contact>>(File.ReadAllText(_path), ReadOpts) ?? [];
        }
        catch { return []; }
    }

    public void Save(List<Contact> contacts)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(_path)!);
        File.WriteAllText(_path, JsonSerializer.Serialize(contacts, WriteOpts));
    }
}
