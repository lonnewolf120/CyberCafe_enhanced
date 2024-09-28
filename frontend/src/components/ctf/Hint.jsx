import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import ChallengeCard from '../components/ChallengeCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';


const ChallengesPage = ({challenges}) => {
  const [showHint, setShowHint] = useState(false);

  return (

    <div className="landing-page">

    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter something..."
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setShowHint(true)}
      >
        Show Hint
      </button>
      {showHint && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-gray-700">Hint: This is your hint text!</p>
        </div>
      )}
    </div>
  </div>

    
  );
};

export default ChallengesPage;
