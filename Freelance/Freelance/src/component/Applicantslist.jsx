import { useEffect, useState } from "react";

const Applicantslist = ()=>{
   
    const [apply , setApply] = useState([]);
    

     useEffect(()=>{
         const savedApplications = JSON.parse(localStorage.getItem("applications")) || [];
    setApply(savedApplications);

     } , []);



    return(

        <div className="Applicant">
      <h1 style={{fontStyle:"italic",display:"flex",justifyContent:"center",alignItems:"center"}}>FREELANCER WHO HAVE APPLIED</h1>
      <div  style={{display:"flex",flexDirection:"row",flexWrap:"wrap",overflowY:"scroll" ,height:"100%" , width:"100%"}}>
        {apply.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        
        apply.map((app, index) => (
          <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px" , fontStyle:"italic",width:"215px" , height:"300px",borderRadius:"10px"}} className="participant">
            <i class="bi bi-person-circle " style={{color:"white" , fontSize:"2rem"}}></i>
            <p><strong> Applicant Name:</strong> {app.name}</p>
            <p><strong>Email:</strong> {app.email}</p>
           <p><strong>Task Title:</strong> {app.title}</p>
            <p><strong>Budget:</strong> {app.budget}</p>
            <p><strong>Task Skill:</strong> {app.skill}</p>
          </div>
          
        ))
      )}
      </div>
    
        </div>
       
    )
}
export default Applicantslist;