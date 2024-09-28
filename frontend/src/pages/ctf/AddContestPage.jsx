import React, { useState } from "react";
import axios from "axios";
import "./AddContestPage.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const AddContestPage = () => {
  const [contestName, setContestName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [challenges, setChallenges] = useState([
    { c_point: "", c_title: "", c_content: "", flag: "" , hintCost:0, hintContent:""},
  ]);

  const { token } = useSelector((state) => state.auth);

  const handleChallengeChange = (index, e) => {
    const { name, value } = e.target;
    const newChallenges = [...challenges];
    newChallenges[index][name] = value;
    setChallenges(newChallenges);
  };

  const addChallenge = () => {
    setChallenges([
      ...challenges,
      { c_point: "", c_title: "", c_content: "", flag: "", hintCost:0, hintContent:""},
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/v1/contest/add-contest",
        {
          contestName,
          startTime,
          endTime,
          challenges,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Contest and challenges added successfully");
    } catch (error) {
      console.error("Error adding contest:", error);
      toast.error("Failed to add contest");
    }
  };

  return (
    <div className="add-contest-page">
      <h1>Add Contest and Challenges</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Contest Name:</label>
          <input
            type="text"
            value={contestName}
            onChange={(e) => setContestName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="challenges">
          {challenges.map((challenge, index) => (
            <div key={index} className="challenge-form">
              <h3>Challenge {index + 1}</h3>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="c_title"
                  value={challenge.c_title}
                  onChange={(e) => handleChallengeChange(index, e)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content:</label>
                <textarea
                  name="c_content"
                  value={challenge.c_content}
                  onChange={(e) => handleChallengeChange(index, e)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Points:</label>
                <input
                  type="number"
                  name="c_point"
                  value={challenge.c_point}
                  onChange={(e) => handleChallengeChange(index, e)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Flag:</label>
                <input
                  type="text"
                  name="flag"
                  value={challenge.flag}
                  onChange={(e) => handleChallengeChange(index, e)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hint Content:</label>
                <input
                  type="text"
                  name="hintContent"
                  value={challenge.hintContent}
                  onChange={(e) => handleChallengeChange(index, e)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hint Cost:</label>
                <input
                  type="text"
                  name="hintCost"
                  value={challenge.hintCost}
                  onChange={(e) => handleChallengeChange(index, e)}
                  required
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addChallenge} className="add-challenge-btn">
            Add Another Challenge
          </button>
        </div>
        <div className="submit-btn-container">
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddContestPage;
