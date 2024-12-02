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
            <div className = "new-account-button">
                <LoginUser/>
                <button onClick={() => setView(!view)}>Create New Account</button>
            </div> :
            <div className = "already-user-button">
                <CreateUser/>
                <button onClick={() => setView(!view)}>Already A User?</button>
            </div> 
            }         
        </>
)
}