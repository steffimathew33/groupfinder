import { CreateUser } from "../components/CreateUser"
import { LoginUser } from "../components/LoginComp"
import { useState } from "react"
import "./Login.css"; // Import the CSS file for styling

export function Login(){

    //If view = 0 --> Login, if view = 1 --> Create
    const [view, setView] = useState(0); 
    return(
        <>
        {/*If the view is 0, show the login page with a button to switch views, it's an if statement basically using ?*/}
            {!view ?
                <div className = "login-page-container">
                    <LoginUser/>
                    <div className = "new-account-button">
                        <button onClick={() => setView(!view)}>Create New Account</button>
                    </div>
                </div> :
                <div className = "create-account-container">
                    <CreateUser/>
                    <div className = "already-user-button">
                        <button onClick={() => setView(!view)}>Already A User?</button>
                    </div> 
                </div>
            }         
        </>
)
}