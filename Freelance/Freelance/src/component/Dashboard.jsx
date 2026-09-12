 import { useState , useEffect } from "react";
import {useNavigate} from "react-router-dom";

const Dashboard =()=>{
   const [role , setRole] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    const userRole = localStorage.getItem("user");
    console.log("role from localstorage" , userRole)
    if (userRole) {
      const user = JSON.parse(userRole);
      setRole(user.role);
    }
  }, []);

    return(
    
    <div className="dashboard">

    {role === "poster" && (  <div id="poster">
       <h1 style={{display:"flex" , flexDirection:"row" , justifyContent:"center" , marginTop:"50px" , color:"white" , fontStyle:"italic",gap:"30px"}}><i class="bi bi-arrow-right-circle"></i>For Poster </h1>
       <div className="button-container">
       <button className="btns" onClick={() => navigate("/PostedTasks")} style={{background:"linear-gradient(135deg,#4B2F78,#684494)", boxShadow:"0 0 20px rgba(160,100,255,0.20)" , border:"1px solid rgba(190,140,255,0.30)" , display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center" , fontSize:"30px"}}><i class="bi bi-ui-checks"></i>Post Tasks</button>
        
        <button  className="btns" onClick={() => navigate("/ApplyForTasks")} style={{background:"linear-gradient(135deg,#1F3A5F,#285A8F)", boxShadow:"0 0 20px rgba(60,140,255,0.20)" , border:"1px solid rgba(80,160,255,0.30)",display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center" , fontSize:"30px"}}><i class="bi bi-sina-weibo"></i>View Posted Task </button>
        
        <button  className="btns" onClick={()=> navigate("/Applicantlist")} style={{background:"linear-gradient(135deg,#174A3A,#237052)", boxShadow:"0 0 18px rgba(132,70,255,0.18)" , border:"1px solid rgba(150,90,255,0.25)",display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center" , fontSize:"30px" }}><i class="bi bi-pass-fill"></i>Applicant List</button>
         
         <button  className="btns" onClick={()=> navigate("/Selectedfreelancer")} style={{background:"linear-gradient(135deg,#4A3A18,#70551F)", boxShadow:"0 0 20px rgba(40,200,130,0.20)" , border:"1px solid rgba(60,210,145,0.30)",display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center" , fontSize:"30px" }}> <i class="bi bi-check-circle-fill"></i>Profile</button>
         </div>
        </div>
    )}

     {role === "freelancer" && (   <div id="freelancer" >
          <h1 style={{display:"flex" , flexDirection:"row" , justifyContent:"center" , marginTop:"50px" , color:"white" , fontStyle:"italic",gap:"30px"}}><i class="bi bi-arrow-right-circle"></i> For Freelancer</h1>
          <div className="button-container">
         <button  className="btns" onClick={() => navigate("/ApplyForTasks")} style={{background:"linear-gradient(135deg,#1F3A5F,#285A8F)", boxShadow:"0 0 20px rgba(60,140,255,0.20)" , border:"1px solid rgba(80,160,255,0.30)",display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center" , fontSize:"30px"}}><i class="bi bi-sina-weibo"></i>Apply for Tasks</button>

         <button  className="btns" onClick={()=> navigate("/Selectedfreelancer")} style={{background:"linear-gradient(135deg,#4A3A18,#70551F)", boxShadow:"0 0 20px rgba(40,200,130,0.20)" , border:"1px solid rgba(60,210,145,0.30)",display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center" , fontSize:"30px" }}> <i class="bi bi-check-circle-fill"></i>Profile</button>
         <button  className="btns"  onClick={() => navigate("/Lecture")} style={{background:"linear-gradient(135deg,#174A3A,#237052)", boxShadow:"0 0 18px rgba(132,70,255,0.18)" , border:"1px solid rgba(150,90,255,0.25)",display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center" , fontSize:"30px" }}><i class="bi bi-book-fill"></i> Lecture </button>
        </div>
    </div>
     )}
     
      
    </div>
    );
}
export default Dashboard;