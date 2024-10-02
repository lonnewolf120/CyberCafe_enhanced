import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './contests.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import toast from 'react-hot-toast';
import ContestSearch from '../../components/common/ContestSearch';

// const BASE_URL = import.meta.env.VITE_APP_API_URL;
const BASE_URL = "http://localhost:5000/api/v1";

const formatDate = (dateString) => {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const ContestCard = ({ title, contestID, starttime, endtime }) => {
    const formattedStartTime = formatDate(starttime);
    const formattedEndTime = formatDate(endtime);

    const randomColor = () => {
        const colors = ['red', 'blue', 'green', 'caribbeangreen', 'orange', 'purple'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    return (
        <div className={`card  shadow-md rounded-lg flex flex-col items-center p-4 bg-${randomColor()}`}>
            <div className="card-body text-center">
                <h5 className="card-title text-xl font-bold">{title}</h5>
                <p className="text-caribbeangreen-300">Starts: {formattedStartTime}</p>
                <p className="text-caribbeangreen-300">Ends: {formattedEndTime}</p>
                <Link to={`/challenges/${contestID}`}>
                    <button className={`solutions-button bg-${randomColor()} hover:bg-${randomColor()} text-white font-bold py-2 px-4 rounded mt-4`}>
                        Enter Contest
                    </button>
                </Link>
            </div>
        </div>
    );
};

const Contests = () => {
    const [pastContests, setPastContests] = useState([]);
    const { token } = useSelector((state) => state.auth);
    
    const { user } = useSelector((state) => state.profile);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get(BASE_URL+`/contest/all-contests`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }); 
                console.log('Contests API Response:', response.data); 
                setPastContests(response.data); // Set only past contests
            } catch (error) {
                console.error('Error fetching contests:', error.response.data);
                toast.error(`Login again to continue, ${error.response.data.message}`);
                // toast.error();
            }
        };

        fetchContests();
    }, []);

    return (
        <div className="container mx-auto p-5">
            {(user.ACCOUNT_TYPE === 'Instructor' ||user.ACCOUNT_TYPE === 'Admin') && (
                <div className="flex justify-center">
                    
                    <ContestSearch className=""/>
                    <Link to={`/add-contest`}>
                        <Button className="add-contest-button m-5">Add Contest</Button>
                    </Link>
                    
                </div>
            )}

            {/* <h1 className="header">Past Contests</h1> */}

            <div className="challenges">
                <div className="section">
                    {/* <h2 className="section-title">Past Contests</h2> */}
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
                        {pastContests.map(contest => (
                            <ContestCard 
                                key={contest.CONTESTID} 
                                contestID={contest.CONTESTID} 
                                title={contest.CONTESTNAME}
                                starttime={contest.STARTTIME}
                                endtime={contest.ENDTIME} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contests;
