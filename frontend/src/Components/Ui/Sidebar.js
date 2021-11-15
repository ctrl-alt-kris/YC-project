import './Sidebar.css'
import { Link, Router, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
const LinkElement = (props) => {
    return (
        <Link to={props.path}>
            <div className={`link-element ${props.selected ? "selected" : ""}`}>
            <FontAwesomeIcon icon={props.icon} size="lg"/>
        <a className="nav-link">{props.name}</a>
            </div>
        </Link>
    )
}

const Sidebar = () => {
    let activePage = "home"
    const location = useLocation()

    if(location.pathname.includes("upload"))
    {
        activePage = "upload"
    }
    return(
        
        <div id="mySidebar" className="sidebar">
                <LinkElement path="/" name="Home" icon={faHome} selected={activePage === "home"}/>
                <LinkElement path="upload" name="Upload" icon={faUpload} selected={activePage === "upload"}/>
        </div>
        
    )
}

export default Sidebar;