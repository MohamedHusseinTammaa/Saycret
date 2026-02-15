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
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 32,
        trim: true,
        lowercase: true,
        validate : [validator.isAlphanumeric,"feild must be a valid username"],
        match : [/^[a-zA-Z0-9]+$/,"feild must be a valid username"]
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: Boolean // false = male, true = female
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate : [validator.isMobilePhone,"feild must be a valid phone number"],
        match : [/^[0-9]+$/,"feild must be a valid phone number"],
        minlength: 10,
        maxlength: 15,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate : [validator.isEmail,"feild must be a valid email"]
    },
    password: {
        type: String,
        required : true,
        minlength: 8,
        trim: true,

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
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        select: false
    },
    emailVerificationExpires: {
        type: Date,
        select: false
    },
    emailVerificationSentAt: {
        type: Date,
        select: false
    }
});

usersSchema.index({
    username:'text'
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
