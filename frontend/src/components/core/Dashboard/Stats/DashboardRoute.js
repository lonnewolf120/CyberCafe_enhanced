import express from 'express';
import { connection } from '../database/database.js';
const router = express.Router();


router.get('/submissions/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
      const db = await connection();
      const query = `
      SELECT TO_CHAR(TO_DATE(submission_time, 'YYYY-MM-DD HH24:MI:SS'), 'YYYY-MM-DD') as submission_date, COUNT(*) as submission_count
      FROM MCSC.SUBMISSION
      WHERE user_id = :userId
      GROUP BY TO_CHAR(TO_DATE(submission_time, 'YYYY-MM-DD HH24:MI:SS'), 'YYYY-MM-DD')
      ORDER BY submission_date
  `;
  
      const result = await db.execute(query, [userId]);

      if (result.rows.length > 0) {
        /* console.log("SUBMISSIONS: ", result.rows);
          const submissionData = result.rows.reduce((acc, row) => {
              acc[row[0]] = row[1];
              return acc;
          }, {}); */
          console.log(result.rows);
          return res.status(200).json(result.rows);
          
      } else {
          return res.status(404).json({ error: 'No submissions found for this user' });
      }
  } catch (error) {
      console.error("Error fetching submissions", error);
      return res.status(500).json({ error: 'Server error' });
  }
});





  export default router;
  