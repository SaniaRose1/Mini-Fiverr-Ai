import { useState } from "react";


const Lecture = ()=>{
    const [prompt , setPrompt] = useState("");
    const [lecture , setLecture] = useState("");

    const handlelecture = async() =>{
        try{
           const  res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/generate` , {
             method :"POST",
             headers:{"Content-Type": "application/json"},
             body : JSON.stringify({prompt})

           }) 
           const result = await res.json();
           setLecture(result.lecture);
        } catch(error ){

        }
    }
    return(
       <div className="lecture">
      <h1 style={{display:"flex" , flexDirection:"row" , justifyContent:"center" , marginTop:"20px" , color:"white" , fontStyle:"italic",gap:"30px"}}> Lecture Generator</h1>
      <div className="lecture-container" style={{display:"flex" , flexDirection:"row" , justifyContent:"center" , alignItems:"center" , gap:"20px" , marginTop:"50px"}}>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a lecture topic"
        style={{padding:"10px" , borderRadius:"5px" , width:"300px" , marginright:"10px" , border:"1px solid "}}
        className="lecture-input"
      />
      <button onClick={handlelecture}  className="lecture-button">Generate Lecture</button>
       </div>
      <div style={{display:"flex" , flexDirection:"column" , justifyContent:"center" , alignItems:"center" , marginTop:"20px"}}>
        <h2>Generated Lecture of "{prompt}"</h2>
        <div className="lecture-content">{lecture}</div>
      </div>
     
    </div>
    )
}
export default Lecture;