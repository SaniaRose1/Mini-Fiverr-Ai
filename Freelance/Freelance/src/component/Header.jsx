import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
const Header = () =>{
  const navigate = useNavigate();
 const [role , setRole] = useState(null);
 const [name , setName] = useState(null);
 
  useEffect(() => {
    const userRole = localStorage.getItem("user");
    console.log("role from localstorage" , userRole)
    if (userRole) {
      const user = JSON.parse(userRole);
      setRole(user.role);
      setName(user.name);
    }
  }, []);

  const handleLogout = () => {
  
  localStorage.removeItem("user");
  navigate("/");
};
   
return(
       
<header className="  header"> 

<h1 style={{color:"white" , fontStyle:"italic"}}><i class="bi bi-person-circle " style={{color:"white" , fontSize:"3rem"}}></i> WELCOME "{role}" {name}</h1>
<button className="logout" onClick={handleLogout}><i class="bi bi-box-arrow-left icon " ></i></button> </header>













    );
}

export default Header;