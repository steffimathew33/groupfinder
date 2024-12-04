import { sendGroupRequest } from "../api";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


export function SendRequestButton() {
    const groupId = "674d5f6069ebe36c9ed63429"; //Cooked

    const [requestData, setRequestData] = useState({
        recipientUserId: "674fa4578d450f3f2cc7486d", //Steffi
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
            alert(response.data.message); // Display success message
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred"); // Handle errors
        }
    };

    return (
        <button onClick={sendRequest}>
            Send Request to Steffi
        </button>
    );
}
