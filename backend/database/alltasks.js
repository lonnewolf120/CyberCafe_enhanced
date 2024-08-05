import {connection, } from './database.js'


export async function getTaskInfo({USER_ID}){
    const db = await connection();
    const sql = `SELECT * FROM TaskList WHERE "USER_ID" = :val1`;
    try {
        const res = await db.execute(sql, {
            val1: USER_ID
        });
        await db.commit();
        console.log("Task INFO FOUND: ", JSON.stringify(res.rows));
        console.log(res.rows);

        if (res.rows.length === 0) {
            console.log("User not found (FRON GTB)");
            return null;
        }
        const retrievedUser = res.rows;        
        return retrievedUser;
    } catch (e) {
        console.log("Error:", e.message);
        return null;
    } finally {
        if (db) {
            try {
                await db.close();
            } catch (e) {
                console.log("Error: " + e.message);
            }
        }
    }
}
export async function getAllTasks1(taskID) {
    
    const db = await connection();
    const sql = 'SELECT * FROM TaskList WHERE "uid" = :val1'; 
    try{
        const result = await db.execute(sql, {val1: USER_ID});
        const TaskList = result.rows;
        var list = [];
        console.log("TaskList:\n");
        for(let i of TaskList){
            list.push({
                uid: i.uid,
                platform: i.platform,
                taskURL: i.taskURL,
                taskName: i.taskName,
                status: i.status,
                note: i.note
            });
        }
        // console.log(list);
        // await db.close();
        return list;
    }catch(err){
        console.log("Error loading data (getAllTasks1): "+ err.message);
        return null;
    } finally{
        if(db){
            try{await db.close();}
            catch(e){console.log("Error closing DB on Get All Tasks: "+e.message);}
        }
    }
}
// export async function getUser
export async function getAllTasks(USER_ID) {
    
    const db = await connection();
    const sql = 'SELECT * FROM TaskList WHERE "USER_ID" = :val1'; 
    try{
        const result = await db.execute(sql, {val1: USER_ID});
        const TaskList = result.rows;
        var list = [];
        console.log("TaskList:\n", TaskList);
        for(let i of TaskList){
            
            list.push({
                uid: i.uid,
                platform: i.platform,
                taskURL: i.taskURL,
                taskName: i.taskName,
                status: i.status,
                note: i.note,
                total: i.TotalTasks,
                pending: i.PendingTask,
                attempted: i.AttemptedTask,
                revisit: i.RevisitTask
            });
        }
        // console.log(list);
        // await db.close();
        return list;
    }catch(err){
        console.log("Error loading data: "+ err.message);
        return null;
    } finally{
        if(db){
            try{await db.close();}
            catch(e){console.log("Error closing DB on Get All Tasks: "+e.message);}
        }
    }
}
/*
 Call the function to fetch data
getAllTasks()
  .then((TaskList) => {
    //Process fetched data here or perform other operations
    console.log("Fetched data:", TaskList);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
*/

export async function getTaskByID(taskID, USER_ID) {
    // createTable();   //create table if not exists
    const db = await connection();
    const sql = 'SELECT * FROM TaskList WHERE "uid" = :val1 AND "USER_ID" = :val2'; 
    try{
        const result = await db.execute(sql, {val1: taskID, val2: USER_ID});
        const TaskList = result.rows;
        const Task = result.rowsAffected;
        console.log("the Task:\n"+(TaskList||Task));
        await db.commit();
        return TaskList||Task;
    }catch(err){
        console.log("Error Getting data: "+ err.message);
        return null;
    } finally{
        if(db){
            try{await db.close();}
            catch(e){console.log("Error closing DB on Get All Tasks: "+e.message);}
        }
    }
}
