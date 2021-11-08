
import { useState } from "react"
import "./Login.css"

const Login = (props) => {
    
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const submitHandler = (event) => {
        event.preventDefault()


        // props.setToken(username+password)
    }

    console.log(username, password)
    return(
        <div className="d-flex justify-content-center">
            <div className="card box">
                <form onSubmit={submitHandler} >
                    <h1>Login</h1>
                    <p className="text-muted"> Please enter your login and password!</p> 
                    <input type="text" name="" placeholder="Username" onChange={e => setUsername(e.target.value)}/> 
                    <input type="password" name="" placeholder="Password" onChange={e => setPassword(e.target.value)}/> 
                    <a className="forgot text-muted" >Forgot password?</a> 
                    <input type="submit" name="" value="Login" />
                </form>
            </div>
        </div>
    )
}

export default Login