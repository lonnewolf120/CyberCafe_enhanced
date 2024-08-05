import {connection} from './database.js'


export async function addTask(tasks, email)
{
    console.log("DB: processing create task: "+JSON.stringify(tasks)+ " user"+email);
    var db=null;
    if(!tasks.platform) platform="OJ";
    try{
    db = await connection();
    const sql = `INSERT INTO MCSC.TaskList ("PLATFORM", "TASKNAME", "TASKURL", "TASKNOTE", "STATUS", "EMAIL") VALUES (:val1, :val2, :val3, :val4, :val5, :val6)`;
    const result = await db.execute(sql, 
    {
        val1: tasks.platform, 
        val2: tasks.TASKNAME, 
        val3: tasks.TASKURL,
        val4: tasks.tasknote,
        val5: tasks.status,
        val6: email   
    });
    db.commit();
    console.log("Inserted data: \n" + result.rowsAffected);
    // await db.close();
    // return 200;
    return result.rowsAffected;
    }
    catch(err){
        console.error("Error creating data:", err);
        // await db.close();
        return 500;
    }finally{
        if(db){
            try{await db.close();}
            catch(e){console.log("Error: "+e.message);}
        }
    }
}

//Update tasks based on UID
export async function updateTask(TASKNAME, TASKURL, platform, status, tasknote, taskId, email){
    const query = `UPDATE MCSC.TaskList 
    SET "TASKNAME" = :v1, 
        "TASKURL" = :v2, 
        "PLATFORM" = :v3, 
        "STATUS" = :v4, 
        "TASKNOTE" = :v5 
    WHERE "EMAIL" = :v7 AND "UID" = :v6`;


    const params = {
        v1: TASKNAME,
        v2: TASKURL,
        v3: platform,
        v4: status,
        v5: tasknote,
        v6: taskId,
        v7: email
    };
    // var msg = {};
    const db = await connection();
    try {
        console.log("received req in backend: ", params)
        const res = await db.execute(query, params, {autoCommit:true});
        await db.commit();
        console.log("Updated task " + TASKNAME + " with UID " + taskId + " And res:\n");
        console.log(res);
        
        return res;
    }
    catch(e){
        console.error("Error updating data: ", e.message);
        // await db.close();
        return null;
    }
    finally{
        if(db){
            try{await db.close();}
            catch(e){console.log("Error: "+e.message);}
        }
    }
}



export async function deleteTask(taskID, userID) {
    let db;
    const sql = 'DELETE FROM TaskList WHERE "UID" = :val1 AND "EMAIL" =:val2';
    var errMsg={error:""};
    console.log("Trying to delete task with ID " + taskID+" from email: "+userID)
    try{
        db = await connection();
        // console.log(taskID,
        await db.execute(sql,{val1: taskID, val2:userID});
        await db.commit();
        // await db.close();
        return {message:"Deleted task with ID " + taskID+" from Email: "+userID};
    }
    catch(err){
        console.error("Error deleting data:", err.message);
        // await db.close();
        return {error:"ERROR deleting task with ID " + taskID+"\n"};
    }
    finally{
        if(db){
            try{await db.close();}
            catch(e){console.log("Error Closing DB on AddTask: "+e.message);}
        }
    }
    
}