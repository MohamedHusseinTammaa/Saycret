import { posts } from "../Data/posts.mjs";
export const checkIndex= (req,res,next)=>{
    let {params :{id}} = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId))return res.status(400).end();
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
            errorMessage: "you must enter a writer from 5 to 32 chars"
        }
    },
};

export const addUserSchema = {
    "first":{
        isString:{
            errorMessage:"user's name must be string!"
        },
        notEmpty:{
            errorMessage : "you need to enter a \"first name\""
        },
        isLength:{
            options:{
                min :2,
                max :32
            },
            errorMessage: "you must enter a writer from 2 to 32 chars"
        }
    },
    "last":{
        isString:{
            errorMessage:"user's name must be string!"
        },
        notEmpty:{
            errorMessage : "you need to enter a \"last name\""
        },
        isLength:{
            options:{
                min :2,
                max :32
            },
            errorMessage: "you must enter a writer from 2 to 32 chars"
        }
    },
    "userName":{
        isString:{
            errorMessage:"username must be string!"
        },
        notEmpty:{
            errorMessage : "you need to enter a \"username\""
        },
        isLength:{
            options:{
                min :5,
                max :32
            },
            errorMessage: "you must enter a writer from 2 to 32 chars"
        }
    },
    "dateOfBirth" :{
        notEmpty: {
            errorMessage: "you need to enter a \"date\""
        },
        isDate: {
            options: {
            format: 'DD-MM-YYYY',
            strictMode: true
        },
        errorMessage: "you need to enter time in form \"dd-mm-yyyy\""
  }
    },
    "gender" :{
        isBoolean:{
            errorMessage:"you need to enter gender 0 for meal and 1 for femeal"
        },
        notEmpty:{
            errorMessage : "you need to enter a \"date\""
        },
    },
    "phoneNumber" :{
        notEmpty:{
            errorMessage : "you need to enter a phone number"
        },
        isLength:{
            options:{
                min :5,
                max :32
            },
            errorMessage: "you must enter a phone from 5 to 32 chars"
        }
    },
    "Email":{
        isEmail:{
            errorMessage : "you need to enter Email format !"
        },
        notEmpty:{
            errorMessage : "you need to enter an Email !"
        },
        isLength:{
            options:{
                min :5,
                max :32
            },
            errorMessage: "you must enter an email from 5 to 32 chars"
        }
    },
    "password":{
        isString:{
        },
        notEmpty:{
            errorMessage : "you need to enter a password !"
        },
        isLength:{
            options:{
                min :5,
                max :32
            },
            errorMessage: "you must enter a writer from 5 to 32 chars"
        }
    }
}
