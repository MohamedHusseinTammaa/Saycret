import Express from "express";
import { router as PostsRouter } from "./Routes/PostsRouts.mjs";
const app = Express();
app.use(Express.json());
app.use("/api/posts",PostsRouter)
app.listen(2001 ,()=>{
    console.log("listening on port 2000")
})