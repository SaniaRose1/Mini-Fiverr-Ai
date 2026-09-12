import dotenv from 'dotenv';
import express from  'express';
import fetch from "node-fetch";
import bcrypt from "bcryptjs";
import path from "path";
import {GoogleGenAI} from "@google/genai"
import User from  '../../models/Users.js';
import Task from '../../models/Tasks.js';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});
const router = express.Router();


console.log("Gemini api key" , !! process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({apiKey : process.env.GEMINI_API_KEY});
router.post("/register", async (req, res) => {
  const { name, email, password, skill, role } = req.body;

  try {
   
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists!" });
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

   
    const newUser = new User({
      name,
      email,
      password: hashedpassword,
      role   
    });

    if(role === "freelancer"){
      newUser.skill = skill;
      
    }

   const user =  await User.create(newUser);

    res.status(201).json({
      msg: "registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async(req,res)=>{
   const { email, password ,role} = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

   
    if (user.role !== role) {
      return res.status(403).json({ msg: "Wrong role selected" });
    }

   
    res.status(200).json({
        message:"Login successful",
        role: user.role,
       user
      }
    );

  } catch (error) {
    res.status(500).json({message:error.message});
  }
})



router.post("/post",async(req,res)=>{
  try{
   
    const newposts = new Task(req.body);
   await newposts.save();
   return res.json(newposts);
  }
  catch(error){
  return   res.status(500).json({message:error.message});
  }
  
})

router.get("/post",async(req,res)=>{
  try{
    const posts = await Task.find();
    return res.json(posts);
  }
  catch(error){
   return res.status(500).json({message:error.message});
  }
})

router.delete("/post/:id",async(req,res)=>{
  try{
   
  const deleteTasks =  await Task.findByIdAndDelete(req.params.id);
  if(!deleteTasks){
    return res.status(404).json({message:"Tasks not found"});
  }
   return res.json({message: "Deleted Successfully", id:req.params.id});
  }
  catch(error){
   return res.status(500).json({message:error.message});
  }
})

router.post("/generate" , async(req, res)=>{
 try {
   const { prompt } = req.body;
    if(!prompt){
      return res.status(400).json({
        error:"Prompt is required"
      })
    }
    
    const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Create a short educational lecture about: ${prompt}

Requirements:
-Keep the lecture between 100 and 150 words.
-Present the entire lecture in clear bullet points.
-Use short , easy-to-understand points.
-Use headings words colourful where appropriate.
-Include:
1. Introduction
2. Key concepts
3. Important points
4. Examples
5. Conclusion
-Do not write long paragraphs.
-Avoid unnecessary information and repetitions.`,

});

        console.log("Gemini response:", response.text);

        res.json({
            lecture: response.text
        });
  } catch (error) {
     console.error("Backend error:", error);
    res.status(500).send('Error generating lecture');
  }
})


router.post("/chat", async (req, res) => {
    try {
        const { question, userId } = req.body;

        // Check question
        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }
       const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // Prepare user profile information
        const user_information = `
Name: ${user.name}
Email: ${user.email}
Role: ${user.role}
Skills: ${user.skill}
`;

        console.log("User information:", user_information);
        // Send question to Python AI server
        const response = await fetch(`${process.env.PYTHON_AI_URL}/chat`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question,
                user_information: user_information || ""
            })
        });

        // Python server error
        if (!response.ok) {
            const errorText = await response.text();

            console.error(
                "Python AI Error:",
                errorText
            );

            return res.status(500).json({
                success: false,
                message: "Python AI server error"
            });
        }

        // Get Python response
        const data = await response.json();

        // Send answer to React
        return res.status(200).json({
            success: true,
            answer: data.answer
        });

    } catch (error) {

        console.error(
            "Chat API Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to connect to AI server"
        });
    }
});

 export default router;