import * as httpStatus from "../Utils/HttpStatusText.mjs"
import { posts } from "../Data/posts.mjs";
export const checkIndex= (req,res,next)=>{
    let {params :{id}} = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId))return res.status(400).json({status:httpStatus.FAIL,data:null,message:"Only enter number in url"});
    next();
};
export const createPostSchema= {
    writer :{
        isString:{
            errorMessage:"writer must be string!"
        },
        notEmpty:{
            errorMessage : "you need to enter the writer"
        },
        isLength:{
            options:{
                min :5,
                max :32
            },
            errorMessage: "you must enter a writer from 5 to 32 chars !"
        }
    },
    post:{
        isString:{
            errorMessage:"post must be string!"
        },
        notEmpty:{
            errorMessage : "you need to write a post"
        },
        isLength:{
            options:{
                min :5,
                max :300
            },
            errorMessage: "the length from 5-300 characters"
        }
    }
};
export const postQuerySchema= {
    writer :{
        optional: true,
        isString:{
            errorMessage:"writer must be string!"
        },
        isLength:{
            options:{
                min :5,
                max :32
            },
            errorMessage: "you must enter a writer from 5 to 32 chars"
        }
    },limit :{
        optional:true,
        isInt:{
            options:{
                min :1,
                max :20
            },
            errorMessage: "limit from 1 post to 20"
        }
    },
    page :{
        optional:true,
        isInt:{
             options:{
                min :1,
                max :20
            },
            errorMessage: "start from 1"
        }
    }
};

export const addUserSchema = {
    "name.first": {
      isString: {
        errorMessage: "user's first name must be string!"
      },
      notEmpty: {
        errorMessage: "you need to enter a \"first name\""
      },
      isLength: {
        options: { min: 2, max: 32 },
        errorMessage: "first name must be from 2 to 32 chars"
      }
    },
  
    "name.last": {
      isString: {
        errorMessage: "user's last name must be string!"
      },
      notEmpty: {
        errorMessage: "you need to enter a \"last name\""
      },
      isLength: {
        options: { min: 2, max: 32 },
        errorMessage: "last name must be from 2 to 32 chars"
      }
    },
  
    userName: {
      isString: { errorMessage: "username must be string!" },
      notEmpty: { errorMessage: "you need to enter a \"username\"" },
      isLength: {
        options: { min: 5, max: 32 },
        errorMessage: "username must be from 5 to 32 chars"
      }
    },
  
    dateOfBirth: {
      notEmpty: { errorMessage: "you need to enter a \"date\"" },
      isDate: {
        options: { format: "DD-MM-YYYY", strictMode: true },
        errorMessage: "you need to enter date in form \"dd-mm-yyyy\""
      }
    },
  
    gender: {
      isBoolean: {
        errorMessage: "you need to enter gender 0 for male and 1 for female"
      },
      notEmpty: { errorMessage: "you need to enter a \"gender\"" }
    },
  
    phoneNumber: {
      notEmpty: { errorMessage: "you need to enter a phone number" },
      isLength: {
        options: { min: 5, max: 32 },
        errorMessage: "phone must be from 5 to 32 chars"
      }
    },
  
    email: {
      isEmail: { errorMessage: "you need to enter Email format !" },
      notEmpty: { errorMessage: "you need to enter an Email !" },
      isLength: {
        options: { min: 5, max: 32 },
        errorMessage: "email must be from 5 to 32 chars"
      }
    },
  
    password: {
      isString: { errorMessage: "password must be string!" },
      notEmpty: { errorMessage: "you need to enter a password !" },
      isLength: {
        options: { min: 5, max: 32 },
        errorMessage: "password must be from 5 to 32 chars"
      }
    }
  };

export const loginUserSchema = {
    email: {
        isEmail: { errorMessage: "you need to enter Email format !" },
        notEmpty: { errorMessage: "you need to enter an Email !" },
        isLength: {
          options: { min: 5, max: 32 },
          errorMessage: "email must be from 5 to 32 chars"
        }
    },
    password: {
        isString: { errorMessage: "password must be string!" },
        notEmpty: { errorMessage: "you need to enter a password !" },
        isLength: {
          options: { min: 5, max: 32 },
          errorMessage: "password must be from 5 to 32 chars"
        }
    }
};