using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Saycret.Models
{
    public class Confession
    {
       [Key]
       public long  Id { get; set; }
       [MaxLength(250)]
       public string Content { get; set;}

       public DateTime CreatedAt { get; set; }

       public int likes { get; set; }

       public bool Allowed { get; set; }

       [ForeignKey("Parent")]
       public long ParentId { get; set; }
       public Confession Parent { get; set; }
        [ForeignKey("Auther")]
       public int AutherId { get; set; }
        public User Author { get; set; }


    }
}
