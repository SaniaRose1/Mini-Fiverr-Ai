import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/img2.jpeg"

console.log("api url ", import.meta.env.VITE_API_URL )
const API_URL = import.meta.env.VITE_API_URL;
const Authentication =() => {
  const navigate = useNavigate();
 const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("poster");
 const [isLogin, setIsLogin] = useState(true);
  
  const [posterData, setPosterData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [freelancerData, setFreelancerData] = useState({
    name: "",
    email: "",
    password: "",
    skill: ""
  });

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap:"5px",
    fontWeight: "600",
    color:"white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    width:"40%",
    height:"40px",
  cursor: "pointer",
   background: isLogin
      ? "linear-gradient(270deg, #006400, #228B22)" 
      : "linear-gradient(270deg, #8B0000, #B22222)", 
    animation: "gradientMove 3s ease infinite"
  };

   
  const handleRegister = async (e) => {
    e.preventDefault();

    let data =
      role === "poster"
        ? { ...posterData, role }
        : { ...freelancerData, role };
               
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log(result);

      alert("Registered Successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();

    let data =
      role === "poster"
        ? {
            email: posterData.email,
            password: posterData.password,
            role
          }
        : {
            email: freelancerData.email,
            password: freelancerData.password,
            role
          };

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log(result);

      if (res.ok) {
      
        localStorage.setItem("user", JSON.stringify(result.user));

       
        navigate("/dashboard");
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    
    <div  className="container2">
      <h2  className="glow-text" style={{display:"flex" , flexDirection:"row" , gap:"15px"}}><i class="bi bi-browser-firefox" style={{color:"white" , display:"flex", justifyContent:"center", alignItems:"center" , fontSize:"60px"}}></i>MINIFIVERR</h2>


      <div className="fixcontainer" style={{minHeight:role==="poster"? "80%" : "80%"}}> 
      <div className="imgContent">
      
      <img src={img} alt="MiniFiverrimg" style={{width:"100%", height:"100%" , objectFit:"contain", display:"block"}}/>
          </div>


     <div className="container1">
      <div style={{width:"100%",height:"20%",border:"3px solid black",borderRadius:"10px" , display:"flex" , justifyContent:"center", alignItems:"center", gap:"10px", background:" linear-gradient(90deg , black , rgb(23, 23, 119) ,black)border-box"}}>
        <button
          onClick={() => setRole("poster")}
          style={{background: role === "poster" ? "#2C3E50" : "",color: role ==="poster" ?"white" :"",width:"50%",height:"38px",borderRadius:"10px",cursor:"pointer",gap:"2px",display: "flex",
    alignItems: "center",
    justifyContent: "center",fontWeight:"600"}}
        >
           <i className="bi bi-person-bounding-box"  style={{color: role ==="poster" ?"white" :"", fontSize: "1.2rem"}}></i>
          POSTER
        </button>

        <button
          onClick={() => setRole("freelancer")}
          style={{background: role === "freelancer" ? "#2C3E50" : "" ,color: role ==="freelancer" ?"white" :"",width:"50%",height:"38px",borderRadius:"10px",cursor:"pointer", display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",   fontWeight: "600" }}
        >
          <i className="bi bi-person-bounding-box" style={{color: role ==="freelancer" ?"white" :"", fontSize: "1.2rem" }}></i>
          FREELANCER
        </button>
      </div>

      <form  onSubmit={isLogin ? handleLogin : handleRegister}>
       
        {role === "poster" && (
          <div className="posterform">
          <div  style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              className="datas"
              placeholder="Name"
              value={posterData.name}
              onChange={(e) =>
                setPosterData({ ...posterData, name: e.target.value })
              }  
            />
              <i className="bi bi-person-circle"  style={{position: "absolute",left:"90%" ,top: "60%", transform: "translateY(-50%)", color: "white",fontSize: "1.5rem" ,pointerEvents: "none"}}></i>
           
             </div>
              
               <div  style={{ position: "relative", width: "100%" }}>
            <input
              type="email"
               className="datas"
              placeholder="Email"
              value={posterData.email}
              onChange={(e) =>
                setPosterData({ ...posterData, email: e.target.value })
              }
            />
             <i className="bi bi-envelope-at-fill"  style={{position: "absolute",left:"90%" ,top: "60%", transform: "translateY(-50%)", color: "white",fontSize: "1.5rem" ,pointerEvents: "none"}}></i>
            
            </div>
            
            <div  style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword? "text" :"password"}
               className="datas"
              placeholder="Password"
              value={posterData.password}
              onChange={(e) =>
                setPosterData({ ...posterData, password: e.target.value })
              }
            />
             <i className={showPassword ? "bi bi-eye bi " : "bi-eye-slash"}
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      left: "90%",
      top: "60%",
      transform: "translateY(-50%)",
      color: "white",
      fontSize: "1.5rem",
      cursor: "pointer"
    }}></i>
            </div>
            <br/>
          </div>
          
        )}

       
        {role === "freelancer" && (
          <div className="freelancer-form">
              <div  style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
               className="datas"
              placeholder="Name"
              value={freelancerData.name}
              onChange={(e) =>
                setFreelancerData({
                  ...freelancerData,
                  name: e.target.value
                })
              }
            />
             <i className="bi bi-person-circle"  style={{position: "absolute",left:"90%" ,top: "60%", transform: "translateY(-50%)", color: "white",fontSize: "1.5rem" ,pointerEvents: "none"}}></i>
            </div>
           
            <div  style={{ position: "relative", width: "100%" }}>
            <input
              type="email"
               className="datas"
              placeholder="Email"
              value={freelancerData.email}
              onChange={(e) =>
                setFreelancerData({
                  ...freelancerData,
                  email: e.target.value
                })
              }
            />
            <i className="bi bi-envelope-at-fill"  style={{position: "absolute",left:"90%" ,top: "60%", transform: "translateY(-50%)", color: "white",fontSize: "1.5rem" ,pointerEvents: "none"}}></i>
            </div>
           
           <div  style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword? "text" :"password"}
               className="datas"
              placeholder="Password"
              value={freelancerData.password}
              onChange={(e) =>
                setFreelancerData({
                  ...freelancerData,
                  password: e.target.value
                })
              }
            />
             <i className={showPassword ? "bi bi-eye bi " : "bi-eye-slash"}
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      left: "90%",
      top: "60%",
      transform: "translateY(-50%)",
      color: "white",
      fontSize: "1.5rem",
      cursor: "pointer"
    }}></i>
            </div>
           
              <div  style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
               className="datas"
              placeholder="Skill"
              value={freelancerData.skill}
              onChange={(e) =>
                setFreelancerData({
                  ...freelancerData,
                  skill: e.target.value
                })
              }
            />
           
            <i className="bi bi-patch-check-fill"  style={{position: "absolute",left:"90%", top: "60%", transform: "translateY(-50%)", color: "white",fontSize: "1.5rem" ,pointerEvents: "none"}}></i>
            </div>
            
          <br/>
            
          </div>
        )}

        

       <div className ="btn-con" style={{marginTop:role === "poster" ? "30px" : "0px"}}>

       <button style={buttonStyle} type="submit"  >
        <i
          className={isLogin ? "bi bi-box-arrow-in-right" : "bi bi-box-arrow-in-down"}
          style={{ color: "white", fontSize: "1.2rem", marginRight: "8px" }}
        ></i>
        {isLogin ? "Login" : "Register"}
      </button>

      <p style={{ marginTop: "12px", textAlign: "center" ,color:"white" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span
          style={{ color: "blue", cursor: "pointer",fontWeight: "600", marginLeft: "6px" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? " Create an account" : " Login"}
        </span>
      </p>

       </div>
      </form>
      </div>
    </div>
    </div> 
   
  );
}

export default Authentication;