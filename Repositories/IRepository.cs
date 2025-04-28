using System.Linq.Expressions;

namespace Saycret.Repositories
{
    public interface IRepository<T> where T : class
    {
        public T GetByID(long id);
        List<T> FindAll(Expression<Func<T, bool>> expression, int? take, int? skip);
        T Add(T entity);
        void Delete(long id);
        T Update(T entity, long id);
        long CountAll();
        long CountSpecificItems(Expression<Func<T, bool>> expression);
    }
}
