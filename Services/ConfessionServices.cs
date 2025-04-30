using Microsoft.AspNetCore.Http.HttpResults;
using Saycret.DTOs.Confession;
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
        public void CreatConfession(CreateConfessionDTO confessionDto)
        {
            Confession confession = new Confession
            {
                Content = confessionDto.Content,
                ParentId = confessionDto.ParentId,
                CreatedAt = DateTime.UtcNow,
                AutherId = confessionDto.AuthorId,
                Allowed = true,
                likes = 0
            };

            _UnitOfWork.Repository<Confession>().Add(confession);
            _UnitOfWork.Commit();
        }

        public void DeleteConfession(long confessionId)
        {
            _UnitOfWork.Repository<Confession>().Delete(confessionId);
            _UnitOfWork.Commit();

        }

        public List<ConfessionDTO> GetAllConfessions(int skip, int take)
        {
            List<ConfessionDTO> confessionDTOs = new List<ConfessionDTO>();

            // Pass the actual skip and take values
            List<Confession> confessions = _UnitOfWork.Repository<Confession>().FindAll(c => true, take, skip);

            foreach (Confession confession in confessions)
            {
                ConfessionDTO dto = new ConfessionDTO();
                dto.Content = confession.Content;
                dto.ParentId = confession.ParentId;
                dto.CreatedAt = confession.CreatedAt;
                dto.Id = confession.Id;
                dto.Likes = confession.likes;

                confessionDTOs.Add(dto);
            }

            return confessionDTOs;
        }

        public ConfessionDTO GetConfession(long id)
        {
            ConfessionDTO confession = new ConfessionDTO();
            Confession c =_UnitOfWork.Repository<Confession>().GetByID(id);
            confession.Content = c.Content;
            confession.ParentId = c.ParentId;
            confession.CreatedAt = c.CreatedAt;
            confession.Id = c.Id;
            confession.Likes = c.likes;
            return confession;
        }

        public void UpdateConfession(UpdateConfessionDTO confession)
        {
            var existing = _UnitOfWork.Repository<Confession>().GetByID(confession.Id);
            if(existing == null) throw new KeyNotFoundException ($"Confession with ID {confession.Id} not found.");
            existing.Content = confession.Content;
            _UnitOfWork.Repository<Confession>().Update(existing, existing.Id);    
            _UnitOfWork.Commit();
        }
    }
}
