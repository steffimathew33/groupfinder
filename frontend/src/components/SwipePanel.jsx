import { sendGroupRequest } from "../api";  // Assuming this is the function to send the request
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../api";  // Assuming getUser is a function that fetches user data from the API

export function SendRequestButton() {
    const groupId = "674d5f6069ebe36c9ed63429"; // Example group ID

    const [requestData, setRequestData] = useState({
        recipientUserId: "674fa4578d450f3f2cc7486d", // Example recipient (Steffi)
        senderId: null,
    });
    const [userData, setUserData] = useState(null);  // For storing user profile data
    const [loading, setLoading] = useState(true);    // For loading state

    useEffect(() => {
        async function loadUserData() {
            const token = sessionStorage.getItem("User");  // Get the token from sessionStorage
            if (!token) {
                console.log("No token found");
                setLoading(false);  // Set loading to false if no token is found
                return;
            }

            const decodedUser = jwtDecode(token); // Decode the JWT token to get user details
            console.log("Decoded user:", decodedUser);
            setRequestData((prevData) => ({ ...prevData, senderId: decodedUser._id }));

            try {
                // Fetch the user data from the server using the decoded user ID
                const user = await getUser(decodedUser._id);
                console.log("Fetched user data:", user);  // Check if user data is fetched correctly
                setUserData(user);  // Store the fetched user data
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);  // Set loading to false after the API call completes
            }
        }
        loadUserData();
    }, []);  // Empty dependency array ensures this runs once on mount

    // If still loading or userData hasn't been fetched, show a loading message
    if (loading) {
        return <div>Loading...</div>; // You can replace this with a spinner or some other loading UI
    }

    // If there's no user data, show a fallback message
    if (!userData) {
        return <div>Failed to load user data.</div>;
    }

    // Function to send a group request
    const sendRequest = async () => {
        try {
            const response = await sendGroupRequest(groupId, requestData);
            alert(response.data.message); // Display success message
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred"); // Handle errors
        }
    };

    return (
        <div className="swipe-container">
            {/* Profile details inside the swipe-container */}
            <div className="profile-info">
                <img
                    src={userData?.profilePicture || "/default-profile.png"} // Fallback image if no profile picture
                    alt={`${userData?.firstName} ${userData?.lastName}'s profile`}
                    className="profile-image"
                />
                <h2>{`${userData?.firstName} ${userData?.lastName}`}</h2>
                <p>Major: {userData?.major}</p>
                <p>Graduation Year: {userData?.gradYear}</p>
                <p>Bio: {userData?.bio || "No bio available"}</p>
                <p>Signup Date: {userData ? new Date(userData.signupDate).toLocaleDateString() : "N/A"}</p>
            </div>

            {/* Buttons for sending/denying request */}
            <div className="button-row">
                <div className="swipe-left">
                    <button>Reject</button>
                </div>
                <div className="swipe-right">
                    <button onClick={sendRequest}>Send Request</button>
                </div>
            </div>
        </div>
    );
}
