import mongoose from "mongoose";
const blackListedTokenSchema=new mongoose.Schema({
    tokenId:{
    type:String,
    required:true
},
expiresAt:{
    type:Date,
    required:true
}}
)
const blackListedTokenModel=mongoose.model("blackListedToken",blackListedTokenSchema)
export default blackListedTokenModel