const { connection } = require("../database/database.js");
const { query, queryWP } = require("../database/origins/default.js");
const oracledb = require("oracledb");


exports.courseSearch = async (req, res) => {

    try {
        const { searchQuery } = req.body;
        console.log("SEARCH QUERY: ", searchQuery);
        let links = [];
        // get all courses
        let view = "CREATE VIEW MCSC.ALL_COURSES AS SELECT * FROM MCSC.COURSES" // this was run in database
        let sql = `SELECT * FROM MCSC.ALL_COURSES WHERE COURSE_NAME LIKE '%' || :searchQuery || '%' OR COURSE_DESCRIPTION LIKE '%' || :searchQuery || '%'`;
        let result = await query(sql, { searchQuery: `%${searchQuery}%` }, `failed to get search result for query ${searchQuery}`, `got search result`);
        // getting the course ID we need to also include a url with /courses/:courseID in the links 
        for (let i = 0; i < result.length; i++) {
            links.push({"link:": `/courses/${result[i].COURSE_ID}`});
        }
        if(result.length === 0){    
            sql = `SELECT * FROM MCSC.CONTEST WHERE CONTESTNAME LIKE '%' || :searchQuery || '%' OR CONTESTDESC LIKE '%' || :searchQuery || '%'; OR CONTESTTYPE LIKE '%' || :searchQuery || '%'`;
            result = await query(sql, { searchQuery: `%${searchQuery}%` }, `failed to get search result for query ${searchQuery}`, `got search result`);
            for (let i = 0; i < result.length; i++) {
                links.push({"link:": `/challenges/${result[i].CONTESTID}`});
            }
        }
        
        console.log("RESULT: ", result);

        res.status(200).json({
            success: true,
            data: result,
            link: links
        });
    } catch (error) {
        console.log("Error while searching for courses");
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while searching for courses',
            error: error.message
        })
    }
};


exports.contestSearch = async (req, res) => {

    try {
        const { searchQuery } = req.body;
        console.log("SEARCH QUERY: ", searchQuery);
        let links = [];
        // get all courses
        let view = `CREATE VIEW MCSC.ALL_CONTESTS AS SELECT * FROM MCSC.CONTESTS`
        let sql = `SELECT * FROM MCSC.ALL_CONTESTS WHERE CONTESTNAME LIKE '%' || :searchQuery || '%' OR CONTESTDESC LIKE '%' || :searchQuery || '%' OR CONTESTTYPE LIKE '%' || :searchQuery || '%'`;
        let result = await query(sql, { searchQuery: `%${searchQuery}%` }, `failed to get search result for query ${searchQuery}`, `got search result`);
        // getting the course ID we need to also include a url with /courses/:courseID in the links 
        for (let i = 0; i < result.length; i++) {
            links.push({"link:": `/challenges/${result[i].CONTESTID}`});
        }
        console.log("RESULT: ", result);

        res.status(200).json({
            success: true,
            data: result,
            link: links
        });
    } catch (error) {
        console.log("Error while searching for courses");
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while searching for courses',
            error: error.message
        })
    }
};
