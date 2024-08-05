import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChallengeCard from "../../components/ctf/ChallengeCard.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Leaderboard.css";
import { useSelector } from "react-redux";

const ChallengesPage = () => {
  const { contestID } = useParams();
  const [challenges, setChallenges] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
 
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/contest/${contestID}/challenges`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChallenges(response.data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchChallenges();
  }, [contestID]);

  return (
    <div className="landing-page">
      <h2 className="header">All challenges</h2>
      {/* <h2 className="header">Contest Categories</h2> 
      TODO: add contest categories to database and fetch here
      */}
      <div className="challenges">
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={index}
            title={challenge.C_TITLE}
            description={challenge.C_CONTENT}
            real_flag={challenge.FLAG}
            cid={challenge.CID}
            user_id={user.USER_ID}
            contestId={contestID}
          />
        ))}
      </div>
      <Link to={`/leaderboard/${contestID}`} className="solutions-link">
        <button className="solutions-button">Leaderboard</button>
      </Link>
    </div>
  );
};

export default ChallengesPage;
