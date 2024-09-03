const oracledb = require('oracledb');
const { dbConfig } = require('./dbConfig.js');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//TODO: Create and start threadpool
async function initializePool() {
    try {
      await oracledb.createPool({
            user: 'MCSC',
            password: 'MCSC',
            connectString: 'localhost:1521/FREEPDB1',
            poolMin: 10,
            poolMax: 10000,
            poolIncrement: 100,
            poolTimeout: 1000
        });
      console.log('Connection pool started');
    } catch (err) {
      console.error('Error creating connection pool', err);
    }
  }
  
  async function closePool() {
    try {
      await oracledb.getPool().close(10);
      console.log('Connection pool closed');
    } catch (err) {
      console.error('Error closing connection pool', err);
    }
  }
  

async function connection() {
    try {
        let db = await oracledb.getConnection();
        console.log(db ? "Database connected!" : "Database not connected!");
        return db;
    } catch (e) {
        console.error("ERROR CONNECTING DB: " + e.message);
        throw e;
    }
}


module.exports = {
    initializePool,
    connection,
    closePool
};
