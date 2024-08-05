import express from 'express';
import {connection} from '../database/database.js'
const router = express.Router();


router.get("/leaderboard", async (req,res) => {
    const db  = await connection();
    const query ='';
    const result = await db.execute(query);

    if(result)
    {
        console.log("leaderbaord : ", result.rows);
        return res.status(200).send(result.rows);

    } else {
        return res.status(400).send({error :"Couldn't find the leaderboard"});


    }



});