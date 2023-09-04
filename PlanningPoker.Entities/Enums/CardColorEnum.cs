using System.Text.Json.Serialization;

namespace PlanningPoker.Entities.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CardColorEnum
{
    Green = 1,
    Yellow = 2,
    Red = 3,
    Gray = 4,
    Blue = 5,
}
