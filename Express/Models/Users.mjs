import mongoose from "mongoose";

const usersSchema = mongoose.Schema({
    "name":{
        first:String,
        last:String
    },
    "userName":{
        type : String,
        required : true
    },
    "dateOfBirth" :{
        type :Date
    },
    "gender" :{
        type : Boolean // 0 for the guys and 1 for the ladies (cause she can)
    },
    "phoneNumber" :{
        type : String
    },
    "Email":{
        type: String,
        required: true, 
        unique: true,  
        lowercase: true
    },
    "password":{
        type: String
    },
    "followersCount":{
        type : Number
    },
    "followingCount":{
        type : Number
    },
    "createdAt":{
        type : Date
    }
},
{
    virtuals:{
        fullName:{
            get(){
                return this.name.first +' '+ this.name.last;
            }
        },
        age:{
            get(){
                return Date.now()-this.dateOfBirth;
            }
        },
        create:{
            set(){
                this.createdAt = Date.now();
            }
        }
    }
});

const User = mongoose.model("Users",usersSchema,"Users");
export default User;