import mongoose from "mongoose";
const interactionSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    } ,
    post : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    },
    status :{
        type : Boolean, // true for like false for dislike
        required: true,
        default : true
    }
});
const interactionModel = mongoose.model("Interactions",interactionSchema,"Interactions");
export default interactionModel;