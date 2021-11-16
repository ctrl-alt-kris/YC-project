import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom';
import { TiChartPie, TiCogOutline, TiGroupOutline  } from "react-icons/ti";
import { AiFillDatabase, AiFillHome } from "react-icons/ai";
import { GiArchBridge} from 'react-icons/gi'
import { useContext } from 'react';
import { DataContext } from '../../utils/DataContext';

const Sidebar = () => {
    const { activePage, setActivePage }  = useContext(DataContext)
    const location = useLocation()

    if(location.pathname.includes("home"))
    {
        setActivePage("home")
    }
    else if(location.pathname.includes("upload"))
    {
        setActivePage("upload")
    }
    else if(location.pathname.includes("portfolio"))
    {
        setActivePage("portfolio")
    }
    return(
        <div id="mySidebar" className="sidebar">

        <div className="sidebar-brand">
            <GiArchBridge />

        </div>
        <hr style={{color: "white"}}/>
        <Link to="/home" className={ `${activePage==="home"? "active-link" : ""}`}>
            <div className="row">
                <div className={`col-2`}>
                    <div className="sidebar-icon">
                        <AiFillHome />
                    </div>
                </div>
                <div className="col-2">
                    Home
                </div>
            </div>
        </Link>
        <Link to="/portfolio" className={ `${activePage==="portfolio"? "active-link" : ""}`}>
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
        <Link to="/upload" className={ `${activePage==="upload"? "active-link" : ""}`}>
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
        <Link to="/" className={ `${activePage==="about"? "active-link" : ""}`}>
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
        <Link to="/" className={ `${activePage==="settings"? "active-link" : ""}`}>
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