import logo from './logo.svg';
import './App.css';
import Login from './Components/Pages/Login';
import Home from './Components/Pages/Home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div className="container">
      
      <Login/>
      
    {/* commented out the router untill token is implemented */}
      {/* <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
        </Routes>
      </Router> */}
     
    </div>
  );
}

export default App;
