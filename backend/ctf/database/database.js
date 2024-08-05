import oracledb from 'oracledb';
import { dbConfig } from '../config.js';
import { platform } from 'os';
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


export async function connection() {
    // let db="";
    try{
        var db = null;
        db = await oracledb.getConnection(dbConfig);
        console.log(((db)?"Database connected!":"Database not connected!"));
        return db;
    }
    catch (e) {
    console.log("ERROR CONNECTING DB: "+e.message);
    throw e;
    // return;
    }
}

// Call closePool() when done with application
async function closePool() {
    try {
        await oracledb.getPool().close();
        console.log("Connection pool closed.");
    } catch (err) {
        console.error("Error closing connection pool:", err);
    }
}