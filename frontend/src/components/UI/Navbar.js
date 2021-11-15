import "./Navbar.css"
import { VscAccount } from "react-icons/vsc"

const Header = () => {
    return(
      
        <div className="normal-header-container">
           <nav class="navbar navbar-expand-lg navbar-light">
            <div className="navbar-brand">Portfolio</div>
              <div className="navbar-logo">
              <VscAccount />
            </div>
          </nav>
          <hr style={{ marginTop: "-10px"}}/>
        </div>
        
    )
}

export default Header;