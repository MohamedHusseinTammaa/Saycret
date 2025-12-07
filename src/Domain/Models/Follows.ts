import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    followedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }
);

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
export default mongoose.model("Follows", followSchema);
