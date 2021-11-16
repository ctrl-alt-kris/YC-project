
import { useState } from "react"
import "./Login.css"

import Modal from "../Ui/Modal"


const Login = (props) => {
    
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    //Modal state and events

    const submitHandler = (event) => {
        event.preventDefault()
        let data = {username, password}
        props.login(data)
    }
    return(
        <div className="d-flex col-12 justify-content-center">
            <div className="card box">
                <form onSubmit={submitHandler} >
                    <h1>Login</h1>
                    <p className="text-muted"> Please enter your login and password!</p> 
                    <input type="text" name="" placeholder="Username" onChange={e => setUsername(e.target.value)}/> 
                    <input type="password" name="" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                    {props.error.length > 0 && <p>{props.error}</p>} 
                    <a className="forgot text-muted" >Forgot password?</a> 
                    <input type="submit" name="" value="Login" />
                </form>

            </div>

            
        </div>
    )
}

export default Login