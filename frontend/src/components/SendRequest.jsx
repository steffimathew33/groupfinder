import { sendGroupRequest } from "../api";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


export function SendRequestButton() {
    const groupId = null;

    const [requestData, setRequestData] = useState({
        recipientUserId: null,
        senderId: null, 
    });

    useEffect(() => {
        async function loadUserData() {
            const token = sessionStorage.getItem("User");
            if (token) {
                const decodedUser = jwtDecode(token);
                setRequestData((prevData) => ({...prevData, senderId: decodedUser._id}));
            }
        }
        loadUserData();
    }, []);


    const sendRequest = async () => {
        try {
            const response = await sendGroupRequest(groupId, requestData)
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="swipe-container">
        <div className="swipe-right">
        <button onClick={sendRequest}>
        </button>
        </div>
        </div>
    );
}
