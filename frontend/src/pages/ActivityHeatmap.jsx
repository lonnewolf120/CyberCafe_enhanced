import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import './ActivityHeatmap.css';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { useSelector } from "react-redux";

import { pieChartData, lineChartData } from './ActivityData.js';
import { Chart as ChartJS, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, LineElement, PointElement, Title } from 'chart.js';  

ChartJS.register(Tooltip, Legend, ArcElement, CategoryScale, LinearScale, LineElement, PointElement, Title);

const ActivityHeatmap = () => {
    const { user } = useSelector((state) => state.profile);

    // useEffect(() => {
    //     axios.get('http://localhost:5000/ActivityHeatmap/username')
    //         .then(response => {
    //             setUsername(response.data.FIRST_NAME);
    //             setActualName(response.data.LAST_NAME);
    //         })
    //         .catch(error => {
    //             console.error("error fetching", error);
    //         });
    // }, []);

    return (
        <div>
            <div className="Box">
              <div className="Box1">
                <div className="SubBox1">
                    <div className="contain">
                        <div className="profile-box">
                            <img src="./images/profile-pic.png" className="profile-pic" alt="" />
                        </div>
                    </div>
                    <div className="u-name">
                        <p>{user.FIRST_NAME}</p>
                        <p className='a-name'>{user.FIRST_NAME} {user.LAST_NAME}</p>
                    </div>

                    <div className="p-info">
                        <div className="profile-info">
                            <p>Rating </p>
                            <p>Rank </p>
                            <p>Contests </p>
                        </div>

                        <div className="p-data">
                            <p className="profile-data">20 </p>
                            <p className="profile-data">32 </p>
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
                        <div className="chart-container">
                            <Pie data={pieChartData} />
                        </div>
                    </div>


                    
                </div>
            </div>
            <div className="Heatmapbox">
                <Timeline />
            </div>
            
            </div>
        </div>
    );
};
function Cell(){
    return (
        <div className="timeline-cell"></div>
    );
}

//TODO: fetch MCSC.Submisssions

function Timeline(){
    let cells = Array.from(new Array(364));
    return (
        <div className="timeline">
            {cells.map((_,index)=> <Cell key={index} />)}
        </div>
    );
}

export default ActivityHeatmap;
