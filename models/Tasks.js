import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
 title : String ,
 description :String,
 budget : Number ,
 issueDate : Date,
  deadlineDate : Date,
  skill :[String]
},{timestamps:true});

const Task = mongoose.model("Task" , taskSchema );
export default Task;
