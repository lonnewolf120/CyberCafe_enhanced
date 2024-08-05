// TODO: Change the following as per your requirements
const userName = 'SYS as SYSDBA';
const express = require("express");


const dbConfig = {
    user: "MCSC",
    password: "MCSC",  
    connectString: "localhost:1521/FREEPDB1"
};

const THUMBNAILS = [
    "/hacking.png",
    "/hacking.jpg",
    "/hacking.jpeg",
    "code.jpeg",
    "programming.png",
]

const PORT = 10000; // Example value, replace with your actual port number if needed

module.exports = {
    express,
    dbConfig,
    PORT,
    userName
};
