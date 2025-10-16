import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema({
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
const PostModel = mongoose.model("Comments",CommentSchema,"Comments");
export default PostModel;