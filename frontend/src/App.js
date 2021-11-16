import "./App.css";
import React from "react";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Navbar from "./components/ui/Navbar";
import Sidebar from "./components/ui/Sidebar";
import Home from "./components/pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Upload from "./components/pages/Upload";
import Portfolio from "./components/pages/Portfolio"
import { DataContext } from "./utils/DataContext";

function App() {
  const [auth, setAuth] = useState({access_token:"", token_type:""});
  const [activePage, setActivePage] = useState("home")
  const [error, setError] = useState("")

  const login = (data) => {
    //for now we set auth to token, usemutation should go here once done
    //return api_fetch("/login_json/", { method: "POST", body: props}).then((response) => setAuth(response.access_token));
     fetch("http://localhost:8000/login_json",
    {method: "POST",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)

  }).then(res => res.json()).then(payload => {
    if (Object.keys(payload).includes("access_token"))
    {
    setAuth(payload)
    }
    else
    {
      setError("username and password do not match")
    }
  })
  };

  if (!auth.access_token) {
    return <Login login={login} error={error} />;
  }

  return (
    // <div className="row">

    //     <Router>
    //       <div className="col-2">
    //         <Sidebar  />
    //       </div>
    //       <div className="col-10">
    //         <Routes>
    //           <Route path="/" element={<Home />}/>
    //           <Route path="companies" element={<Home />}/>
    //           <Route path="upload" element={<Upload />}/>
    //         </Routes>
    //       </div>
    //     </Router>

    <div className="App container">
      <DataContext.Provider value={{
        auth, 
        setAuth,
        activePage,
        setActivePage
        }}>
      <Router>
        <Sidebar></Sidebar>
      
      <div className = "main col-11">
        <Navbar onLogout={() => setAuth({access_token:"", token_type:""})}></Navbar>
        <Routes>
          <Route path="upload" element={<Upload />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>



        {/* <Dashboard></Dashboard> */}
      </Router>
      </DataContext.Provider>
    </div>
  );
}

export default App;
