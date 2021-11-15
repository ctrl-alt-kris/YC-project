
import { useState } from "react"
import "./Login.css"

import Modal from "../Ui/Modal"


const Login = (props) => {
    
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    //Modal state and events
    const [showModal, updateShowModal] = useState(false);
    const toggleModal = () => updateShowModal(state => !state);

    const submitHandler = (event) => {
        event.preventDefault()
        let data = {username, password}
        props.login(data)
    }

    console.log(username, password)
    return(
        <div className="d-flex col-12 justify-content-center">
            <div className="card box">
                <form onSubmit={submitHandler} >
                    <h1>Login</h1>
                    <p className="text-muted"> Please enter your login and password!</p> 
                    <input type="text" name="" placeholder="Username" onChange={e => setUsername(e.target.value)}/> 
                    <input type="password" name="" placeholder="Password" onChange={e => setPassword(e.target.value)}/> 
                    <a className="forgot text-muted" >Forgot password?</a> 
                    <input type="submit" name="" value="Login" />
                </form>
                <button onClick={toggleModal}>Show Modal</button>
                <Modal canShow={showModal} updateModalState={toggleModal} />
            </div>

            
        </div>
    )
}

export default Login