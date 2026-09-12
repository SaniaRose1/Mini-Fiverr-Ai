const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
 title : String ,
 description :String,
 budget : Number ,
 issueDate : Date,
  deadlineDate : Date,
  skill :[String]
});

module.exports = mongoose.model("Task" , taskSchema );
