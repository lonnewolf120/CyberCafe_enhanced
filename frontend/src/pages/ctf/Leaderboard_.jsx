import React from 'react';
import './leaderboard.css'; 

import rankingData from './data';

const solutions = () => {
  return (
    <div className="ranking-table">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Score</th>
            <th>Penalty</th>
            <th>A</th>
            <th>B</th>
            <th>C</th>
            <th>D</th>
          </tr>
        </thead>
        <tbody>
          {rankingData.map((team, index) => (
            <tr key={index}>
              <td>{team.rank}</td>
              <td>{team.team}</td>
              <td>{team.score}</td>
              <td>{team.penalty}</td>
              {team.challenges.map((challenge, idx) => (
                <td key={idx}>
                  {challenge.time} ({challenge.penalty})
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default solutions;
