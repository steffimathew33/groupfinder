import React, { useState, useEffect } from "react";
import { leaveGroup } from "../api";
import { jwtDecode } from "jwt-decode";

export function LeaveGroupButton() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);  // To manage the loading state
  const [error, setError] = useState(null);  // To handle errors
  
  async function handleLeaveGroup() {
    setLoading(true);
    setError(null);

    try {
      const response = await leaveGroup(userData._id, userData.inGroup);
      if (response.status === 200) {
        alert("You have successfully left the group.");
      }
    } catch (error) {
      setError(error.message);  // Set error message if the API call fails
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  useEffect(() => {
    async function loadUserData() {
        try {
            const token = sessionStorage.getItem("User");
            if (token) {
                const decodedUser = jwtDecode(token);
                setUserData(decodedUser);
            }
        } catch {
            alert("FUCK IN LEAVE GROUP");
        }
    }
    loadUserData();
  }, []);
    

  return (
    <div>
      <button
        onClick={handleLeaveGroup}
        disabled={loading}  // Disable button while loading
        className="btn btn-danger"
      >
        {loading ? "Leaving..." : "Leave Group"}
      </button>

      {error && <div className="error-message">{error}</div>} {/* Display error message */}
    </div>
  );
};

export default LeaveGroupButton;
