import './Profile.css';
import React, { useState, useEffect } from "react";
import { getUser } from "../api"; // Ensure the path is correct to your api.js
import { jwtDecode } from "jwt-decode";

export function Profile() {
    const [userData, setUserData] = useState(null); // To store the fetched user data
    const [error, setError] = useState(null); // To handle any errors

    let userId = ""; // Steffi Mathew's user ID from the MongoDB screenshot

    useEffect(() => {
        async function loadUserData() {
            const token = sessionStorage.getItem("User");
            if (token) {
                const decodedUser = jwtDecode(token);
                userId = decodedUser._id;
            }
        }
        async function fetchUserData() {
            try {
                const data = await getUser(userId); // Get user data by ID
                console.log(data); // Log for debugging
                setUserData(data); // Set the fetched data
            } catch (err) {
                setError("Failed to fetch user data");
                console.error(err); // Log error for debugging
            }
        }
        loadUserData();
        fetchUserData();
    }, []); // Empty dependency array means this runs once when the component mounts

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>Profile Page</h1>
            <div className="profile-details">
                <img
                    src={userData.profilePicture || "/default-profile.png"} // Fallback if profilePicture is null
                    alt={`${userData.firstName} ${userData.lastName}'s profile`}
                    className="profile-image"
                />
                <h2>{`${userData.firstName} ${userData.lastName}`}</h2>
                <p>Email: {userData.email}</p>
                <p>Major: {userData.major}</p>
                <p>Graduation Year: {userData.gradYear}</p>
                <p>Bio: {userData.bio || "No bio available"}</p>
                <p>Signup Date: {new Date(userData.signupDate).toLocaleDateString()}</p>
            </div>
        </div>
    );
}
