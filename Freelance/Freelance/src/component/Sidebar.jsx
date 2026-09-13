
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar=()=>{
  const location = useLocation();
   const navigate = useNavigate();
    const buttons = [
    {name: "Dashboard", path:"/dashboard" , icon:"bi bi-clipboard-check"}
    ];
  

    return(
     <div className="sidebar" >
    <i class="bi bi-browser-firefox" style={{color:"white" , display:"flex", justifyContent:"center", alignItems:"center" , fontSize:"60px"}}></i>
    <span className="fs-4" style={{fontWeight:"bold" , color:"white" , fontStyle:"italic"}}>MiniFiverr</span>  <hr/> 
  
    
  {buttons.map((items,index)=>(
     
     <div className="listBtn" key={items.id || index} >
     <button type="button"  onClick={()=> navigate(items.path) }     className={`btn  ${location.pathname === "/dashboard" || location.pathname === "/PostedTasks" || location.pathname === "/ApplyForTasks" || location.pathname === "/Applicantlist"  || location.pathname === "/Selectedfreelancer"|| location.pathname === "/Lecture" ||  location.pathname === "/ViewTask" ? "active" : " "}  `} ><i className={items.icon}></i> {items.name}</button>
</div>
     
  ))}  
   </div> 
    );
}
export default Sidebar;