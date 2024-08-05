const { connection } = require('../database/database');

exports.submit = async (req, res) => {
    const { submissionID, cid, user_id, status } = req.body;
  
    if (!submissionID || !cid || !user_id || !status) {
      return res.status(400).send({ error: 'Missing required fields' });
    }
    console.log('Submission:', req.body);
    try {
      const db = await connection();
      const query = `
        INSERT INTO MCSC.SUBMISSION (submissionID, cid, user_id, status)
        VALUES (:submissionID, :cid, :user_id, :status)
      `;
      const result = await db.execute(query, [submissionID, cid, user_id, status]);
      console.log("Inserted into submission, result:", result);
      
      await db.commit();
  
      if (result.rowsAffected) {
        return res.status(200).send({ message: 'Submission successful' });
      } else {
        return res.status(400).send({ error: 'Failed to insert submission' });
      }
    } catch (error) {
      console.error('Error inserting submission:', error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  };


  exports.allcontests = async (req, res) => {
    const db = await connection();
    const query = 'SELECT * FROM MCSC.CONTEST';
    const result = await db.execute(query);
  
    if (result) {
        console.log("ALL CONTESTS: ", result.rows);
        return res.status(200).send(result.rows);
    } else {
        return res.status(400).send({ error: "Couldn't find" });
    }
  
  };


  exports.challenges = async (req, res) => {
    const { contestID } = req.params;
  
    try {
        const db = await connection();
        const query = 'SELECT * FROM MCSC.CHALLENGES WHERE CONTESTID = :contestID';
       const result = await db.execute(query, [contestID]);
      // const query = 'SELECT * FROM MCSC.CHALLENGES';
       //const result = await db.execute(query);
        if (result && result.rows) {
            console.log(`Challenges for contestID ${contestID}: `, result.rows);
            return res.status(200).send(result.rows);
        } else {
            return res.status(400).send({ error: `Couldn't find challenges for contestID ${contestID}` });
        }
    } catch (error) {
        console.error(`Error fetching challenges for contestID ${contestID}:`, error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
  };

  exports.addContest = async (req, res) => {
    const { contestName, startTime, endTime, challenges } = req.body;
    console.log("FROM ADD CONTEST", req.body);
   
    console.log('Contest:', contestName);
    
  
    if (!contestName || !startTime || !endTime || !challenges) {
      return res.status(400).send({ error: 'Missing required fields' });
    }
  

  
    try {
      const db = await connection();
      // console.log("");
      const insertContestQuery = `INSERT INTO MCSC.CONTEST (CONTESTNAME, STARTTIME, ENDTIME)
                                  VALUES (:contestName, TO_TIMESTAMP(:startTime, 'YYYY-MM-DD"T"HH24:MI'), TO_TIMESTAMP(:endTime, 'YYYY-MM-DD"T"HH24:MI'))`;
      await db.execute(insertContestQuery, {
        contestName,
        startTime,
        endTime
      }, { autoCommit: true });
  
      const contestIDResult = await db.execute(
        `SELECT CONTESTID FROM MCSC.CONTEST WHERE CONTESTNAME = :contestName`,
        { contestName }
      );
      const contestID = contestIDResult.rows[0].CONTESTID;
      console.log('Contest ID:', contestID);
  
      const insertChallengesQuery = `INSERT INTO MCSC.CHALLENGES (C_POINT, C_TITLE, C_CONTENT,  FLAG, CONTESTID)
                                     VALUES (:c_point, :c_title, :c_content,  :flag, :contestID)`;
  
      for (const challenge of challenges) {
        await db.execute(insertChallengesQuery, {
          ...challenge,
          contestID
        }, { autoCommit: true });
      }
  
      res.status(200).send({ message: 'Contest and challenges added successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    } finally {
      
    }
  };