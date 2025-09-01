import { posts } from "../Data/posts.mjs";
export const checkIndex= (req,res,next)=>{
    let {params :{id}} = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId))return res.status(400).end();
    const find = posts.findIndex(post =>post.id ===parsedId);
    if(find===-1)return res.status(400).end();
    req.postIndex=find;
    next();
};
export const createPostSchema= {
    writer :{
        isString:{
            errorMessage:"writer must be string!"
        },
        notEmpty:{
            errorMessage : "you need to enter the writer"
        },
        isLength:{
            options:{
                min :5,
                max :32
            },
            errorMessage: "you must enter a writer from 5 to 32 chars !"
        }
    },
    post:{
        isString:{
            errorMessage:"post must be string!"
        },
        notEmpty:{
            errorMessage : "you need to write a post"
        },
        isLength:{
            options:{
                min :5,
                max :300
            },
            errorMessage: "the length from 5-300 characters"
        }
    }
};
export const postQuerySchema= {
    writer :{
        isString:{
            errorMessage:"writer must be string!"
        },
        notEmpty:{
            errorMessage : "you need to enter the writer"
        },
        isLength:{
            options:{
                min :5,
                max :32
            },
            errorMessage: "you must enter a writer from 5 to 32 chars"
        }
    },
};
