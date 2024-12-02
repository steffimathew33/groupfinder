import axios from "axios";
import { sendGroupRequest } from "../api";

export function SendRequestButton() {
    const groupId = "674d5f6069ebe36c9ed63429"; //Cooked

    const requestData = {
        recipientUserId: "674d279f6cd14f104827aa7c", //Katie
        senderId: "6749603b420371d055201b3a" //Nathan
    }


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
            Send Request to User
        </button>
    );
}
