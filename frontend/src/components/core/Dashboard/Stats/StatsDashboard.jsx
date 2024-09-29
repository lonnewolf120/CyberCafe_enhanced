 import React, { useState, useEffect } from 'react';

 import { Modal } from 'flowbite-react';
 

import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import './StatsDashboard.css';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { useSelector } from "react-redux";
import Img from './../../../common/Img';

import { pieChartData, lineChartData } from './data1.js';
import { Chart as ChartJS, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, LineElement, PointElement, Title } from 'chart.js';  

ChartJS.register(Tooltip, Legend, ArcElement, CategoryScale, LinearScale, LineElement, PointElement, Title);

const StatsDashboard = () => {
    // const [username, setUsername] = useState(''); 
    const [actualName, setActualName] = useState(''); 
    const [resp, setResponseData] = useState([]);
    const [activedays, setActivedays] = useState([]);
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
            axios.get(`http://localhost:5000/api/v1/contest/submissions/${user.USER_ID}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }) 
            .then(response => {
                setResponseData(response?.data);
                const days_ = response?.data;
                console.log("Submission data", days_);
                let daysArr=[];
                days_?.map(submission => {
                    let day=0;
                    day += parseInt(submission?.SUBMISSION_DATE.slice(0,2)) * parseInt(submission?.SUBMISSION_DATE.slice(3,5));
                    
                    daysArr.push({
                        dayOfYear: day,
                        submissionCount: submission?.SUBMISSION_COUNT,
                        wholeDay: submission?.SUBMISSION_DATE
                                        });

                });
                setActivedays(daysArr);

                console.log("Submission data 2:", daysArr);
            })
            .catch(error => {
                console.error("Error fetching submission data", error);
            });
    }, []);

 

    return (
        <div>
            <div className="Box">
              <div className="Box1">
                <div className="SubBox1">
                    <div className="contain">
                        <div className="profile-box">
                        <Img
                            src={user?.IMAGE}
                            alt={`profile-${user?.FIRST_NAME}`}
                            className="aspect-square w-[78px] rounded-full object-cover"
                        />
                        </div>
                    </div>
                    <div className="u-name">
                        <p>{user?.FIRST_NAME}</p>
                        <p className='a-name'>{user?.FULLNAME}</p>
                    </div>

                    <div className="p-info">
                        <div className="profile-info">
                            <p>Rating </p>
                            <p>Contests </p>
                        </div>

                        <div className="p-data">
                            <p className="profile-data">{user?.RATING || 150} </p>
                            <p className='profile-data'>45 </p>
                        </div>
                    </div>
                </div>
                
                <div className="SubBox2">
                    <div className="SubBox3">
                        <Line data={lineChartData} />
                        
                    </div>
                    <div className="SubBox4">
                        <div className="chart-container">
                            <Pie data={pieChartData} />
                        </div>
                    </div>


                    
                </div>
            </div>

            <div className="Heatmapbox">
                <Timeline  days={364} activedays={activedays} responseData={resp}/>

            </div>

            </div>
        </div>
    );
};

function Cell({ ind, submissionCount }) {

    const getColor = (count) => {
        if (count === 0) {
            return 'grey'; 
        }
        
        const maxIntensity = 255;
        const minIntensity = 80;
        const intensity = Math.max(minIntensity, maxIntensity - count*50) ; 
        return `rgb(0, ${intensity}, 0)`; 
    };

    const cellStyle = {
        backgroundColor: getColor(submissionCount),
    };

    return (
        <div className="timeline-cell" style={cellStyle}></div>
    );
}


function Months({index}) {
    return (
        <div className="timeline-months-month text-white">
            {Monthnames[index]}
        </div>
    );
}

const Daynames = {
    1: "Mon",
    3: "Wed",
    5: "Fri"
}

const Monthnames = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec"

}

function Week({index}) {

    return (
        <div className="timeline-weeks-week"> {Daynames[index]} </div>
    );
}
function Timeline({ days, activedays, responseData }) {
    const [hoveredCell, setHoveredCell] = useState(null);
    const [hovereddate, setHoverDate] = useState(null);

    let cells = Array.from(new Array(days));
    let weeks = Array.from(new Array(7));
    let months = Array.from(new Array(12));

    const handleMouseEnter = (index) => {
        const dayData = activedays.find(day => day.dayOfYear === index);
        if (dayData) {
            setHoveredCell(dayData);
            setHoverDate(dayData.wholeDay);
        }

        setTimeout(() => {
            setHoveredCell(null);
        }, 1000);
     };

    const handleMouseLeave = () => {
        setHoveredCell(null);
    };

    return (
        <div>
            <div className="timeline-months">
                {months.map((_, index) => <Months key={index} index={index} />)}
            </div>
            <div className="timeline-body"></div>
                <div className="timeline-body">
                    <div className="timeline-weeks">
                        {weeks.map((_, index) => <Week key={index} index={index} />)}
                    </div>
                    <div className="timeline-cells">
                        {cells.map((_, index) => {
                            const dayData = activedays.find(day => day.dayOfYear === index);
                            const submissionCount = dayData ? dayData.submissionCount : 0;
                            return (
                                <button
                                    key={index}
                                    onClick={(e) => {e.preventDefault(); handleMouseEnter(index)}}
                                >
                                    <Cell ind={index} submissionCount={submissionCount} />
                                </button>
                            );
                        })}
                    </div>
                </div>
                {hoveredCell && (
                <Modal show={true} onClose={handleMouseLeave}>
                    <Modal.Header>
                        Submission Details
                    </Modal.Header>
                    <Modal.Body>
                        <p>Submission Date: {hovereddate}</p>
                        <p>Submission Count: {hoveredCell.submissionCount}</p>
                    </Modal.Body>
                </Modal>)}
            </div>
            
        );
                
}
export default StatsDashboard;

