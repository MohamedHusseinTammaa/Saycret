using System.ComponentModel.DataAnnotations;

namespace Saycret.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(20)]
        [RegularExpression(@"^.{1,20}$", ErrorMessage = "User name must be under 20 characters")]
        public string UserName { get; set; }
        [Required]
        [MaxLength(20)]
        [RegularExpression(@"^.{1,20}$", ErrorMessage = "Password must be under 20 characters")]
        public string Password { get; set; }

        [Required]
        public DateTime created_at { get; set; }

        [Required]
        public bool IsBanned { get; set; }




    }
}
