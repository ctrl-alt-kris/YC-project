import './App.css';
import React from 'react';
import Login from './Components/Pages/Login';
import Home from './Components/Pages/Home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState } from 'react';


export const TokenContext = React.createContext(null);

function App() {
  const [auth, setAuth] = useState()

  const login = (props) => {
    //for now we set auth to token, usemutation should go here once done
    //return api_fetch("/login_json/", { method: "POST", body: props}).then((response) => setAuth(response.access_token));
    setAuth("token")
    console.log(auth)
  }

  if(!auth) {
    return <Login setToken={login} />
  }


  return (
    <div className="container">
    
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
        </Routes>
      </Router>
     
    </div>
  );
}

export default App;
