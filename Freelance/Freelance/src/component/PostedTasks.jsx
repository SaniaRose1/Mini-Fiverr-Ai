import { useEffect,useRef , useState } from "react";

const PostedTasks =()=>{
    const [task , setTask] = useState([]) ;
    const [role , setRole] = useState(null);

    const  title = useRef();
    const   description = useRef("");
    const  budget  = useRef("");
    const issueDate =useRef("");
    const deadlineDate  = useRef("");
    const skill  = useRef ("");
  
    useEffect(()=>{
const userRole = localStorage.getItem("user");
 console.log("role from localstorage" , userRole)
    if (userRole) {
      const user = JSON.parse(userRole);
        if(user && userRole){
      setRole(user.role);
      }
     
    }
    },[]);
  
const Addpost = async (e) =>{
    e.preventDefault();
      const data = { 
       title :  title.current.value,
        description :  description.current.value,
        budget :   budget .current.value,
       issueDate :issueDate.current.value,
        deadlineDate :deadlineDate.current.value,
        skill : skill.current.value,
      };

      try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/post`,{
             method: "POST",
             headers:{
              "Content-Type":"application/json"
             },
             body:JSON.stringify(data)
            });
          const result = await res.json();
          console.log(result);

          if(res.ok){
        
            setTask(prev => [...prev, result]);
             alert("task added succesfully");
          }
            
      }
      catch(error){
         console.log(error);
      }
           
     }
      
     

    
                 
    return(
       <div className="Posted-Tasks" >
        <h1 className="heading">POST TASKS</h1>
        <div style={{display:"flex"}}>
      
      {role==="poster" && (<form onSubmit={Addpost}>
          <div className="postCreater">
             
              <input type="text" className="input" placeholder="Enter the Title" ref={title} />
              <input type="text" className="input" placeholder="Enter the Description" ref={description}/>
              <input type="number" className="input" placeholder="Enter the budget" ref={budget}/>
              <input type="date"  className="input" placeholder="Enter the issued date" ref={issueDate}/>
              <input type="date"className="input" placeholder="Enter the deadline date" ref={deadlineDate}/>
              <input type="text" className="input" placeholder="Enter the Required skills" ref={skill}/>
              <div style={{display:"flex" , justifyContent:"center"}}>
           <button type="submit" id="create-post" >Create Task</button>
              </div>
             </div>
             </form>
         )}
                 
        </div>

       </div>
    )
 }
 export default PostedTasks;