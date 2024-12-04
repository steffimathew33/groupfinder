import './Profile.css';
import React, { useState, useEffect } from "react";
import { getUser } from "../api";
import { useParams } from 'react-router-dom';

export function OtherUserProfile() {
    const {id} = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const data = await getUser(id);
                setUserData(data);
            } catch (err) {
                setError("Failed to fetch user data");
                console.error(err);
            }
        }
        fetchUserData();
    }, []);

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
