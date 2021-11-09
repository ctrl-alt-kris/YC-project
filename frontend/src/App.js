// import logo from './logo.svg';
import './App.css';
import Dashboard from './components/pages/Dashboard';
import Navbar from './components/UI/Navbar';
import Sidebar from './components/UI/Sidebar';




function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="row">
        <div className="col-1">
          <Sidebar></Sidebar>
        </div>
      </div>
      <Dashboard></Dashboard>
    </div>
  );
}

export default App;
