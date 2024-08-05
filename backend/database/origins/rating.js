const { query, queryWP } = require("./default.js");
const { connection } = require("../database.js");

async function getRating(COURSE_ID, USER_ID){
    const sql = `select * from mcsc.ratingandreviews 
    where course_id = :COURSE_ID and user_id = :USER_ID`
    return await query(sql, {COURSE_ID: COURSE_ID, USER_ID: USER_ID},"Failed to get rating", "Got rating");
}

async function getAvgRating(COURSE_ID){
    const sql = `select AVG(RATING) AS "averageRating" from mcsc.ratingandreviews where course_id = :COURSE_ID`;
    return await query(sql, {COURSE_ID: COURSE_ID}, "Failed to get avg rating", "got rating");
}

async function addRating(USER_ID,COURSE_ID,  rating, review){
    const sql = `insert into mcsc.ratingandreviews ( USER_ID, COURSE_ID , RATING, REVIEW) 
    VALUES ( :USER_ID, :cid, :rating, :review)`
    return await query(sql, {USER_ID: USER_ID, cid: COURSE_ID, rating: rating, review: review}, "Failed to addd rating", "Added rating");
}

async function getAllRR(){
    const sql = `select B.FIRST_NAME, B.LAST_NAME, B.EMAIL, B.IMAGE, C.COURSE_ID, C.COURSE_NAME, A.RATING, A.REVIEW 
from mcsc.ratingandreviews A, mcsc.users B, mcsc.courses C 
where A.USER_ID = B.USER_ID AND A.COURSE_ID = C.COURSE_ID  
order by rating desc`;
    return await queryWP(sql, "Failed to get all rating and Review", "got all rating and Review")
}

module.exports = {
    getRating,
    addRating,
    getAvgRating,
    getAllRR
}