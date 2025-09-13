import {posts} from "../Data/posts.mjs"
import {validationResult} from "express-validator";
import post from "../Models/Posts.mjs"
const getPosts = async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()&&Object.keys(req.query).length!==0){
        return res.status(400).send({"errors" : errors.array()});
    }
    const posts = await post.find().lean();
    let filtered=posts;
    if(req.query.writer) 
        filtered = posts.filter(x =>x.writer.toLowerCase().includes(req.query.writer)); 
    res.status(200).json(filtered);
};
const getPostById= async(req,res)=>{
    try {
        const idparsed = req.params["id"];
        const pos= await post.findById(idparsed).lean();
        if(!pos)return res.status(404).json({msg:"post doesn't exist"});
        res.status(200).json(pos);
    }
    catch(err){
        return res .status(404).json({msg:"Invalid Request"})
    }
    
};
const createPost= async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({"errors" : errors.array()});
        }
        const {body} = req;
        const bodyJson = body;
        const newPost = await post.insertOne({...body});    
        res.status(201).json(newPost);
};
const editWholePost= async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({"errors" : errors.array()});
    }
    let {body,params:{id}} = req;
    console.log(body,id);
    const Edited = await post.findByIdAndUpdate({"_id" : id},{$set:{...body}}, {new : true , lean : true} );
    res.status(200).send(Edited);
};
const editPartPost= async (req,res)=>{
    let {body , params :{id}} = req;
    const pos= await post.findById(id).lean();
    if(!pos)
        return res.status(404).json({msg:"post doesn't exist"});
    const Edited = await post.findByIdAndUpdate({"_id" : id},{$set:{...body}}, {new : true , lean : true} );
    res.status(200).send(Edited);
};
const deletePost = async (req,res)=>{
     let {params :{id}} = req;
    const pos= await post.findById(id).lean();
    if(!pos)
        return res.status(404).json({msg:"post doesn't exist"});
    const deleted = await post.findByIdAndDelete(id).lean();
    res.status(200).send(deleted);
}

export {
  getPosts,
  getPostById,
  createPost,
  editWholePost,
  editPartPost,
  deletePost
};