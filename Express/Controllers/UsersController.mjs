import { validationResult } from "express-validator";
import { users } from "../Data/users.mjs";
import User from "../Models/Users.mjs"
const getAllUsers= async(req,res)=>{
    try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send("errors",errors.array());
    }
    const data = await User.find().lean();
    res.status(200).json(data); 
    }
    catch(err){
        console.log(err);
        res.status(404).json( { msg :"sorry unexpected Error !"});
    }
    
}
const getUserById=async(req,res)=>{
    try{
    const id = req.params['id'];
    const user = await User.findById(id).lean();
    if(!user)return res.status(404).json({msg:"the user not found"});
    res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(404).json( { msg :"sorry unexpected Error !"});
    }
   
}
const createUser = async(req,res)=>{
    try{
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(400).send({"errors " :errors.array()})
    }
     const body = req.body;
     const [day,month,year] = body.dateOfBirth.split('-');
    body.dateOfBirth = new Date(year,month-1,day);
    const newUser = await User.insertOne({...body});
    res.status(201).json(newUser);  
    }
    catch(err){
        if(err.code === 11000){
            res.status(400).json( { msg :"the email is already signed"});
        }
        res.status(404).json( { msg :"sorry unexpected Error !"});
    }
} 
const editUser = async (req,res)=>{
    try {
         let {params:{id},body} = req;

    const errors = validationResult(req);
    if(!errors.isEmpty())return res.status(400).send({"errors " :errors.array()});
    
    const user = await User.findById(id);
    if(!user)return res.status(404).end({msg:"no user to be edited"});
    console.log(body)
    Object.assign(user,body);
     const updated = await user.save();    
    res.status(200).json(updated);
    }
    catch(err){
        if(err.code === 11000){
            res.status(400).json( { msg :"the email is already signed"});
        }
        res.status(404).json( { msg :"sorry unexpected Error !"});
    }
}
const deleteUser = async (req,res)=>{
    let {params: {id}}=req;
    const user = await users.findById(id).lean();
    if(!user)return res.status(404).json({msg:"the user not found"});
    const object = await User.findByIdAndDelete(id).lean();
    res.status(200).send(object);
}

export {
    getAllUsers,
    getUserById,
    createUser,
    editUser,
    deleteUser
}