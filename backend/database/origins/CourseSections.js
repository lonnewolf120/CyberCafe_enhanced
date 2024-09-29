const { query, queryWP } = require("./default.js");
const { connection } = require("../database.js");

async function isSubsectionValid(subsection_id) {
  const sql = `
    DECLARE
        v_subsection_id NUMBER := :subsection_id;
        v_course_progress_id NUMBER;
        v_completed_videos VARCHAR2(4000);
    BEGIN
        -- Check if the subsection is valid
        SELECT subsection_id INTO v_subsection_id
        FROM MCSC.SubSection
        WHERE subsection_id = v_subsection_id;

        IF SQL%NOTFOUND THEN
            RAISE_APPLICATION_ERROR(-20001, 'Invalid subsection');
        END IF;
    END;
`;
  const params = {subsection_id:subsection_id};
  return await query(sql, params, "failed checking subsection", "subsection fetched");
}

async function addSection(COURSE_ID, sname ){
    const sql= `INSERT INTO MCSC.SECTION (COURSE_ID, SECTION_NAME) VALUES(:cid, :sn)`;
    return await query(sql, {cid:COURSE_ID, sn:sname},"Failed to add section", "Added section")
}

async function updateSection(sname, sid){
    const sql= `UPDATE MCSC.SECTION 
    SET SECTION_NAME = :sn WHERE SECTION_ID = :sid`;
    return await query(sql, {sn:sname, sid:sid},"Failed to add section", "Added section")
}
async function deleteSection(sid){
    const sql= `DELETE FROM MCSC.SECTION WHERE SECTION_ID = :sid`;
    return await query(sql, {sid:sid},"Failed to add section", "Added section")
}

async function updCourseProgress(COURSE_ID, USER_ID, subsection_id){
    try{
    const db = await connection();
    const sql = `
    UPDATE MCSC.COURSEPROGRESS
    SET SUBSECTION_ID = :SUBSECTION_ID,    
    COMPLETED_VIDEOS = (SELECT VIDEO_URL FROM MCSC.SUBSECTION where SUBSECTION_ID = :SUBSECTION_ID)
    WHERE COURSE_ID = :COURSE_ID AND 
        USER_ID = :USER_ID
    `
    const res = await db.execute(sql, {SUBSECTION_ID: subsection_id, COURSE_ID: COURSE_ID, USER_ID: USER_ID});
    await db.commit();
    return res;}
    catch(e){
        console.log("Error in updating data", e.message);
        return null;
    }
}

async function addCourseProgress(COURSE_ID, USER_ID){
    const sql = `INSERT INTO MCSC.COURSEPROGRESS (COURSE_ID, USER_ID) VALUES (:COURSE_ID, :USER_ID)`;
    const res = await query(sql, {COURSE_ID:COURSE_ID, USER_ID:USER_ID});
    return res;
}

async function findCourseProgress(COURSE_ID, USER_ID){
    const fn = `
    CREATE OR REPLACE PROCEDURE GET_PROGRESS
    (COURSE_ID IN NUMBER, studentId IN VARCHAR2, v_completed_videos OUT NUMBER,
     v_total_videos OUT NUMBER, v_completion_ratio OUT NUMBER)
    AS
    BEGIN
        SELECT COUNT(P.completed_videos) AS count_completed_videos, 
           COUNT(S.video_url) total_videos,
        INTO v_completed_videos, v_total_videos
        FROM MCSC.COURSEPROGRESS P, 
            MCSC.SUBSECTION S 
        WHERE P.COURSE_ID = v_course_id
        AND P.USER_ID = v_user_id
        AND S.COURSE_ID = P.COURSE_ID
        GROUP BY P.completed_videos;

        -- Calculate the completion ratio
        IF v_total_videos = 0 THEN
            v_completion_ratio := 0;
        ELSE
            v_completion_ratio := (v_completed_videos / v_total_videos) * 100;
        END IF;
    END;

    `

    const sql = `
DECLARE
    v_course_id NUMBER := :COURSE_ID;
    v_user_id VARCHAR2(20) := :studentId;
    v_completed_videos NUMBER;
    v_total_videos NUMBER;
    v_completion_ratio NUMBER;
BEGIN
    -- Fetch the count of completed videos and total videos
    SELECT COUNT(P.completed_videos) AS count_completed_videos, 
           COUNT(S.video_url) total_videos,
    INTO v_completed_videos, v_total_videos
    FROM MCSC.COURSEPROGRESS P, 
         MCSC.SUBSECTION S 
    WHERE P.COURSE_ID = v_course_id
      AND P.USER_ID = v_user_id
      AND S.COURSE_ID = P.COURSE_ID
    GROUP BY P.completed_videos;

    -- Calculate the completion ratio
    IF v_total_videos = 0 THEN
        v_completion_ratio := 0;
    ELSE
        v_completion_ratio := (v_completed_videos / v_total_videos) * 100;
    END IF;

    -- Output the results
    --DBMS_OUTPUT.PUT_LINE('Completed Videos: ' || v_completed_videos);
    --DBMS_OUTPUT.PUT_LINE('Total Videos: ' || v_total_videos);
    --DBMS_OUTPUT.PUT_LINE('Completion Ratio: ' || v_completion_ratio || '%');
END;
/

`;
const params = {
    COURSE_ID : COURSE_ID, USER_ID: USER_ID
};
return await query(sql, params, "failed checking courseProgress", "progress fetched");

}


async function addSubsection(title, duration, desc, url, sid){
    const sql = `INSERT INTO MCSC.SUBSECTION (SECTION_ID, TITLE, TIME_DURATION, DESCRIPTION, VIDEO_URL) VALUES(:secid,:title, :dur, :des, :uri)`
    return await query(sql, {secid:sid,title:title, dur:duration, des:desc, uri:url})
}
async function findSubsection(SUBSECTION_ID){
    const sql = `SELECT * FROM MCSC.SUBSECTION WHERE SUBSECTION_ID = :subsId`
    return await query(sql, {subsId: SUBSECTION_ID}, "failed to add subsection", "added subsection");
}
async function updateSubsection(subsection){
    //TODO: testing needed
    const sql = `UPDATE MCSC.SUBSECTION 
    SET TITLE = :title, "DESCRIPTION" = :des, VIDEO_URL = :uri, TIME_DURATION = :dur WHERE SUBSECTION_ID = :sid`
    return await query(sql, {
        title: subsection.title,
        des:   subsection.description,
        uri:   subsection.videoUrl,
        dur:   subsection.timeDuration,
        sid:   subsection.id
    },
    "failed to add subsection", "added subsection"
)
}
async function deleteSubsection(SUBSECTION_ID, sectionId){
    const sql = `DELETE FROM MCSC.SUBSECTION WHERE SUBSECTION_ID = :SUBSID, SECTION_ID = :SECTIONID`
    return await query(sql, {SUBSID: SUBSECTION_ID, SECTIONID: sectionId}, "failed to delete subsection", "deleted subsection")
}

module.exports ={
    isSubsectionValid,
    findCourseProgress,
    updCourseProgress,
    addCourseProgress,
    addSection,
    updateSection,
    deleteSection,
    addSubsection,
    updateSubsection,
    findSubsection,
    deleteSubsection
}