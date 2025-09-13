import mongoose from "mongoose";

const postschema = new mongoose.Schema({
    writer : {
        type : String,
        required : true
    },
    post : {
        type : String,
        required : true
    }
});
const post = mongoose.model("Posts",postschema,"Posts");
export default post;


