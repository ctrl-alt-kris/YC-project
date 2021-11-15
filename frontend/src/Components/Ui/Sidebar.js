import "./Sidebar.css";
import React from "react";
import { useNavigate } from "react-router";



const Sidebar = () => {

    let navigate = useNavigate();
  
    const menuOptions = [
    {
        title: "Home",
        link: "/",
    },
    {
        title:"Companies",
        link:"companies",
    },
]

const Clickhandler = (link) => {
    navigate(link)
}

    return (
      <React.Fragment>
        <div className="side-bar">
            <ul className="nav">
        {menuOptions.map((item, i) => {
                return(
                    <li className="nav-item m-2" key={i}>
                        <span className={`nav-link active`} aria-current="page" onClick={() => Clickhandler(item.link)}>
                            {item.title}
                        </span>
                    </li>
                )
            })}
            </ul>
        </div>
      </React.Fragment>
    );
  };

  export default Sidebar