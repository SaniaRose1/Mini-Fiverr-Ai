import { useEffect, useState } from "react";

const Applyfortasks =()=>{
 const [task , setTask] = useState([]) ;
  const [role , setRole] = useState(null);
     
  useEffect(()=>{

   
    const userRole = localStorage.getItem("user");
    console.log("role from localstorage" , userRole)
    if (userRole) {
      const user = JSON.parse(userRole);
      if(user && userRole){
      setRole(user.role);
      }
      
    }
      
            fetch(`${import.meta.env.VITE_API_URL}/api/auth/post`)
            .then((res)=> res.json())
            .then((data)=>{
                console.log(data);
                setTask(data)})
            .catch((error)=>console.log(error))
        },[]);
                
         const DeletePost = async (id) =>{
           try{
                const res =   await  fetch(`${import.meta.env.VITE_API_URL}/api/auth/post/${id}`, {
                      method: "DELETE"
                  });
                   const result = await res.json();
                 console.log("Delete response:", result);

                 if (res.ok) {
                  setTask(task.filter((item)=> item._id != id));
                 }
                      
          }
          catch(error){
             console.log(error);
          }
        }
       
      const ApplyForTask = (post) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userSkill = Array.isArray(user?.skill) ? user.skill[0] : user?.skill;
    const posts = Array.isArray(post?.skill) ? post.skill[0] : post?.skill;
    
    console.log("User skill:", user?.skill);
   console.log("Task skill:", post.skill);
   
   if (userSkill?.toLowerCase().trim()  !== posts?.toLowerCase().trim()) {
      alert("Skill does not match the requirement!");
      return;
    }
    const application = {
      name: user?.name,
      email: user?.email,
      title: post.title,
      budget: post.budget,
      skill: posts,
    };

    const storedApplications =
      JSON.parse(localStorage.getItem("applications")) || [];
    storedApplications.push(application);
    localStorage.setItem("applications", JSON.stringify(storedApplications));

    alert("Applied successfully!");
  };
      
    return(
   <div className="Posted-Tasks" >
    <h1 className="applyHead"> {role === "freelancer" ? "Apply for Tasks" : "Assign The Tasks"} </h1>
    <div className="postbox">
        {  task.length==0 ? <h1 style={{fontStyle:"italic"}}>ADD POST PLEASE</h1> : (task.map((post) => (
          <div key={post._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" , borderRadius:"10px",fontStyle:"italic" ,width:"215px" , height:"310px"}} className="task">
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p>Budget: {post.budget}</p>
            <p>Issue Date: {new Date(post.issueDate).toLocaleDateString()}</p>
            <p>Deadline: {new Date(post.deadlineDate).toLocaleDateString()}</p>
            <p>Skills: {post.skill}</p>
             <div style={{display:"flex" , justifyContent:"center"}}>
            {role === "poster" && (<button type="button" id="delete-post" onClick={()=> DeletePost(post._id)} >Delete Task</button>)}
            {role === "freelancer" && (<button type="button" id="delete-post" onClick={() => ApplyForTask(post)}
              disabled={JSON.parse(localStorage.getItem("applications"))?.some(
      (app) => app.email === JSON.parse(localStorage.getItem("user"))?.email && app.title === post.title)}>
         {JSON.parse(localStorage.getItem("applications"))?.some((app) => app.email === JSON.parse(localStorage.getItem("user"))?.email && app.title === post.title
    )
      ? "Applied"
      : "Apply"}



      </button>)}
             </div>
          </div>
        ))) }
       
      </div>
 </div> 

    );
}

export default Applyfortasks;