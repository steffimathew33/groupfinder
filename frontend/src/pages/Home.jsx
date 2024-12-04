import { CreateGroup } from "../components/CreateGroup";
import { SendRequestButton } from "../components/SendRequest";
import { RequestsList } from "../components/RequestsReceived";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Import JWT Decode
import "./Home.css"; // Import the CSS file for styling

export function Home() {
    const [inGroup, setInGroup] = useState(null); // To store whether the user is in a group

    // Function to check if the user is in a group
    const loadUserData = async () => {
        const token = sessionStorage.getItem("User"); // Get the token from sessionStorage
        if (token) {
            const decodedUser = jwtDecode(token); // Decode the JWT token to get user details
            const groupId = decodedUser.inGroup; // Get the groupId (if any) from the decoded token

            // If the user has a group ID, they are in a group
            setInGroup(groupId ? true : false);
        }
    };

    // Load user data on initial mount and whenever inGroup changes
    useEffect(() => {
        loadUserData(); // Check the user's group status when the component mounts
    }, []); // Run only once on mount (or you could trigger it whenever necessary)

    // Function to handle when user has joined/created a group
    const refreshUserData = async () => {
        await loadUserData(); // Refresh user data after group creation or change
    };

    // While we don't know if the user is in a group, we show a loading message
    if (inGroup === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {!inGroup ? (
                <div className="home-page-container1">
                    <RequestsList />  {/* Show request list */}
                    <CreateGroup onGroupCreated={refreshUserData} />  {/* Refresh data after creating a group */}
                </div>
            ) : (
                <div className="home-page-container2">
                    <RequestsList />       {/* Show the list of requests */}
                    <SendRequestButton />  {/* Show button to send requests */}
                </div>
            )}
        </>
    );
}
