import "./Navbar.css"
import { VscAccount } from "react-icons/vsc"
import { useContext } from "react"

const Header = (props) => {
    return(
      
        <div className="normal-header-container">
           <nav class="navbar navbar-expand-lg navbar-light">
            <div className="navbar-brand">Portfolio</div>
              <div className="navbar-logo" onClick={props.onLogout}>
              Logout
            </div>
          </nav>
          <hr style={{ marginTop: "-10px"}}/>
        </div>
        
    )
}

export default Header;