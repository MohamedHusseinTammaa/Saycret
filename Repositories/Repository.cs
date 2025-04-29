using Microsoft.EntityFrameworkCore;
using Saycret.Data;
using System.Linq.Expressions;

namespace Saycret.Repositories
{
    public class Repository <T> : IRepository<T> where T :class
    {
        protected readonly SaycretDbContext _context;
        protected readonly DbSet<T> _dbSet;
        public Repository (SaycretDbContext saycretDb)
        {
            _context = saycretDb;
            _dbSet = _context.Set<T>();
        }

        public T Add(T entity)
        {
            _dbSet.Add(entity);
            return entity;
        }

        public long CountAll()
        {
            return _dbSet.Count();
        }

        public long CountSpecificItems(Expression<Func<T, bool>> expression)
        {
            return _dbSet.Count(expression);
        }

        public void Delete(long id)
        {
            T? l=_dbSet.Find(id);
            if (l != null)
            _dbSet.Remove(l);
            throw new KeyNotFoundException(message: $"Entity with ID {id} not found.");
        }

        public List<T> FindAll(Expression<Func<T, bool>> expression, int? take, int? skip)
        {
            IQueryable<T> query = _dbSet.Where(expression);

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            return query.ToList();
        }
        public T GetByID(long id)
        {
            T l = _dbSet.Find(id);
            if (l != null)
                return l;
            throw new KeyNotFoundException(message: $"Entity with ID {id} not found.");
        }
        public T Update(T entity, long id)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            var existing =  _dbSet.Find(id);
            if (existing == null)
                throw new KeyNotFoundException($"Entity with ID {id} not found.");

            _context.Entry(existing).CurrentValues.SetValues(entity);
            return existing;
        }
    }
}
