import mongoose from "mongoose"
console.log("MODEL MONGOOSE:", mongoose.version);
console.log("MODEL MONGOOSE PATH:", import.meta.resolve("mongoose"));

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:{
      type:  String,
      
    },
    skill:[String],
    
    role:{
        type:String,
        enum :["poster","freelancer"],
        required:true
    }
},{timestamps:true})
const User = mongoose.model("User",userSchema);
export default User;
