import './App.css';
import Login from './Components/Pages/Login';
import Home from './Components/Pages/Home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { createContext, useState } from 'react';

function App() {
  

  const token = createContext("")




  if(!token) {
    return <Login setToken={setToken} />
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
