const { connection } = require("../database/database");
const oracledb = require("oracledb");

exports.submit = async (req, res) => {
  const { cid, user_id, status, contestID } = req.body;

  if (!cid || !user_id || !status) {
    return res.status(400).send({ error: "Missing required fields" });
  }
  console.log("Submission:", req.body);

  const db = await connection();

  try {
    const sql = `SELECT * FROM MCSC.SUBMISSION WHERE cid = :cid AND user_id = :user_id AND status = 'Correct'`;
    const result = await db.execute(sql, { cid: cid, user_id: user_id });
    console.log("Result of submission for cid and user", result.rows);
    // Check if any previous submission is 'Correct'
    if (result.rows.some((row) => row.STATUS === "Correct")) {
      console.log("Already Submitted Correct flag");
      return res.status(200).send({ error: "Already Submitted Correct flag" });
    }
  } catch (error) {
    console.log("Error fetching Submissions for cid and user_id", error);
    
  }

  try {
    // Get the current timestamp
    // const currentTime = new Date(); // You can format this if needed

    const query = `
  INSERT INTO MCSC.SUBMISSION (cid, user_id, status, contestID)
  VALUES (:cid, :user_id, :status, :contestID)
`;

    const result = await db.execute(query, {
      cid: cid,
      user_id: user_id,
      status: status,
      contestID: contestID,
    });

    console.log("Inserted into submission, result:", result);

    await db.commit();
    
    if (result.rowsAffected) {
      return status === "Correct" ?
        res.status(200).send({ message: "Submitted correct flag" })
        :
        res.status(200).send({ error: "Submitted Wrong flag" });
    } else {
      return res.status(400).send({ error: "Failed to insert submission" });
    }
  } catch (error) {
    console.error("Error inserting submission:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

//FIXME: leaderboard not working for other contests
exports.leaderboard = async (req, res) => {
  const contestID = req.params.cid;
  console.log("Contest ID (Leaderboard):", req.params);
  const db = await connection();

  //command to create the procedure, which was created in the database
  const plsql_procedure = `
   DECLARE
        dummy INTEGER;
    BEGIN
        EXECUTE IMMEDIATE '
        CREATE OR REPLACE PROCEDURE MCSC.GET_LEADERBOARD (
            p_contestID IN MCSC.SUBMISSION.CONTESTID%TYPE,
            o_cursor OUT SYS_REFCURSOR
        ) IS
        BEGIN
            OPEN o_cursor FOR
                SELECT 
                    S.USER_ID, 
                    SUM(S.POINTS) AS TOTAL_POINTS, 
                    U.FIRST_NAME, 
                    U.LAST_NAME, 
                    U.EMAIL, 
                    U.IMAGE
                FROM 
                    MCSC.SUBMISSION S
                JOIN 
                    MCSC.USERS U ON S.USER_ID = U.USER_ID
                WHERE 
                    S.CONTESTID = p_contestID
                GROUP BY 
                    S.USER_ID, 
                    U.FIRST_NAME, 
                    U.LAST_NAME, 
                    U.EMAIL, 
                    U.IMAGE
                ORDER BY 
                    TOTAL_POINTS DESC;
        END GET_LEADERBOARD;';
    END;
`
  
  try {
        // Procedure created in the database and executed here
        const result = await db.execute(
            `BEGIN
                MCSC.GET_LEADERBOARD(:contestID, :cursor);
            END;`,
            {
                contestID: { dir: oracledb.BIND_IN, val: Number(contestID), type: oracledb.NUMBER },
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );

        const resultSet = result.outBinds.cursor;
        const rows = [];

        let row;
        while ((row = await resultSet.getRow())) {
            rows.push(row);
        }
        await resultSet.close();

        console.log(`Leaderboard for contest ${contestID}:`, rows);
        return res.status(200).send(rows);
    } catch (error) {
        console.log("Error fetching leaderboard", error);
        return res.status(500).send({ error: "Internal Server Error" });
    } finally {
        await db.close();
    }
    
};



exports.allcontests = async (req, res) => {
  const db = await connection();
  const query = "SELECT * FROM MCSC.CONTEST";
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
    const query = "SELECT * FROM MCSC.CHALLENGES WHERE CONTESTID = :contestID";
    const result = await db.execute(query, [contestID]);
    // const query = 'SELECT * FROM MCSC.CHALLENGES';
    //const result = await db.execute(query);
    if (result && result.rows) {
      console.log(`Challenges for contestID ${contestID}: `, result.rows);
      return res.status(200).send(result.rows);
    } else {
      return res
        .status(400)
        .send({ error: `Couldn't find challenges for contestID ${contestID}` });
    }
  } catch (error) {
    console.error(
      `Error fetching challenges for contestID ${contestID}:`,
      error
    );
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.addContest = async (req, res) => {
  const { contestName, startTime, endTime, challenges } = req.body;
  console.log("FROM ADD CONTEST", req.body);

  console.log("Contest:", contestName);

  if (!contestName || !startTime || !endTime || !challenges) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    const db = await connection();
    // console.log("");
    const insertContestQuery = `INSERT INTO MCSC.CONTEST (CONTESTNAME, STARTTIME, ENDTIME)
                                  VALUES (:contestName, TO_TIMESTAMP(:startTime, 'YYYY-MM-DD"T"HH24:MI'), TO_TIMESTAMP(:endTime, 'YYYY-MM-DD"T"HH24:MI'))`;
    await db.execute(
      insertContestQuery,
      {
        contestName,
        startTime,
        endTime,
      },
      { autoCommit: true }
    );

    const contestIDResult = await db.execute(
      `SELECT CONTESTID FROM MCSC.CONTEST WHERE CONTESTNAME = :contestName`,
      { contestName }
    );
    const contestID = contestIDResult.rows[0].CONTESTID;
    console.log("Contest ID:", contestID);

    const insertChallengesQuery = `INSERT INTO MCSC.CHALLENGES (C_POINT, C_TITLE, C_CONTENT,  FLAG, CONTESTID, HNT)
                                     VALUES (:c_point, :c_title, :c_content,  :flag, :contestID, HINT(:hintCost, :hintContent))`;

    for (const challenge of challenges) {
      await db.execute(
        insertChallengesQuery,
        {
          ...challenge,
          contestID,
        },
        { autoCommit: true }
      );
    }

    res
      .status(200)
      .send({ message: "Contest and challenges added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  } finally {
  }
};

exports.getSubmission = async (req, res) => {
    const { userId } = req.params;
  
    try {
        const db = await connection();
        const query = `
        SELECT COUNT(*) AS SUBMISSION_COUNT, TO_CHAR(submission_time, 'DD-MM-YYYY') AS "SUBMISSION_DATE" 
        FROM MCSC.SUBMISSION WHERE USER_ID = :userId 
        GROUP BY TO_CHAR(submission_time, 'DD-MM-YYYY')
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
  
}

exports.addChallenge = async (req, res) => {
  const { contestID, challenges } = req.body;
  console.log("The body: ", req.body);

  const insertChallengesQuery = `INSERT INTO MCSC.CHALLENGES (C_POINT, C_TITLE, C_CONTENT,  FLAG, CONTESTID, HNT)
  VALUES (:c_point, :c_title, :c_content,  :flag, :contestID, HINT(:hintCost, :hintContent))`;

  const db = await connection();
  try {
    for (const challenge of challenges) {
      const result = await db.execute(
        insertChallengesQuery,
        {
          ...challenge,
          contestID,
        },
        { autoCommit: true }
      );

      console.log("the result: ", result);
    }
    res.status(200).send({ message: "Contest challenges added successfully" });
  } catch (err) {
    console.log("Error from addChallenge: ", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
