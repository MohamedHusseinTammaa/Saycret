namespace Saycret.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<T> Repository<T>() where T : class;
        void Commit();
    }
}
