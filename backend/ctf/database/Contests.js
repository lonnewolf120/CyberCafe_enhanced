import express from 'express';
import { connection } from './database'; 

const app = express();

app.get('/contests', async (req, res) => {
    try {
        const db = await connection(); 

        const currentDate = new Date().toISOString().split('T')[0]; 

        const runningQuery = "SELECT contestID, contestName FROM MCSC.Contest ) ";
        const upcomingQuery = "SELECT contestID, contestName FROM MCSC.Contest )";
        const pastQuery = "SELECT contestID, contestName FROM MCSC.Contest WHERE )";

        const [runningContests, upcomingContests, pastContests] = await Promise.all([
            db.execute(runningQuery, [currentDate]),
            db.execute(upcomingQuery, [currentDate]),
            db.execute(pastQuery, [currentDate]),
        ]);

        res.json({
            running: runningContests.rows,
            upcoming: upcomingContests.rows,
            past: pastContests.rows,
        });
    } catch (error) {
        console.error("Error fetching contests:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
