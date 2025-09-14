import Express from "express";
import { router as PostsRouter } from "./Routes/PostsRouts.mjs";
import { router as usersRouter } from "./Routes/UsersRouters.mjs";
import 'dotenv/config'
import mongoose from "mongoose";
const url = process.env.DB_URL;
mongoose.connect(url).then(()=>{
    console.log("mongodb is connected")
});
const port = process.env.port;
const app = Express();
app.use(Express.json());
app.use("/api/posts",PostsRouter);
app.use("/api/users",usersRouter);
app.listen(port,()=>{
    console.log("listening on port : "+port)
});