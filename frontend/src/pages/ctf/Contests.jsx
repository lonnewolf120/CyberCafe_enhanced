/*  import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './contests.css';
import { Link } from 'react-router-dom';

const ContestCard = ({ title }) => (
    <div className="card">
        <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <Link to="/challenges">
                <Button className="solutions-button">View Details</Button>
            </Link>
        </div>
    </div>
);

const Contests = () => {
    const [runningContests, setRunningContests] = useState([]);
    const [upcomingContests, setUpcomingContests] = useState([]);
    const [pastContests, setPastContests] = useState([]);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/contests');
                console.log('API Response:', response.data); // Log API response
                setRunningContests(response.data.running || []);
                setUpcomingContests(response.data.upcoming || []);
                setPastContests(response.data.past || []);
            } catch (error) {
                console.error('Error fetching contests:', error);
            }
        };

        fetchContests();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="header">Contests</h1>

            <div className="challenges">
                <div className="section">
                    <h2 className="section-title">Running</h2>
                    <div className="contest-list">
                        {runningContests.map(contest => (
                            <ContestCard key={contest.contestID} title={contest.CONTESTNAME} />
                        ))}
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">Upcoming</h2>
                    <div className="contest-list">
                        {upcomingContests.map(contest => (
                            <ContestCard key={contest.contestID} title={contest.CONTESTNAME} />
                        ))}
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">Past</h2>
                    <div className="contest-list">
                        {pastContests.map(contest => (
                            <ContestCard key={contest.contestID} title={contest.CONTESTNAME} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contests;
  */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './contests.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';

const ContestCard = ({ title, contestID }) => (
    <div className="card">
        <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <Link to={`/challenges/${contestID}`}>
                <Button className="solutions-button">Enter Contest</Button>
            </Link>
        </div>
    </div>
);

const Contests = () => {
    const [pastContests, setPastContests] = useState([]);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/contest/all-contests', {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }); 
                console.log('Contests API Response:', response.data); 
                setPastContests(response.data); // Set only past contests
            } catch (error) {
                console.error('Error fetching contests:', error);
            }
        };

        fetchContests();
    }, []);

    return (
        <div >
             <div className="flex justify-center">

             <Link to={`/add-contest`}>
            <Button className="solutions-button" >Add Contest</Button>
            </Link>
            </div>
            <h1 className="header"></h1> {/* //past contest */}

            <div className="challenges">
                <div className="section">
                    <h2 className="section-title"></h2>
                    <div className="contest-list">
                        {pastContests.map(contest => (
                            <ContestCard key={contest.CONTESTID} contestID={contest.CONTESTID} title={contest.CONTESTNAME} />
                        ))}
                    </div>
                </div>
            </div>

           
            
        </div>
       
    );
};

export default Contests;    