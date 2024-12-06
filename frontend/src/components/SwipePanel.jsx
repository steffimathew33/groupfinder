import { sendGroupRequest, getRandomUser } from "../api";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function SendRequestButton() {

    const [requestData, setRequestData] = useState({
        recipientUserId: null,
        senderId: null,
        groupId: null,
    });
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
            setRequestData((prevData) => ({ ...prevData, senderId: decodedUser._id, groupId: decodedUser.inGroup }));
            setLoading(false);
            const random = await getRandomUser();
            setRandUser(random);
        }
        loadUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    // Function to send a group request
    const sendRequest = async () => {
        const updatedRequestData = {
            ...requestData,
            recipientUserId: randUser._id,
        };
        try {
            const response = await sendGroupRequest(requestData.groupId, updatedRequestData);
            alert(response.data.message);
            console.log(requestData);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred");
        }

        switchPerson();
    };

    async function switchPerson() {
        try {
            const response = await getRandomUser();
            setRandUser(response);

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
