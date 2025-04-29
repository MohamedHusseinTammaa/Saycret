using System.ComponentModel.DataAnnotations;

namespace Saycret.DTOs.Confession
{
    public class UpdateConfessionDTO
    {
        [Required]
        [MaxLength(250)]
        public string Content { get; set; }

        [Required]
        public long Id { get; set; }
    }
}
