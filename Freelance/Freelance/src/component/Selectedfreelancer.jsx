import { useState , useEffect } from "react";
const Selectedfreelancer = () => {
 const [name , setName] = useState(null);
 const [role , setRole] = useState(null);
 const [email , setEmail] = useState(null);
  const [skill, setSkill] = useState(null);

useEffect(()=>{
const userRole = localStorage.getItem("user");
    console.log("role from localstorage" , userRole)
    if (userRole) {
      const user = JSON.parse(userRole);
      if(user && userRole){
      setRole(user.role);
       setName(user.name);
       setEmail(user.email);
       setSkill(user.skill);
      }
      
    }
})


  
  return (
    <div className="profile">
        <div className="profile-container">

      

        <div className="profile-banner">

          <div className="banner-content">

            <span className="approval">
              ◉ PROFILE ACTIVE
            </span>

            <h1>Student Profile Workspace</h1>

            <p>
              Keep your profile updated to discover better internship
              opportunities.
            </p>

          </div>

          

        </div>
  </div>

        {/* USER HEADER */}

        <div className="user-header">

          <div className="profile-picture-container">
            <div className="profile-picture">
              <i class="bi bi-person-circle " style={{color:"black" , fontSize:"6rem"}}></i>
            </div>
           
           
          </div>

          <div className="user-details">
            <div className="bubble-container">
    <span className="bubble bubble1"></span>
    <span className="bubble bubble2"></span>
    <span className="bubble bubble3"></span>
    <span className="bubble bubble4"></span>
    <span className="bubble bubble5"></span>
    <span className="bubble bubble6"></span>
  </div>

            <div className="name-row">

              <h2 style={{color:"white"}}>{name}</h2>

              <span className="active-badge">
                ● ACTIVE STUDENT
              </span>

            </div>
            
            <p className="tag">
             <i class="bi bi-person-circle " style={{color:"black" , fontSize:"1rem"}}></i> {role}
            </p>

            

            <p  className="tag">
              ✉️ {email}
            </p>

           {role==="freelancer" && (
             <p className="tag">
               🎯 {skill}
             </p>
           )}

          </div>

        </div>


      

        
        </div>
      
  )
}
export default Selectedfreelancer