namespace PlanningPoker.FrontOffice.Models
{
    public class GameProgressViewModel
    {
        public Guid GameId { get; set; }

        public string TaskName { get; set; }

        public CardViewModel[] Cards { get; set; }

        public bool NeedAddPassCard { get; set; }

        public GameTaskViewModel[] SubTasks { get; set; }

        public Guid AdminId { get; set; }

        public double TotalScore { get; set; }
    }
}
