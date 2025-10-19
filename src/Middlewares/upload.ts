
import multer from "multer";
import path from "path";
import { AppError } from "../Utils/AppError.ts";

const storage = multer.diskStorage({
  destination: (req: any , file:any, cb:any) => {
    cb(null, './Uploads');
  },
  filename: (req:any, file:any, cb:any) => {
    
    cb(null,"profile - "+ Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req:any , file :any,cb:any)=>{
  const img = file.mimetype.split('/')[0];
  if(img === "image"){
    return cb(null,true)
  }
  else {
    return cb(new AppError("false image type",400,"BAD REQUEST"),false)
  }
};
export const upload = multer({ storage: storage , fileFilter });

