using Saycret.Data;
using System.Diagnostics;

namespace Saycret.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SaycretDbContext _context;
        private readonly Dictionary<Type, object> _repositories;
        private bool _disposed;

        public UnitOfWork(SaycretDbContext saycretDbContext)
        {
            _context = saycretDbContext;
            _repositories = new Dictionary<Type, object>();
        }
        public void Commit()
        {
           _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IRepository<T> Repository<T>() where T : class
        {
            var type = typeof(T);

            if (!_repositories.ContainsKey(type))
            {
                _repositories[type] = new Repository<T>(_context);
            }

            return (IRepository<T>)_repositories[type];
        }
    }
}
