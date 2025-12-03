import mongoose from "mongoose";
import Post from "../../Domain/Models/Posts.ts";
import Interaction from "../../Domain/Models/Interactions.ts";
import { truncate, write } from "fs";
import User from "../../Domain/Models/Users.ts";
import Comment from "../../Domain/Models/Comments.ts"

const getCommentByIdService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    const projection = { __v: 0, deleted: 0 };

    const comment: any = await Comment.findOne(
        { _id: id, deleted: { $ne: true } },
        projection
    )

    .lean();

    if (!comment) return false;

    if (comment.isAnonymous === true) {
        return {
            ...comment,
            writer:"Anonymous"
        };
    }

    return comment;
};


const getPostCommentsService= async (id: string ,limit:number,skip:number )=>{
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return;
    }

    let projection = { __v: 0 ,deleted:0};
    let posts : any = await Comment.find({post:id,deleted:{$ne:true}},projection)
        .populate({ path: "writer", select: "name.first name.last" })
        .limit(limit)
        .skip(skip)
        .lean();
    if(!posts) return null;
    posts =posts.map((element:any)=>{
        if(element.isAnonymous===true){
            return {
                ...element,
                writer:"Anonymous"
            }
        }
        return element;
    });
    return posts;
};
const addCommentService = async (postId: string , writerId : string , content:string,isAnonymous:boolean)=>{
    if (!mongoose.Types.ObjectId.isValid(postId)||!mongoose.Types.ObjectId.isValid(writerId)){
        return null;
    }
    const  created = await Comment.create({post:postId,content:content,isAnonymous:isAnonymous,writer:writerId});
    let projection: any = { isAnonymous: 0, __v: 0 };
    if (created.isAnonymous) projection.writer = 0;
    const data = Comment.find({_id:created.id},projection)
    .populate({path:"writer",select: "name.first name.last"});
    const post =Post.findByIdAndUpdate(postId , {$inc:{comments:1}});
    if(!post)return null;
    return data;
}
const deleteCommentService = async (commentId: string )=>{
    if (!mongoose.Types.ObjectId.isValid(commentId)){
        return null;
    }
    const data = await Comment.findOneAndUpdate(
        { _id: commentId },
        { $set: { deleted: true } },
        { 
          new: true,
          select: '_id content writer createdAt isAnonymous',
          lean: true
        }
    ).populate({ path: "writer", select: "name.first name.last email" });
    
    if(!data)return null;
    
    let writer;
    if (data) {
        writer =data.isAnonymous ? "Anonymous":data.writer;
    }
    const post =Post.findByIdAndUpdate(commentId , {$inc:{comments:-1}});
    
    if(!post)return null;
    return {
        _id: data._id,
        content: data.content,
        createdAt: data.createdAt,
        writer: writer,
    };
}
const updateCommentService = async (commentId: string , updatedContent:string)=>{
    if (!mongoose.Types.ObjectId.isValid(commentId)){
        return null;
    }
    const data = await Comment.findOneAndUpdate(
        { _id: commentId },
        { $set: { content: updatedContent,edited:true} },
        { 
          new: true,
          select: '_id content writer createdAt isAnonymous',
          lean: true
        }
    ).populate({ path: "writer", select: "name.first name.last " });
    
    if(!data)return null;
    
    let writer;
    if (data) {
        writer =data.isAnonymous ? "Anonymous":data.writer;
    }
    
    return {
        _id: data._id,
        content: updatedContent,
        createdAt: data.createdAt,
        writer: writer,
    };
}
const likeCommentService = async (commentId: string, userId: string) => {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return false;
    }

    // Use findOne instead of find to get a single document (or null)
    const interaction = await Interaction.findOne({ post: commentId, User: userId });

    if (interaction) {
        // If already liked, don't do anything
        if (interaction.status) {
            return false;
        }
        // Update existing interaction to liked
        await Interaction.updateOne(
            { post: commentId, User: userId },
            { status: true }
        );
        // Increment likes only after successful interaction update/create
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { likes: 2 } },
            { new: true, lean: true }
        );
        if (!comment) {
        return false;
        }

        return true;

    } else {
        // Create new interaction with status true
        await Interaction.create({
            post: commentId,
            User: userId,
            status: true
        });
        // Increment likes only after successful interaction update/create
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { likes: 1 } },
            { new: true, lean: true }
        );

        if (!Comment) {
            return false;
        }

        return true;
    }
};
const dislikeCommentService = async (commentId: string, userId: string) => {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return false;
    }

    // Use findOne instead of find to get a single document (or null)
    const interaction = await Interaction.findOne({ post: commentId, User: userId });

    if (interaction) {
        // If already disliked, don't do anything
        if (!interaction.status) {
            return false;
        }
        // Update existing interaction to disliked
        await Interaction.updateOne(
            { post: commentId, User: userId },
            { status: false }
        );
        // Increment likes only after successful interaction update/create
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { likes: -2 } },
            { new: true, lean: true }
        );
        if (!comment) {
        return false;
        }

        return true;

    } else {
        // Create new interaction with status true
        await Interaction.create({
            post: commentId,
            User: userId,
            status: false
        });
        // Increment likes only after successful interaction update/create
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { likes: -1 } },
            { new: true, lean: true }
        );

        if (!comment) {
            return false;
        }

        return true;
    }
};
const removeInteractionCommentService = async (commentId: string, userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return false;
    }
    const interaction = await Interaction.findOne({ post: commentId, User: userId });
    if(interaction){
        const removed :any = await Interaction.findOneAndDelete({post:commentId,User:userId},{lean:true});
        if(removed.status===true){
            await Comment.findByIdAndUpdate(commentId,{$inc:{likes:-1}})
        }
        else{
            await Comment.findByIdAndUpdate(commentId,{$inc:{likes:1}})
        }
        await interaction
        return true;
    }

    return false; 
};


export {
    getPostCommentsService,
    addCommentService,
    deleteCommentService,
    updateCommentService,
    likeCommentService,
    dislikeCommentService,
    removeInteractionCommentService,
    getCommentByIdService
};