import './Sidebar.css'
import { Link, Router } from 'react-router-dom';

const Sidebar = () => {
    return(
        
        <div id="mySidebar" className="sidebar">
            
            
            {/* <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Clients</a>
            <a href="#">Contact</a> */}
                <Link to="/">
                <a class="nav-link">Home</a>
                </Link>
                <Link to="upload">
                <a class="nav-link">Upload</a>
                </Link>
        </div>
        
    )
}

export default Sidebar;