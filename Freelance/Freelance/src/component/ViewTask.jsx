import { useEffect, useState } from "react";

const ViewTask = () => {
  const [applications, setApplications] = useState([]);
   const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

   
    const storedApplications = JSON.parse(localStorage.getItem("applications")) || [];

    
    const myApplications = storedApplications.filter(
      (app) => app.email === storedUser?.email
    );

    setApplications(myApplications);
  }, []);

  return (
    <div className="Applications">
      <h1 style={{ fontStyle: "italic" , color:"white" , display:"flex" , flexDirection:"row", justifyContent:"center",alignItems:"center" }}>My Applied Tasks</h1>
      <div className="application-box" style={{display:"flex",flexDirection:"row",flexWrap:"wrap",overflowY:"scroll",height:"100vh" }}>
      {applications.length === 0 ? (
           <h2 style={{ fontStyle: "italic" , color:"white" , display:"flex" }}>You haven’t applied to any tasks yet</h2>
        ) :(
          applications.map((app, index) => (
            <div
              key={index}
              style={{
                border: "1px solid gray",
                margin: "10px",
                padding: "10px",
                borderRadius: "10px",
                fontStyle: "italic",
                width: "215px",
                height: "250px",
                background:"linear-gradient(135deg,#4B2F78,#684494)", boxShadow:"0 0 20px rgba(160,100,255,0.20)" , border:"1px solid rgba(190,140,255,0.30)"
              }}
              className="application"
            >
              <h3>{app.title}</h3>
              <p>Budget: {app.budget}</p>
              <p>Skill: {app.skill}</p>
              <p>Description:{app.description}</p>
              <p>Issue Date:{app.issueDate}</p>
              <p>Deadline Date:{app. deadlineDate}</p>
            </div>

          ))
         
        )}
        </div>
      </div>
  
  );
};

export default ViewTask;
