using Saycret.Interfaces;
using Saycret.Models;
using Saycret.Repositories;

namespace Saycret.Services
{
    public class ConfessionServices : IConfession
    {
        IUnitOfWork _UnitOfWork;
        public ConfessionServices (IUnitOfWork unitOfWork)
        {
            _UnitOfWork = unitOfWork;
        }
        public void CreatConfession(Confession confession)
        {
            _UnitOfWork.Repository<Confession>().Add(confession);   
            _UnitOfWork.Commit();
        }

        public void DeleteConfession(int confessionId)
        {
            _UnitOfWork.Repository<Confession>().Delete(confessionId);
            _UnitOfWork.Commit();

        }

        public List<Confession> GetAllConfessions(int skip, int take)
        {
           return _UnitOfWork.Repository<Confession>().FindAll(c => true, 0, 10);
        }

        public void UpdateConfession(Confession confession)
        {
            _UnitOfWork.Repository<Confession>().Update(confession, confession.Id);
        }
    }
}
