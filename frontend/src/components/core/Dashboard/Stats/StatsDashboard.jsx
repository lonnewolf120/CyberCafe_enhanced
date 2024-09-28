 import React, { useState, useEffect } from 'react';


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
               
                const days_ = response?.data;
                console.log("Submission data", days_);
                const days = days_?.map(submission => {
                    let dayData = datetodayyear(submission.SUBMISSION_DATE, submission.SUBMISSION_COUNT);
                    if (isNaN(dayData.dayOfYear)) {
                        dayData.dayOfYear = Math.floor(Math.random() * 365) + 1; // Random value between 1 and 365
                    }
                    return dayData;
                });
                  
                
                setActivedays(days);
                console.log("Submission data", days);
            })
            .catch(error => {
                console.error("Error fetching submission data", error);
            });
    }, []);

    function datetodayyear(datestring, submissionCount) {
        if (!datestring) return null; 
        const date = new Date(datestring);
        const startOfYear = new Date(date.getFullYear(), 0, 0);
        const diff = date - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return { dayOfYear, submissionCount };
    }


 

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
                <Timeline  days={364} activedays={activedays}/>

            </div>

            </div>
        </div>
    );
};


function datetodayyear(datestring) {
    if (!datestring) return null; 
    const date = new Date(datestring);
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }
  
  const SUBMISSIONS = [
    { SUBMISSION_DATE: '2024-07-06', SUBMISSION_COUNT: 4 },
    { SUBMISSION_DATE: '2024-05-06', SUBMISSION_COUNT: 3 },
    { SUBMISSION_DATE: '2024-06-06', SUBMISSION_COUNT: 3 },
    { SUBMISSION_DATE: '2024-03-06', SUBMISSION_COUNT: 3 }
  ];
  
  /* const activedays = submissionData.map(submission => 
    datetodayyear(submission.SUBMISSION_DATE)
  ); */
  
/*  console.log(activedays);  */
  
/* const activedays = SUBMISSIONS.map(submission => 
    datetodayyear(submission.SUBMISSION_DATE)
  );


  console.log(activedays); */

  

function Cell({ submissionCount }) {
 /*    const cellStyle = {
        backgroundColor: highlight ? 'green' : 'grey',
    };

    return (
        <div className="timeline-cell" style={cellStyle}></div>
    ); */

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

function Timeline({ days, activedays }) {
    let cells = Array.from(new Array(days));
    let weeks = Array.from(new Array(7));
    let months = Array.from(new Array(12));

    return (
        <div>
        <div className="timeline-months ">
                {months.map((_, index) => <Months key={index} index={index} />)}
            </div>
        <div className="timeline">
            
            <div className="timeline-body">
                <div className="timeline-weeks">
                    {weeks.map((_, index) => <Week key={index} index={index} />)}
                </div>
                <div className="timeline-cells">
                    {cells.map((_, index) => {
                        const dayData = activedays.find(day => day.dayOfYear === index);
                        const submissionCount = dayData ? dayData.submissionCount : 0;
                        return <Cell key={index} submissionCount={submissionCount} />;
                    })}
                </div>
            </div>
        </div>
        </div>
    );
}
export default StatsDashboard;

