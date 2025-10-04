import Post from "../../Domain/Models/Posts.ts";

const getPostsService = async (limit:number,skip:number) => {
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
const getPostByIdService = async (id:number) => {
    const post: any = await Post.findById(id, { __v: 0 })
        .populate({ path: "writer", select: "name.first name.last" })
        .lean();

    if (post && post.isAnonymous === true) {
        post.writer = "Anonymous";
        delete post.isAnonymous;
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
const editWholePostService = async () => {

};
const editPartPostService = async () => {

};
const deletePostService = async () => {

};
export {
    getPostsService,
    searchPostsService,
    getPostByIdService, 
    createPostService, 
    editWholePostService, 
    editPartPostService, 
    deletePostService
};