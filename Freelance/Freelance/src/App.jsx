
import "bootstrap/dist/css/bootstrap.min.css";

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PostedTasks from "./component/PostedTasks";
import Layout from './component/Layout';
import Dashboard from './component/Dashboard';
import Layout1 from './component/Layout1';
import Authentication from "./component/Authenticatication";
import Applyfortasks from "./component/Applyfortasks";
import Applicantslist from "./component/Applicantslist";
import Lecture from "./component/Lecture";
import Selectedfreelancer from "./component/Selectedfreelancer";
import ChatBot from "./component/chatBot";




function App() {
 return(
 <BrowserRouter>
 <Routes>
<Route path="/" element={<Authentication/>}/>
<Route path='/' element={<Layout/>}>
<Route path="/dashboard" element={<Dashboard/>}/>
</Route>
<Route element= {<Layout1/>}>
<Route path='/PostedTasks' element={<PostedTasks/>}/>
<Route path='/ApplyForTasks' element={<Applyfortasks/>}/>
<Route path="/Applicantlist" element ={<Applicantslist/>}/>
<Route path="/Selectedfreelancer" element={<Selectedfreelancer/>}/>
<Route path="/Lecture" element ={<Lecture/>}/>
</Route>
</Routes>
<ChatBot/>
</BrowserRouter>

  )
}

export default App;
