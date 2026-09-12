import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";


const Layout = () =>{
  
    return(
 <div className="container">
  <Sidebar/>
  <div className ="containers">
 <Header/>
  
<Outlet/>
  
  </div>
  </div>
    );
}

export default Layout;