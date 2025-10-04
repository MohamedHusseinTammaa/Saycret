import mongoose, { InferSchemaType } from "mongoose";

const postschema = new mongoose.Schema({
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    } ,
    post : {
        type : String,
        required : true,
        minlength: 5, 
        maxlength: 500 
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    },
    isAnonymous :{
        type : Boolean,
        required: true,
        default : false
    }
    
});
export type Post = InferSchemaType<typeof postschema>;
const PostModel = mongoose.model<Post>("Posts",postschema,"Posts");
export default PostModel;


