    import {validationResult} from "express-validator";
    import post from "../Models/Posts.mjs"
    import * as httpStatus from "../Utils/HttpStatusText.mjs"
    import * as httpMessage from "../Utils/HttpDataText.mjs"
    const getPosts = async (req,res)=>{
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    status : httpStatus.FAIL ,
                    data: errors.array(),
                    message:httpMessage.BAD_REQUEST
                });
            }
            const limit = Number(req.query.limit)||10;
            const page = Number(req.query.page)||1;
            const skip= (page-1)*limit;
            let posts;
            if(req.query.writer){ 
                posts= await post.find({ writer: new RegExp(req.query.writer, "i")})
                    .limit(limit)
                    .skip(skip)
                    .lean();
                return res.status(200).json({
                    status : httpStatus.SUCCESS, 
                    data :{posts},
                    pagination : {limit,page}
                });
            }
            posts = await post.find()
                    .limit(limit)
                    .skip(skip)
                    .lean();
            return res.status(200).json({
                status : httpStatus.SUCCESS,
                data :{posts},
                pagination : {limit,page}
            });       
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                status:httpStatus.ERROR,
                data:null,
                message:httpMessage.ERROR
            });
        }

        
    };
    const getPostById= async(req,res)=>{
        try {
            const idParsed = req.params["id"];
            const pos= await post.findById(idParsed).lean();
            if(!pos)return res.status(404).json({
                status:httpStatus.FAIL,
                data : null,
                message:httpMessage.NOT_FOUND
            });
            res.status(200).json({
                status:httpStatus.SUCCESS,
                data:pos
            });
        }
        catch(err){
            console.log(err)
            return res .status(500).json({
                status: httpStatus.ERROR,
                data : null,
                message:httpMessage.ERROR
            });
        }  
    };
    const createPost= async (req,res)=>{
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    status : httpStatus.FAIL,
                    data : errors.array(),
                    message : httpMessage.BAD_REQUEST});
            }
            const {body} = req;
            const new_Post = await post.create({...body});    
            res.status(201).json({
                status:httpStatus.SUCCESS,
                data:new_Post
            });
        }
        catch(err){
            console.log(err);
            return res .status(500).json({
                status: httpStatus.ERROR,
                data : null,
                message:httpMessage.ERROR});
        }
    };
    const editWholePost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({
            status: httpStatus.FAIL,
            data: errors.array(),
            message: httpMessage.BAD_REQUEST
        });
        }

        const { body, params: { id } } = req;

        const edited = await post.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true }
        ).lean();

        if (!edited) {
        return res.status(404).json({
            status: httpStatus.FAIL,
            message: httpMessage.NOT_FOUND
        });
        }

        res.status(200).json({
        status: httpStatus.SUCCESS,
        data: edited
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
        status: httpStatus.ERROR,
        message: httpMessage.ERROR
        });
    }
    };
    const editPartPost= async (req,res)=>{
        try{
            let {body , params :{id}} = req;
            const pos= await post.findById(id).lean();
            if(!pos)
                return res.status(404).json({
                status:httpStatus.FAIL,
                data
                ,message:httpMessage.NOT_FOUND
            });
            const edited = await post.findByIdAndUpdate(
                {"_id" : id},
                {$set:{...body}}, 
                {new : true , lean : true}
            );
            res.status(200).json({
                status:httpStatus.SUCCESS,
                data:edited
            });
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                status:httpStatus.ERROR,
                data : null,
                message:httpMessage.ERROR
            });
        } 
    };
    const deletePost = async (req,res)=>{
        try{
            let {params :{id}} = req;
            const pos= await post.findById(id).lean();
            if(!pos)
                return res.status(404).json({
                    status:httpStatus.FAIL,
                    data : null,
                    message:httpMessage.NOT_FOUND
                });
            const deleted = await post.findByIdAndDelete(id).lean();
            res.status(200).json({
                status:httpStatus.SUCCESS,
                data:deleted
            });
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                status:httpStatus.ERROR,
                message:httpMessage.ERROR
            });
        }
    };

    export {
    getPosts,
    getPostById,
    createPost,
    editWholePost,
    editPartPost,
    deletePost
    };