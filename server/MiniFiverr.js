import express from "express";
import mongoose from "mongoose";
console.log("SERVER MONGOOSE:", mongoose.version);
console.log("SERVER MONGOOSE PATH:", import.meta.resolve("mongoose"));
import path from "path";
import cors from "cors";
import dotenv from 'dotenv';
import  authRoutes from './Routes/Api.js';
import dns from "dns";
import User from "../models/Users.js";
dns.setDefaultResultOrder("ipv4first");


dotenv.config(); 
const app = express();
const port =5000;

app.use(cors({
  origin:process.env.FRONTEND_URL
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/auth",authRoutes);

async function run() {
  try { 
await mongoose.connect(process.env.Mongo_Uri)

console.log(`Mongodb Atlas Connected Succesfully and Server is running on port ${port}`);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
  }  
catch(error){console.log("connection failed" ,error)}
}

run();


