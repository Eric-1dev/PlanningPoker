namespace PlanningPoker.FrontOffice.Models
{
    public class GameProgressViewModel
    {
        public Guid GameId { get; set; }

        public CardViewModel[] Cards { get; set; }

        public bool NeedAddPassCard { get; set; }

        public GameTaskViewModel[] Tasks { get; set; }
    }
}
