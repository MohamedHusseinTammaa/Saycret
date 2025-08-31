import {} from "express-validator";
import Express from "express";
import fs from 'node:fs';
const app = Express();
app.use(Express.json());
const posts =[
    {
        "id" :1,
        "writer": "Mohamed Hussein",
        "post" : "we are cooked guys"
    },
    {
        "id" :2,
        "writer": "salma hussein",
        "post" : "i need to sleep and relax"
    },
    {
        "id" : 3,
        "writer": " Hager hussein",
        "post" : "i need to work remotely guys"
    }
]

const checkIndex= (req,res,next)=>{
    let {params :{id}} = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId))return res.status(400).end();
    const find = posts.findIndex(post =>post.id ===parsedId);
    if(find===-1)return res.status(400).end();
    req.postIndex=find;
    next();
};
app.get("/api/posts",(req,res)=>{
    console.log(req.query);
    let posts ;
    fs.readFile("./posts.json","utf-8",(err,data)=>{
       if(err)retun;
       posts= JSON.parse(data);
       const filtered = posts.filter(x =>x.writer.toLowerCase().includes(req.query.writer));
       res.json(filtered).status(200);
    });
   
});
app.get("/api/posts/:id",(req,res)=>{
    const idparsed = parseInt(req.params["id"]);
    if(isNaN(idparsed))return res.status(400).end();
    const post = posts.find(value => value.id===idparsed);
    if(post === undefined)return res.status(404).end();
    res.json(post).status(200);
});
app.post("/api/posts",(req,res)=>{
    const {body} = req;
    const bodyJson = body;
    posts.push({id:posts.length+1, ...bodyJson});
    res.status(201).json(bodyJson);
});
app.put("/api/posts/:id",checkIndex,(req,res)=>{
    let {body,postIndex} = req;
    posts[postIndex]={id:posts[postIndex].id,...body};
    res.send({id:posts[postIndex].id,...body}).status(200).end();
});
app.patch("/api/posts/:id",(req,res)=>{
    let {body , params :{id}} = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId))return res.status(400).end();
    const find = posts.findIndex(post =>post.id ===parsedId);
    if(find===-1)return res.status(400).end();
    id = parsedId;
    posts[id-1]={...posts[id-1],...body};
    res.status(200).end();
});


app.listen(2001 ,()=>{
    console.log("listening on port 2000")
})