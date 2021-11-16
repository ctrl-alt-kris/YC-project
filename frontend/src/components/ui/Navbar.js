import "./Navbar.css"
import { VscAccount } from "react-icons/vsc"
import { useContext } from "react"
import { DataContext } from "../../utils/DataContext"

const Header = (props) => {
  const {activePage} = useContext(DataContext)

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
    return(
      
        <div className="normal-header-container">
           <nav class="navbar navbar-expand-lg navbar-light">
            <div className="navbar-brand">{capitalizeFirstLetter(activePage)}</div>
              <div className="navbar-logo" onClick={props.onLogout}>
              Logout
            </div>
          </nav>
          <hr style={{ marginTop: "-10px"}}/>
        </div>
        
    )
}

export default Header;