import { sendGroupRequest, getUser, getRandomUser } from "../api";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function SendRequestButton() {
    const groupId = "674d5f6069ebe36c9ed63429";

    const [requestData, setRequestData] = useState({
        recipientUserId: null,
        senderId: null,
    });
    const [userData, setUserData] = useState(null);
    const [randUser, setRandUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserData() {
            const token = sessionStorage.getItem("User");
            if (!token) {
                console.log("No token found");
                setLoading(false);
                return;
            }

            const decodedUser = jwtDecode(token); // Decode the JWT token to get user details
            console.log("Decoded user:", decodedUser);
            setRequestData((prevData) => ({ ...prevData, senderId: decodedUser._id }));

            try {
                const user = await getUser(decodedUser._id);
                setUserData(user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadUserData();
    }, []);  // Empty dependency array ensures this runs once on mount

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>Failed to load user data.</div>;
    }

    // Function to send a group request
    const sendRequest = async () => {
        try {
            const response = await sendGroupRequest(groupId, requestData);
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred");
        }
    };

    async function switchPerson() {
        try {
            const response = await getRandomUser();
            setRandUser(response);
            console.log(randUser);
            alert("Rejected Person.")

        } catch (error) {
            alert(error.response?.data?.message || "An error occurred");
        }
    }

    return (
        <div className="swipe-container">
            {/* Profile details inside the swipe-container */}
            <div className="profile-info">
                <img
                    src={randUser?.profilePicture || "/default-profile.png"} // Fallback image if no profile picture
                    alt={`${randUser?.firstName} ${randUser?.lastName}'s profile`}
                    className="profile-image"
                />
                <h2>{`${randUser?.firstName} ${randUser?.lastName}`}</h2>
                <p>Major: {randUser?.major}</p>
                <p>Graduation Year: {randUser?.gradYear}</p>
                <p>Bio: {randUser?.bio || "No bio available"}</p>
                <p>Signup Date: {randUser ? new Date(randUser.signupDate).toLocaleDateString() : "N/A"}</p>
            </div>

            {/* Buttons for sending/denying request */}
            <div className="button-row">
                <div className="swipe-left">
                    <button onClick={switchPerson}>Reject</button>
                </div>
                <div className="swipe-right">
                    <button onClick={sendRequest}>Send Request</button>
                </div>
            </div>
        </div>
    );
}
