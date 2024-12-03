import './Profile.css';
import React, { useState, useEffect } from "react";
import { getUser } from "../api"; 
import { jwtDecode } from "jwt-decode";
import { CreateUser } from "../components/CreateUser";

export function Profile() {
    const [userData, setUserData] = useState(null); // To store the fetched user data
    const [error, setError] = useState(null); // To handle any errors
    const [view1, setView1] = useState(0); // To toggle between views

    let userId = ""; // User ID from session

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
        fetchUserData(); // Call function to fetch user data
    }, []); // Empty dependency array means this runs once when the component mounts

    // Handle error
    if (error) {
        return <div>Error: {error}</div>; // Show error if fetching fails
    }

    // Handle loading state
    if (!userData) {
        return <div>Loading...</div>; // Show loading message while data is being fetched
    }

    // Function to handle saving updated data (for now, this is a placeholder)
    const handleSave = () => {
        // Logic to save the updated user data
        console.log("Saving updated user data:", userData);
        setView1(0); // Return to profile view after saving
    };

    // Function to handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };

    return (
        <>
            {/* If the view is 0, show the profile page, else show the Edit Profile form */}
            {!view1 ? (
                <div className="profile-container">
                    <h1><br /><br />Profile Page</h1>
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
                    <div className="edit-profile-button">
                        <button onClick={() => setView1(1)}>Edit Profile</button>
                    </div>
                </div>
            ) : (
                <div className="edit-profile-container">
                    <h1>Edit Profile</h1>
                    <form className="edit-profile-form">
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={userData.firstName || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={userData.lastName || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={userData.email || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Major:
                            <input
                                type="text"
                                name="major"
                                value={userData.major || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Graduation Year:
                            <input
                                type="number"
                                name="gradYear"
                                value={userData.gradYear || ""}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Bio:
                            <textarea
                                name="bio"
                                value={userData.bio || ""}
                                onChange={handleChange}
                            ></textarea>
                        </label>
                        <div className="edit-profile-buttons">
                            <button type="button" onClick={handleSave}>
                                Save
                            </button>
                            <button type="button" onClick={() => setView1(0)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
