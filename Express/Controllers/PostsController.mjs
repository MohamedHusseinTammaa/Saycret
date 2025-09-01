
import {posts} from "../Data/posts.mjs"
import {validationResult} from "express-validator";
const getPosts = (req,res)=>{
    const error = validationResult(req);
    console.log(error);
    let filtered=posts;
    if(req.query.writer) filtered = posts.filter(x =>x.writer.toLowerCase().includes(req.query.writer));
    res.status(200).json(filtered);    
};
const getPostById= (req,res)=>{
    const idparsed = parseInt(req.params["id"]);
    if(isNaN(idparsed))return res.status(400).end();
    const post = posts.find(value => value.id===idparsed);
    if(post === undefined)return res.status(404).end();
    res.status(200).json(post);
};
const createPost=(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({"errors" : errors.array()});
        }
        const {body} = req;
        const bodyJson = body;
        posts.push({id:posts.length+1, ...bodyJson});
        res.status(201).json(bodyJson);
};
const editWholePost=(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({"errors" : errors.array()});
    }
    let {body,postIndex} = req;
    posts[postIndex]={id:posts[postIndex].id,...body};
    res.status(200).send({id:posts[postIndex].id,...body});
};
const editPartPost=(req,res)=>{
    let {body , params :{id}} = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId))return res.status(400).end();
    const find = posts.findIndex(post =>post.id ===parsedId);
    if(find===-1)return res.status(400).end();
    id = parsedId;
    posts[find]={...posts[find],...body};
    res.status(200).send(posts[find]);
};

export {
  getPosts,
  getPostById,
  createPost,
  editWholePost,
  editPartPost
};