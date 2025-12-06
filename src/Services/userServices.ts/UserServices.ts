import blackListedTokenModel from "../../Domain/Models/blackListedTokens.ts";
import User from "../../Domain/Models/Users.ts";

const getAllUsersService = async () => {
    return await User.find().lean();
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
    return await User.findByIdAndDelete(id).lean();
};

export {
    getAllUsersService,
    getUserByIdService,
    registerService,
    loginService,
    editUserService,
    deleteUserService,
    blockSessionService
};