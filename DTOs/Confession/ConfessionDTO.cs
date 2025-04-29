namespace Saycret.DTOs.Confession
{
    public class ConfessionDTO
    {
        public long Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Likes { get; set; }
        public long? ParentId { get; set; }
    }
}
