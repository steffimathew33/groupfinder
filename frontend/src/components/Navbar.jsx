import { Link } from "react-router-dom"
import { pageData } from "./pageData"
import { useNavigate } from "react-router-dom";

export function Navbar() {

    const navigate = useNavigate();

    function Logout() {
        sessionStorage.removeItem("User");
        navigate("/")
    }
    
    return (
        <div className="navbar-container">
            <div className="navbar">
                {pageData.map((page) => {
                    return (
                        <Link to={page.path} className="navItem">
                            <div className="navbar-buttons">
                                <button>
                                    {page.name}
                                </button>
                            </div>
                        </Link>
                    )
                })}
                <div className="navbar-logout-button">
                    <button onClick={Logout}>Log Out</button>
                </div>


            </div>
        </div>
    )
}