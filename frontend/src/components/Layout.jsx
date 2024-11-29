
import { Navbar } from "./Navbar"
import{ Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react";

//Parent component to all pages that have a navbar on them.
export function Layout() {

    let user = sessionStorage.getItem("User")
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
        navigate("/")
        }
    }, [user]) //If the user is not logged in (aka no token in session storage, navigate back to login)
    
    return (
        <>
            <Navbar/>
            <Outlet/>

        </>
    )
}