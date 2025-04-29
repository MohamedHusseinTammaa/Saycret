using Saycret.DTOs.Confession;
using Saycret.Models;

namespace Saycret.Interfaces
{
    public interface IConfession
    {
        // crud 
        void CreatConfession(CreateConfessionDTO confession);
        List<ConfessionDTO> GetAllConfessions(int skip, int take);
        ConfessionDTO GetConfession(long id);
        void UpdateConfession(UpdateConfessionDTO confession);
        void DeleteConfession(long confessionId);
    }
}
