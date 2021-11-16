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

export const TokenContext = React.createContext(null);

function App() {
  const [auth, setAuth] = useState();

  const login = (props) => {
    //for now we set auth to token, usemutation should go here once done
    //return api_fetch("/login_json/", { method: "POST", body: props}).then((response) => setAuth(response.access_token));
    setAuth("token");
    console.log(auth);
  };

  if (!auth) {
    return <Login login={login} />;
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

    <div className="App">
      <Router>
      <Navbar></Navbar>
            <Sidebar></Sidebar>
      <div className = "main">
        <Routes>
          <Route path="upload" element={<Upload />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>



        {/* <Dashboard></Dashboard> */}
      </Router>
    </div>
  );
}

export default App;
