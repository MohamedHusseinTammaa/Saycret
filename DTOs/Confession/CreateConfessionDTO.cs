using System.ComponentModel.DataAnnotations;

namespace Saycret.DTOs.Confession
{
    public class CreateConfessionDTO
    {
        [Required]
        [MaxLength(250)]
        public string Content { get; set; }

        public long? ParentId { get; set; }
        [Required]
        public int AuthorId { get; set; }
    }
}
