import mongoose from "mongoose";
import Post from "../../Domain/Models/Posts.ts";
import Interaction from "../../Domain/Models/Interactions.ts";
import { truncate } from "fs";
import User from "../../Domain/Models/Users.ts";
import Comment from "../../Domain/Models/Comments.ts"
const getPostsService = async (limit:number,skip:number) => {
    let projection = { __v: 0 };
    let posts = await Post.find(projection)
        .populate({ path: "writer", select: "name.first name.last email" })
        .limit(limit)
        .skip(skip)
        .lean();
    posts.forEach((element: any) => {
        if (element.isAnonymous === true) {
            element.writer = "Anonymous";
        }
        delete element.isAnonymous;
    });
    return posts;
};
const searchPostsService = async (limit:number,skip:number) => {
let projection = { __v: 0 };

    let posts = await Post.find(projection)
        .populate({ path: "writer", select: "name.first name.last" })
        .limit(limit)
        .skip(skip)
        .lean();

    posts.forEach((element: any) => {
        if (element.isAnonymous === true) {
            element.writer = "Anonymous";
        }
        delete element.isAnonymous;
    });
    return posts;
};
const getPostByIdService = async (id:string) => {
    const post: any = await Post.findById(id, { __v: 0 })
        .populate({ path: "writer", select: "name.first name.last" })
        .lean();
    console.log(post);
    if (!post) {
        return null;
    }

    if (post.isAnonymous === true) {
        return {
            ...post,
            writer: "Anonymous",
            isAnonymous: undefined 
        };
    }
    return post;
};
const createPostService = async (post:any,isAnonymous:boolean,currentUser:any) => {

    const newPost: any = await Post.create({
        post,
        isAnonymous,
        writer:currentUser.id
    });

    let projection: any = { isAnonymous: 0, __v: 0 };
    if (newPost.isAnonymous) projection.writer = 0;
    const data = await Post.find({ _id: newPost.id }, projection)
        .populate({ path: "writer", select: "name.first name.last" });
    return data;
};
const editPartPostService = async (id:any,post: any) => {
    const edited:any = await Post.findByIdAndUpdate(
        id,
        { $set: {post} },
        { new: true, lean: true }
    );
    return edited;
};
const deletePostService = async (id:string) => {
    const deleted = await Post.findByIdAndDelete(id).lean();
    return deleted;
};
const likePostService = async (postId: string, userId: string) => {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return false;
    }

    // Use findOne instead of find to get a single document (or null)
    const interaction = await Interaction.findOne({ post: postId, User: userId });

    if (interaction) {
        // If already liked, don't do anything
        if (interaction.status) {
            return false;
        }
        // Update existing interaction to liked
        await Interaction.updateOne(
            { post: postId, User: userId },
            { status: true }
        );
        // Increment likes only after successful interaction update/create
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likes: 2 } },
            { new: true, lean: true }
        );
        if (!post) {
        return false;
        }

        return true;

    } else {
        // Create new interaction with status true
        await Interaction.create({
            post: postId,
            User: userId,
            status: true
        });
        // Increment likes only after successful interaction update/create
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likes: 1 } },
            { new: true, lean: true }
        );

        if (!post) {
            return false;
        }

        return true;
    }
};
const dislikePostService = async (postId: string, userId: string) => {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return false;
    }

    // Find existing interaction
    const interaction = await Interaction.findOne({ post: postId, User: userId });

    // Can only dislike if the user previously liked the post
    if (!interaction || !interaction.status) {
        return false; // No interaction exists OR already disliked
    }
    else if(interaction.status){
        await Interaction.updateOne(
            { post: postId, User: userId },
            { status: false }
        );
        // Decrement likes count
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likes: -2 } },
            { new: true, lean: true }
        );
        return true;
    }

    // create interaction (unlike)
    await Interaction.create(
        { post: postId, User: userId, status: false }
    );

    // Decrement likes count
    const post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likes: -1 } },
        { new: true, lean: true }
    );

    if (!post) {
        return false;
    }

    return true;
};
const removeInteractionPostService = async (postId: string, userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return false;
    }
    const interaction = await Interaction.findOne({ post: postId, User: userId });
    if(interaction){
        const removed :any = await Interaction.findOneAndDelete({post:postId,User:userId},{lean:true});
        if(removed.status===true){
            await Post.findByIdAndUpdate(postId,{$inc:{likes:-1}})
        }
        else{
            await Post.findByIdAndUpdate(postId,{$inc:{likes:1}})
        }
        await interaction
        return true;
    }

    return false; 
};
const getProfilePostsService= async (id: string ,limit:number,skip:number )=>{
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return;
    }
    let projection = { __v: 0 , isAnonymous:0};
    let posts = await Post.find({writer:id,isAnonymous:{$ne:true}},projection)
        .populate({ path: "writer", select: "name.first name.last" })
        .limit(limit)
        .skip(skip)
        .lean();
    

    return posts;
};
const getPostCommentsService= async (id: string ,limit:number,skip:number )=>{
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return;
    }
    let projection = { __v: 0 , isAnonymous:0};
    let posts = await Comment.find({post:id,isAnonymous:{$ne:true}},projection)
        .populate({ path: "writer", select: "name.first name.last" })
        .limit(limit)
        .skip(skip)
        .lean();
    return posts
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
    return data;
}

export {
    getPostsService,
    searchPostsService,
    getPostByIdService, 
    createPostService, 
    editPartPostService, 
    deletePostService,
    likePostService,
    dislikePostService,
    removeInteractionPostService,
    getProfilePostsService,
    getPostCommentsService,
    addCommentService
};