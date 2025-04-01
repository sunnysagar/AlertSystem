import React, { useState, useEffect } from "react";
import "../styles/UserProfile.css"; // Import CSS file for styling
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const UserProfile = () => {
  const { token } = useAuth();
  const [userDetails, setUserDetails] = useState({
    name: "",
    department: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user details from the backend
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://127.0.0.1:8000/users/profile",
        userDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="user-profile-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={userDetails.name}
          onChange={handleInputChange}
          disabled={!isEditing}
        />

        <label>Department:</label>
        <input
          type="text"
          name="department"
          value={userDetails.department}
          onChange={handleInputChange}
          disabled={!isEditing}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange}
          disabled={!isEditing}
        />

        <div className="profile-actions">
          {isEditing ? (
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Update Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
