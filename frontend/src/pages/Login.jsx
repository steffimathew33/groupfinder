import { CreateUser } from "../components/CreateUser"
import { LoginUser } from "../components/LoginComp"
import { CreateGroup } from "../components/CreateGroup"
import { useState } from "react"

export function Login() {

    // If view = 0 --> Login, if view = 1 --> Create
    const [view, setView] = useState(0); 

    return (
        <>
            {/*If the view is 0, show the login page with a button to switch views*/}
            {!view ? (
                <>
                    <LoginUser />
                    <button onClick={() => setView(!view)}>Create New Account</button>
                </>
            ) : (
                <>
                    <CreateUser />
                    <button onClick={() => setView(!view)}>Already A User?</button>
                </>
            )}
            <CreateGroup />
        </>
    );
}