import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Leaderboard.css";

const Leaderboard = () => {
  const cid = useParams().cid;
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    // let isMounted = true; // Note this flag denote mount status
    const fetchData = async (cid) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/contest/leaderboard/${cid}`
        );
        const data = await response.json();
        console.log("Leaderboard Data:", data);
        setRankingData(data); // Add this condition
      } catch (error) {
        console.error("Error fetching leaderboard data:", error); // Add this condition
      }
    };

    fetchData(cid);

  }, []); // Ensure cid is a dependency of useEffect

  return (
    <div className="ranking-table p-15 ">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Score</th>
            {/* <th>Penalty</th>
            <th>A</th>
            <th>B</th>
            <th>C</th>
            <th>D</th> */}
          </tr>
        </thead>
        <tbody>
          {rankingData.map((team, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{team.FIRST_NAME} {team.LAST_NAME}</td>
              {/* <td>{team.IMAGE}</td> */}
              <td>{team.TOTAL_POINTS}</td>
              {/* <td>{team.penalty}</td> */}
              {/* {team.challenges.map((challenge, idx) => (
                <td key={idx}>
                  {challenge.time} ({challenge.penalty})
                </td>
              ))} */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
