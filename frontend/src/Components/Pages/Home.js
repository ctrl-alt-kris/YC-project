
import "./Home.css"

const Home = () => {

    return(
        <div className="col-12">
            <div className="card col-2 box">
                <form onsubmit="event.preventDefault()" >
                    <h1>Login</h1>
                    <p className="text-muted"> Please enter your login and password!</p> 
                    <input type="text" name="" placeholder="Username"/> 
                    <input type="password" name="" placeholder="Password"/> 
                    <a className="forgot text-muted" href="#">Forgot password?</a> 
                    <input type="submit" name="" value="Login" href="#"/>
                </form>
            </div>
        </div>
    )
}

export default Home