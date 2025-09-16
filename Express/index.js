import Express from "express";
import { router as PostsRouter } from "./Routes/PostsRouts.mjs";
import { router as usersRouter } from "./Routes/UsersRouters.mjs";
import * as httpStatus from "./Utils/HttpStatusText.mjs"
import * as httpMessages from "./Utils/HttpDataText.mjs"
import cors from "cors";
import 'dotenv/config'
import mongoose from "mongoose";
const url = process.env.DB_URL;
mongoose.connect(url).then(()=>{
    console.log("mongodb is connected")
});
const port = process.env.port;
const app = Express();
app.use(cors())
app.use(Express.json());
app.use("/api/posts",PostsRouter);
app.use("/api/users",usersRouter);
app.use((req,res,next)=>{
    res.status(404).json({status: httpStatus.NOT_FOUND,data:null,message:httpMessages.NOT_FOUND});
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: err.statusText || "error",
        data: null,
        message: err.message || "Internal Server Error"
    });
});


app.listen(port,()=>{
    console.log("listening on port : "+port)
});