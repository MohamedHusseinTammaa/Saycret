import mongoose from "mongoose";
import validator from "validator";
import { Roles } from "../../Utils/usersRoles.ts";
const usersSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    userName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: Boolean // false = male, true = female
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        vlalidate : [validator.isEmail,"feild must be a valid email"]
    },
    password: {
        type: String,
        required : true
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role:{
        type: String,
        enum : [...Object.values(Roles)],
        default :Roles.USER
    },
    avatar :{
        type : String,
        default: "uploads/gun.png"
    },
    deletedAt:{
        type:Date
    },
    restoreUntil:{
        type:Date
    },
    deleted:{
        type :Boolean,
        default:false
    }

});


usersSchema.virtual("fullName").get(function () {
    if(!this.name || !this.name.first || !this.name.last) return null;
    return `${this.name.first} ${this.name.last}`;
});


usersSchema.virtual("age").get(function () {
    if (!this.dateOfBirth) return null;
    const diff = Date.now() - this.dateOfBirth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)); // convert ms → years
});

const User = mongoose.model("Users", usersSchema, "Users");
export default User;
