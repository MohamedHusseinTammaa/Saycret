using Saycret.Models;

namespace Saycret.Interfaces
{
    public interface IConfession
    {
        // crud 
        void CreatConfession(Confession confession);
        List<Confession> GetAllConfessions(int skip, int take);
        void UpdateConfession(Confession confession);
        void DeleteConfession(int confessionId);
    }
}
