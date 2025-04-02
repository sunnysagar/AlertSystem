import React, { useState, useEffect } from "react";
import "../styles/Feedback.css";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Feedback = () => {
  const { token } = useAuth();
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbacks, setShowFeedbacks] = useState(false);
  const [error, setError] = useState(null);

  // Fetch previous feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/feedbacks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setError("Failed to fetch feedbacks.");
      }
    };

    if (showFeedbacks) {
      fetchFeedbacks();
    }
  }, [showFeedbacks, token]);

  // Submit new feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/feedbacks", // Ensure this matches your backend route
        { feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Feedback submitted successfully!");
      setFeedback(""); // Clear the feedback box
      setShowFeedbacks(false); // Refresh feedbacks after submission
    } catch (error) {
      if (error.response) {
        console.error("Error submitting feedback:", error.response.data);
        setError(`Failed to submit feedback: ${error.response.data.message || "Unknown error"}`);
      } else {
        console.error("Error submitting feedback:", error.message);
        setError("Failed to submit feedback.");
      }
    }
  };

  return (
    <div className="feedback-container">
      <h2>Feedback</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Feedback Submission Box */}
      <div className="feedback-box">
        <textarea
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Toggle Button to View Feedbacks */}
      <button
        className="toggle-feedbacks-btn"
        onClick={() => setShowFeedbacks(!showFeedbacks)}
      >
        {showFeedbacks ? "Hide Feedbacks" : "View Feedbacks"}
      </button>

      {/* Display Previous Feedbacks */}
      {showFeedbacks && (
        <div className="feedback-list">
          {feedbacks.length > 0 ? (
            feedbacks.map((fb) => (
              <div key={fb._id} className="feedback-item">
                <p className="feedback-text">"{fb.feedback}"</p>
                <p className="feedback-meta">
                  - {fb.user.name}, {new Date(fb.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No feedbacks available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Feedback;
