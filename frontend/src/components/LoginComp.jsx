import { verifyUser } from "../api"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"

export function LoginUser() {

    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate()

    function handleChange(e) {
        setUser({...user, [e.target.name]: e.target.value})
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let response = await verifyUser(user);
        if (response) {
            sessionStorage.setItem("User", response); //Set user = jsonwebtoken in session storage (found in Inspect element
            //Add a default Authorization field to every axios request made to backend
            //Once this is set, every request made by Axios will automatically include this token in the Authorization header
            axios.defaults.headers.common["Authorization"] = `Bearer ${response}` //Bearer is a formatting norm.
            navigate("/home");

        } else {
            alert("Login failed.")
        }
            
    }

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder={"Email"} onChange={handleChange} name="email" required maxLength={40}/>
            <input placeholder={"Password"} onChange={handleChange} name="password" type="password" required maxLength={20}/>
            <button type="submit">Login</button>
        </form>
    )
}