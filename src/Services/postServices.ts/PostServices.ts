import mongoose from "mongoose";
import Post from "../../Domain/Models/Posts.ts";
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
export {
    getPostsService,
    searchPostsService,
    getPostByIdService, 
    createPostService, 
    editPartPostService, 
    deletePostService
};