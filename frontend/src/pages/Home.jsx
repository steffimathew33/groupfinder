import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Import JWT Decode
import { CreateGroup } from "../components/CreateGroup";
import { SendRequestButton } from "../components/SendRequest";
import { RequestsList } from "../components/RequestsReceived";
import "./Home.css"; // Import the CSS file for styling

export function Home() {
    const [inGroup, setInGroup] = useState(null); // To store whether the user is in a group
    const [loading, setLoading] = useState(true); // State for loading indicator

    // Function to check if the user is in a group
    const loadUserData = async () => {
        const token = sessionStorage.getItem("User"); // Get the token from sessionStorage
        
        if (token) {
            try {
                const decodedUser = jwtDecode(token); // Decode the JWT token to get user details
                const groupId = decodedUser.inGroup; // Get the groupId (if any) from the decoded token
                
                // If the user has a group ID, they are in a group
                setInGroup(groupId ? true : false);
            } catch (error) {
                console.error("Error decoding JWT:", error);
                setInGroup(false); // If there's an error decoding, assume user is not in a group
            }
        } else {
            setInGroup(false); // If no token is found, the user is not in a group
        }
        setLoading(false); // Stop loading after the data is checked
    };

    // Call the loadUserData function when the component is mounted
    useEffect(() => {
        loadUserData(); // Check the user's group status when the component mounts
    }, []); // Run once on mount (or you could trigger it whenever necessary)

    // Function to handle when user has joined/created a group
    const refreshUserData = async () => {
        await loadUserData(); // Refresh user data after group creation or change
    };

    // While we don't know if the user is in a group, we show a loading message
    if (loading) {
        return <div>Loading...</div>;
    }

    // Example of a way to refresh the token manually after a group change (if needed):
    const handleGroupChange = async () => {
        // Simulate an API call that updates the user's group
        const newToken = await fetchUpdatedTokenFromServer();

        // Update the token in sessionStorage
        sessionStorage.setItem("User", newToken);

        // Refresh the state to reflect the new token
        await refreshUserData();
    };

    // Fetch a new token from the server
    const fetchUpdatedTokenFromServer = async () => {
        // Example of an API call to refresh the token (you would need to implement this)
        const response = await fetch("/api/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refreshToken: sessionStorage.getItem("RefreshToken"), // Assuming you have a refresh token stored
            }),
        });
        const data = await response.json();

        if (response.ok) {
            return data.newAccessToken; // New token returned from the server
        } else {
            throw new Error("Failed to refresh token");
        }
    };

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
