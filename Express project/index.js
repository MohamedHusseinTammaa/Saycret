const Express = require("express");
const { body, validationResult} = require('express-validator');
const app = Express();
app.use(Express.json());
let posts = [
    {
        id : 1,
        author : "mohamed tammaa",
        post : "hello guys i want to tell you a secret that am from egypt and i feel sad werab el 3ebad"    
    },
    {
        id : 2,
        author : "salma hussein",
        post : "3ayza a5od break"
    }
];
app.get("/",(req,res)=>{
    res.send("<h1>welcome to Saycret</h1>")
});
app.get("/api/posts",(req,res)=>{
    res.json(posts)
});
app.get('/api/posts/:postId',(req,res)=>{
    const postId= Number(req.params.postId);
    if(isNaN(postId)){
        return res.status(400).json([{msg:"bad request"}]); 
    }
    const post =posts.find(post=>post.id===postId);
    if(post){
        res.json(post);
    }
    else{
        res.status(404);
        res.json([{msg:"sorry the post not found"}])
        
    }
    
});
app.post("/api/posts" , (req,res)=>{
    console.log(req.body);
    res.status(201);
    res.end();
});



app.listen(2000,()=>{
    console.log("listening on port 2000");
});
