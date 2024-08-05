// query.js

const { connection } = require("../database.js");

async function query(sql, params, err, suc) {
  const db = await connection(); 
  try {
    const res = await db.execute(sql, params);
    // if (res.rows.length === 0) {
    //   console.log("not found");
    //   return null;
    // }
    await db.commit();
    console.log(suc);
    // console.log("Query res: ", res.rows?res.rows:res);
    return (res?.rows)? (res.rows) : (res);
  } catch (e) {
    console.log(err);
    console.log("Error: ", e);
    // throw e;
    return null;
  } 
  // finally {
  //   if (db) {
  //     try {
  //       await db.close();
  //     } catch (e) {
  //       console.log("Error:", e.message);
  //     }
  //   }
  // }
}

async function queryR(sql, params, err, suc) {
  const db = await connection(); 
  try {
    const res = await db.execute(sql, params);
    // if (res.rows.length === 0) {
    //   console.log("not found");
    //   return null;
    // }
    await db.commit();
    console.log(suc);
    // console.log("Query res: ", res.rows?res.rows:res);
    return res;
  } catch (e) {
    console.log(err);
    console.log("Error: ", e);
    // throw e;
    return null;
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (e) {
        console.log("Error:", e.message);
      }
    }
  }
}


async function queryWP(sql, err, suc) {
  const db = await connection(); 
  try {
    const res = await db.execute(sql);
    if (res.rows.length === 0) {
      console.log("not found");
      return null;
    }
    await db.commit();
    console.log(suc);
    // console.log("Query results: ", res.rows);
    return res.rows;
  } catch (e) {
    console.log(err);
    console.log("Error: ", e.message);
    return null;
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (e) {
        console.log("Error:", e.message);
      }
    }
  }
}

module.exports = {query, queryWP, queryR};
