import {connection, } from './database.js'


export async function getTaskInfo(email){
    const db = await connection();
    const sql = `SELECT * FROM MCSC.TaskList WHERE "EMAIL" = :val1`;
    try {
        const res = await db.execute(sql, {
            val1: email
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
    const sql = 'SELECT * FROM MCSC.TaskList WHERE "UID" = :val1'; 
    try{
        const result = await db.execute(sql, {val1: UserID});
        const TaskList = result.rows;
        var list = [];
        console.log("TaskList:\n");
        for(let i of TaskList){
            list.push({
                UID: i.UID,
                platform: i.platform,
                TASKURL: i.TASKURL,
                TASKNAME: i.TASKNAME,
                status: i.status,
                TASKNOTE: i.TASKNOTE
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
export async function getAllTasks(email) {
    
    const db = await connection();
    const sql = 'SELECT * FROM MCSC.TaskList WHERE "EMAIL" = :val1'; 
    try{
        const result = await db.execute(sql, {val1: email});
        const TaskList = result.rows;

        // var list = [];
        console.log("TaskList:\n", TaskList);
        return TaskList;
        // for(let i of TaskList){
            
        //     list.push({
        //         UID: i.UID,
        //         platform: i.platform,
        //         TASKURL: i.TASKURL,
        //         TASKNAME: i.TASKNAME,
        //         status: i.status,
        //         TASKNOTE: i.TASKNOTE,
        //         total: i.TotalTasks,
        //         pending: i.PendingTask,
        //         attempted: i.AttemptedTask,
        //         revisit: i.RevisitTask
        //     });
        // }
        // // console.log(list);
        // // await db.close();
        // return list;
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

export async function getTaskByID(taskID, userID) {
    // createTable();   //create table if not exists
    const db = await connection();
    
    const sql = 'SELECT * FROM MCSC.TaskList WHERE "UID" = :val1 AND "USER_ID" = :val2'; 
    try{
        const result = await db.execute(sql, {val1: taskID, val2: userID});
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

export async function getTaskByEmail(taskID, email) {
    // createTable();   //create table if not exists
    const db = await connection(); 
    const sql = 'SELECT * FROM MCSC.TaskList WHERE "UID" = :val1 AND "EMAIL" = :val2'; 
    try{
        const result = await db.execute(sql, {val1: taskID, val2: email});
        const TaskList = result.rows;
        // const Task = result.rowsAffected;
        console.log("the TaskList:\n"+(TaskList));
        // await db.commit();
        return TaskList[0];
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
