namespace PlanningPoker.Services.Dto;

public class ChangeSubTaskScoreDto
{
    public Guid SubTaskId { get; set; }
    public double? Score { get; set; }
}
