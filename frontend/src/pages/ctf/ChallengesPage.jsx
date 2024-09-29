import React, { useEffect, useState } from "react";
import CTAButton from "../../components/core/HomePage/Button.jsx";
import { FaArrowRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import ChallengeCard from "../../components/ctf/ChallengeCard.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Leaderboard.css";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ChallengesPage = () => {
  const { contestID } = useParams();
  const [challenges, setChallenges] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [isHost, setIsHost] = useState(false);
 
  useEffect(() => {
    setIsHost(user?.host_info?.some(item => item.HOSTEDCONTEST === Number(contestID)));
    if(user.ACCOUNT_TYPE === 'Admin') toast.success("You are an admin, so you can add challenges");
    isHost && toast.success("You are the host of this contest");
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
      <div className="flex flex-row items-center justify-center p-2 m-2">
        {/* TODO: add HOSTOF value to user value, which will be fetched from HOST table */}
      { (user.ACCOUNT_TYPE === 'Admin' || (user?.host_info && isHost) )
      && (<div className="p-2">
      <CTAButton active={true} linkto={`/challenges/${contestID}/add-challenge`}>
        <div className='flex flex-row gap-2 items-center'>
          Add Challenges
          <FaArrowRight />
        </div>
      </CTAButton>
      </div>)}
      <div className="p-2">
      <CTAButton active={true} linkto={`/leaderboard/${contestID}`}>
        <div className='flex flex-row solutions-link gap-2 items-center '>
          Leaderboard
          <FaArrowRight />
        </div>
      </CTAButton>
      </div>
      {/* <Link to={`/leaderboard/${contestID}`} className="solutions-link p-2">
        <button className="solutions-button">Leaderboard</button>
      </Link> */}
      </div>
      {console.log("Challenges: ", challenges)}
      <div className="challenges">
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={index}
            challenge={challenge}
            user = {user}
          />
        ))}
      </div>
    </div>
  );
};

export default ChallengesPage;
