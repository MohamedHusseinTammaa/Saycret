import crypto from "crypto";
import blackListedTokenModel from "../../Domain/Models/blackListedTokens.ts";
import Follows from "../../Domain/Models/Follows.ts";
import User from "../../Domain/Models/Users.ts";
import { sendVerificationEmail } from "../../Utils/emailService.ts";

const getAllUsersService = async (limit: number, skip: number) => {
    return await User.find()
        .limit(limit)
        .skip(skip)
        .lean();
};
const getUserByIdService = async (id:string) => {
    return await User.findById(id).lean()
};
const VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

function hashVerificationToken(plain: string): string {
    return crypto.createHash("sha256").update(plain).digest("hex");
}

const registerService = async (newUser: any) => {
    await newUser.save();
    const rawToken = generateVerificationToken();
    const hashedToken = hashVerificationToken(rawToken);
    const expires = new Date(Date.now() + VERIFICATION_EXPIRY_MS);
    const sentAt = new Date();
    await User.findByIdAndUpdate(newUser.id, {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: expires,
        emailVerificationSentAt: sentAt,
    });
    try {
        await sendVerificationEmail(newUser.email, rawToken);
    } catch {
        // User is created; they can request a new link via POST /users/verify-email
    }
    const user = await User.find({ _id: newUser.id }, { password: 0, __v: 0 }).lean();
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
const verifyUsernameService = async (username: string) => {
    return await User.findOne({ userName: username });
};

/** Resend verification email. Returns { sent } if sent, { rateLimited: true } if cooldown, { alreadyVerified: true }, or { userNotFound: true }. */
const sendVerificationEmailService = async (email: string): Promise<{ sent?: boolean; rateLimited?: boolean; alreadyVerified?: boolean; userNotFound?: boolean }> => {
    const user = await User.findOne({ email }).select("+emailVerificationToken +emailVerificationExpires +emailVerificationSentAt").lean();
    if (!user) return { userNotFound: true };
    if ((user as any).isEmailVerified) return { alreadyVerified: true };
    const sentAt = (user as any).emailVerificationSentAt as Date | undefined;
    if (sentAt && Date.now() - new Date(sentAt).getTime() < RESEND_COOLDOWN_MS) {
        return { rateLimited: true };
    }
    const rawToken = generateVerificationToken();
    const hashedToken = hashVerificationToken(rawToken);
    const expires = new Date(Date.now() + VERIFICATION_EXPIRY_MS);
    await User.updateOne(
        { email },
        { emailVerificationToken: hashedToken, emailVerificationExpires: expires, emailVerificationSentAt: new Date() }
    );
    await sendVerificationEmail(email, rawToken);
    return { sent: true };
};

/** Confirm email with token. Returns true if verified, false if invalid/expired. */
const confirmEmailService = async (token: string): Promise<boolean> => {
    const hashed = hashVerificationToken(token);
    const user = await User.findOne({
        emailVerificationToken: hashed,
        emailVerificationExpires: { $gt: new Date() },
    }).select("_id");
    if (!user) return false;
    await User.findByIdAndUpdate(user._id, {
        isEmailVerified: true,
        $unset: { emailVerificationToken: 1, emailVerificationExpires: 1, emailVerificationSentAt: 1 },
    });
    return true;
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
    searchUsersService,
    verifyUsernameService,
    sendVerificationEmailService,
    confirmEmailService,
};