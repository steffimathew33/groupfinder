import './Profile.css';
import React, { useState, useEffect } from "react";
import { getUser } from "../api"; 
import { updateUser } from "../api"
import { jwtDecode } from "jwt-decode";

export function Profile() {
    const [userData, setUserData] = useState(null); // local user data
    const [error, setError] = useState(null); 
    const [view1, setView1] = useState(0); // toggle between profile and edit profile view
    const [originalData, setOriginalData] = useState(null); // to store original data fetched from mongoDB

    let userId = "";

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
                setOriginalData(data); 
            } catch (err) {
                setError("Failed to fetch user data");
                console.error(err); // Log error for debugging
            }
        }
        loadUserData();
        fetchUserData();
    }, []); // Empty dependency array means this runs once when the component mounts

    // Handle error
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Handle loading state
    if (!userData) {
        return <div>Loading...</div>;
    }

    // Function to handle saving updated data (for now, this is a placeholder)
    const handleSave = () => {
        // Logic to save the updated user data
        // console.log("Saving updated user data:", userData);
        updateUser(userData._id, userData); // updates info in database
        setView1(0); // Return to profile view after saving
    };

    // Function to handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value }); // updates userData, not database
    };

    const handleCancel = () => {
        setUserData(originalData); // Reset userData to the original data
        setView1(0); // Return to profile view
    };


    

    

    return (
        <>
            {/* If the view is 0, show the profile page, else show the Edit Profile form */}
            {!view1 ? (
                <div className="profile-container">
                    <div className = "profile-title">
                    <h1><br /><br />Profile Page</h1>
                    </div>
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
                            Bio:<br></br>
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
                            <button type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
