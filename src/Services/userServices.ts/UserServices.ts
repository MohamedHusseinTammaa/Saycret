import blackListedTokenModel from "../../Domain/Models/blackListedTokens.ts";
import Follows from "../../Domain/Models/Follows.ts";
import User from "../../Domain/Models/Users.ts";

const getAllUsersService = async (limit: number, skip: number) => {
    return await User.find()
        .limit(limit)
        .skip(skip)
        .lean();
};
const getUserByIdService = async (id:string) => {
    return await User.findById(id).lean()
};
const registerService = async (newUser:any) => {
    await newUser.save();
    const user = await User.find({ _id: newUser.id }, { password: 0, __v: 0 });
    return user;
};
const loginService = async (email:string) => {
    return await User.findOne({ email });
};
const blockSessionService = async (id:string) => {
    return await blackListedTokenModel.create({
        tokenId: id,
        expiresAt: new Date(Date.now())
    });
};
const editUserService = async (id:string,user:any) => {
 return await User.findByIdAndUpdate(id, { $set: user }, { new: true }).lean();
};
const deleteUserService = async (id:string) => {
    const deleted = await User.findByIdAndUpdate(id,{
        deleted:true,
        deletedAt: Date.now(),
        restoreUntil: Date.now() + 30 * 24 * 60 * 60 * 1000
    },{ new: true });
    return deleted;
};
const restoreDeletedUserService= async(id:string)=>{
    const user = await User.findById(id);

    if (!user) return ;
    if (!user.deletedAt || !user.restoreUntil) return ;
    if (Date.now() > user.restoreUntil.getTime()) return ;
    user.deletedAt = null;
    user.restoreUntil = null;
    user.deleted=false;

    await user.save();
    return user;
    
}
const followService = async(followerId:string,followedId:string)=>{
    const existingFollow = await Follows.findOne({
      followerId: followerId,
      followedId: followedId,
    }).lean();

    if (existingFollow) {
      return null ; 
    }
    await User.findByIdAndUpdate(
            followedId,
            { $inc: { followersCount:1 } }
    );
    await User.findByIdAndUpdate(
            followerId,
            { $inc: { followingCount:1 } }
    );
    await Follows.create({
      followerId: followerId,
      followedId: followedId,
      createdAt: Date.now()
    });
    return true;

}
const unfollowService = async (followerId: string, followedId: string) => {
    const existingFollow = await Follows.findOne({
      followerId: followerId,
      followedId: followedId,
    });
  
    if (!existingFollow) {
      return; 
    }
  
    // Remove the follow record
    await Follows.deleteOne({
      followerId: followerId,
      followedId: followedId,
    });
  
    // Decrement follower/following counts
    await User.findByIdAndUpdate(
      followedId,
      { $inc: { followersCount: -1 } }
    );
  
    await User.findByIdAndUpdate(
      followerId,
      { $inc: { followingCount: -1 } }
    );
  
    return true;
  };
  

const getUserFollowersByIdService = async (userId:string,limit:number,skip:number) => {
    let projection = { __v: 0 };
    let followers = await Follows.find({followedId:userId},projection)
        .populate({ path: "followerId", select: "name.first name.last email" })
        .limit(limit)
        .skip(skip)
        .lean();

    return followers;
};

const searchUsersService = async (query: string, limit: number, skip: number) => {
  if (!query || query.trim() === "") return [];
  
  const regex = new RegExp(query.trim(), "i");
  // Search for users where first name, last name, email, or userName contains the query (partial match, case-insensitive)
  const users = await User.find({
    $or: [
      { "name.first": regex },
      { "name.last": regex },
      { userName: regex }
    ]
  })
  .limit(limit)
  .skip(skip)
  .lean();

  return users;
};
export {
    getAllUsersService,
    getUserByIdService,
    registerService,
    loginService,
    editUserService,
    deleteUserService,
    blockSessionService,
    restoreDeletedUserService,
    followService,
    getUserFollowersByIdService,
    unfollowService,
    searchUsersService
};