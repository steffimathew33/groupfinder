import { createUser } from "../api"
import { useState } from "react"

export function CreateUser() {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })

    function handleChange(e) {
        setUser({...user, [e.target.name]: e.target.value})
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            let response = await createUser(user);
            console.log(response);
    
            if (response.status !== 200) {
                alert("Account could not be created.");
            }
        } catch (error) {
            // Handle the error if the request failed
            if (error.response) {
                if (error.response.status === 400) {
                    alert("This email is already taken.");
                } else {
                    alert(`An error occurred: ${error.response.status}`);
                }
            } else if (error.request) {
                // The request was made, but no response was received
                alert("No response received from the server.");
            } else {
                // Something else went wrong with setting up the request
                alert(`Error: ${error.message}`);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder={"First Name"} onChange={handleChange} name="firstName" required maxLength={20}/>
            <input placeholder={"Last Name"} onChange={handleChange} name="lastName" required maxLength={20}/>
            <input placeholder={"Email"} onChange={handleChange} name="email" required maxLength={40}/>
            <input placeholder={"Password"} onChange={handleChange} name="password" type="password" required maxLength={20}/>
            <button type="submit">Create Account</button>
        </form>
    )
}