import './Sidebar.css'
import { Link, Router, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { FaDiceSix } from "react-icons/fa";
import { TiChartPie, TiCogOutline, TiGroupOutline  } from "react-icons/ti";
import { AiFillDatabase, AiFillHome } from "react-icons/ai";
import {GiAbstract050, GiArchBridge} from 'react-icons/gi'

const LinkElement = (props) => {
    return (
        <Link to={props.path}>
            <div className={`link-element ${props.selected ? "selected" : ""}`}>
            <FontAwesomeIcon icon={props.icon} size="lg"/>
        <a class="nav-link">{props.name}</a>
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
        <div className="sidebar-brand">
            <GiArchBridge />
        </div>
        <hr style={{color: "white"}}/>
        <Link to="/">
            <div className="row">
                <div className="col-2">
                    <div className="sidebar-icon">
                        <AiFillHome />
                    </div>
                </div>
                <div className="col-2">
                    Home
                </div>
            </div>
        </Link>
        <Link to="/portfolio">
            <div className="row">
                <div className="col-2">
                    <div className="sidebar-icon">
                        <TiChartPie></TiChartPie>
                    </div>
                </div>
                <div className="col-2">
                    Portfolio
                </div>
            </div>
        </Link>
        <Link to="/data">
            <div className="row">
                <div className="col-2">
                    <div className="sidebar-icon">
                    <AiFillDatabase></AiFillDatabase>
                    </div>
                </div>
                <div className="col-2">
                    Upload
                </div>
            </div>
        </Link>
        <Link to="/">
            <div className="row">
                <div className="col-2">
                    <div className="sidebar-icon">
                    <TiGroupOutline></TiGroupOutline>
                    </div>
                </div>
                <div className="col-2">
                    About
                </div>
            </div>
        </Link>
        <Link to="/">
            <div className="row">
                <div className="col-2">
                    <div className="sidebar-icon">
                    <TiCogOutline></TiCogOutline>
                    </div>
                </div>
                <div className="col-2">
                    Settings
                </div>
            </div>
        </Link>
    </div>

        )
}

export default Sidebar;