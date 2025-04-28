using System.Linq.Expressions;

namespace Saycret.Repositories
{
    public interface IRepository<T> where T : class
    {
        public T GetByID(int id);
        List<T> FindAll(Expression<Func<T, bool>> expression, int? take, int? skip);
        T Add(T entity);
        void Delete(int id);
        T Update(T entity, int id);
        int CountAll();
        int CountSpecificItems(Expression<Func<T, bool>> expression);
    }
}
