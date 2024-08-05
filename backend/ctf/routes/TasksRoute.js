import {express, cors, bodyParser, PORT} from '../config.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import {addTask, updateTask, deleteTask,} from '../database/crud.js'
import {  getUserID, getUser} from '../database/users.js';
import {getAllTasks, getTaskInfo, getTaskByEmail} from '../database/alltasks.js'
const app = express();
// Use bodyParser middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// import auth  from "../auth.js";

import { sendEmail, mailTemplate } from "../utils/mail.js";

const NumSaltRounds = Number(process.env.NO_OF_SALT_ROUNDS);


const router = express.Router();

router.get('/get-task/:taskID', async (req, res) => {
  let token = req.headers.authorization;
  jwt.verify(token, "RANDOM-TOKEN", async (err, decode)=> {
    if(err){
      return res.status(401).send({
        message: "Can't verify user, hence tasks not loaded",
        error: err.message
      })
    }
    try{
    const UID = req.params.taskID;
    let email = decode.EMAIL;
    console.log("user mail: ", email)
    const TaskList = await getTaskByEmail(UID, email);
    console.log("from get-task: ", TaskList)
    if(TaskList){
      console.log("Server received task: "+TaskList);
      return res.status(200).send(TaskList);
    }
    else{
      return res.status(400).send({error:"Couldn't find task by ID: "+UID});
    }
    }
    catch(err){
      return res.status(500).send({
        message: "Authorization issues for getting task by id",
        error:err.message});
    }
  })
})

router.get('/all-tasks', async (req, res) => {
  
  let token = req.headers.authorization;
  jwt.verify(token, "RANDOM-TOKEN", async (err, decode)=> {
    if(err){
      console.log(err.message)
      // return res.status(401).send({
      //   message: err.message,
      //   data:null,
      //   status: 401 
      // })
    }
    else
    {
      try{
        // const msg = { "error-message": "Error fetching tasks." }; // Default error message
        let TaskList = await getAllTasks(decode.EMAIL);
        console.log("All Task info: ",TaskList);
        if(TaskList){
          return res.status(200).send(TaskList);
        }
        else{
          return res.status(400);
        }
      }
      catch(err){
        console.log("ERROR from all-tasks: ", err.message)
        // return res.status(500).send({
        //   message: err.message
        // })
      }
    }
  })
});

function determinePlatform(tUrl) {
  // var m = (tUrl || sp.targetUrl()).match(/^(([^:\/?#]+:)?(?:\/\/((?:([^\/?#:]*)(?::([^\/?#:]*))?@)?([^\/?#:]*)(?::([^\/?#:]*))?)))?([^?#]*)(\?[^#]*)?(#.*)?$/),
  //   r = {
  //       // hash: m[10] || "",                   // #asd
  //       host: m[3] || "",                    // localhost:257
  //       hostname: m[6] || "",                // localhost
  //       // href: m[0] || "",                    // http://username:password@localhost:257/deploy/?asd=asd#asd
  //       // origin: m[1] || "",                  // http://username:password@localhost:257
  //       // pathname: m[8] || (m[1] ? "/" : ""), // /deploy/
  //       // port: m[7] || "",                    // 257
  //       protocol: m[2] || "",                // http:
  //       // search: m[9] || "",                  // ?asd=asd
  //       // username: m[4] || "",                // username
  //       // password: m[5] || ""                 // password
  //   };
  //   if (r.protocol.length == 2) {
  //       r.protocol = "file:///" + r.protocol.toUpperCase();
  //       r.origin = r.protocol + "//" + r.host;
  //   }
  //   // r.href = r.origin + r.pathname + r.search + r.hash;
    return "OJ";
}

router.get('/profile', async(req,res)=>{
  let token = req.headers.authorization;
  console.log("Token (profile): ", token)
  jwt.verify(token, "RANDOM-TOKEN", async (err, decode)=> {
    if(err){
      return res.status(401).send({
        message: "All tasks weren't loaded, as user not verified",
        error: err.message
      })
    }
    console.log(decode);
    let userInfo = await getUser(decode.EMAIL);
    let TaskList = await getTaskInfo(decode.EMAIL);
      if(TaskList && userInfo){
        return res.status(200).send({
          userinfo: userInfo,
          taskinfo: TaskList
        });}
      else if(TaskList){
        return res.status(200).send({
          userinfo: null,
          taskinfo: TaskList
        })}
      else if(userInfo){
        return res.status(200).send({
          userinfo: userInfo,
          taskinfo: null
        });
    }
    // else{
    //   return res.status(400).send({error:"Couldn't find any task! or USER NOT LOGGED IN"});
    // }
  })
})
router.post('/add-task', async (req,res)=>
{
  console.log("Create task req received, processing", JSON.stringify(req.body))
  // res.setHeader('Content-Type', 'application/json');
  let token = req.headers.authorization;
  // const userToken = req.body.userToken;
  jwt.verify(token, "RANDOM-TOKEN", async (err, decode)=> {
    if(err){
      return res.status(401).send({
        status: 401,
        message: err.message
      })
    }
    try{
    const errMsg = {message: "error"};
      // var { TASKNAME, TASKURL, platform } = req.body;
      var TASKNAME = req.body.TASKNAME;
      var TASKURL = req.body.TASKURL;
      var platform = req.body.platform;
      var TASKNOTE = req.body.TASKNOTE;
      var status = req.body.status;
    //TODO: implement function in Database to get Task name from Codeforces/OJ API
    if(!TASKNAME || !TASKURL) {
      // errMsg["message"]=
      return res.status(400).send({
        message: "task name/url not added",
        status: 400
      });
    }
    if(TASKURL && !platform){
      platform=determinePlatform(TASKURL);
    }
    //DONE: implement function to determine which OJ is used to set platform
    const data ={
      TASKNAME: TASKNAME,
      TASKURL: TASKURL,
      platform: platform,
      status: status,
      TASKNOTE:TASKNOTE
    }
    console.log("decoded: ", decode)
    // console.log("userid : ", decode.USERID)
    // console.log("data inserted: \n"+data);
    var msg = await addTask(data, decode.EMAIL); //send to DB to add data 
    
    if(msg===500){
      return res.status(500).send({
        message: "Internal server/database issue",
        status:500
      });
    }else if(msg===200){
      return res.status(200).send({
        message: "Task add successful",
        status:200
      });
    }else{
      return res.status(400).send({
        message: "Task add failed, either data doesnt exist or user",
        status:200
      });
    }}
    catch(err){
      return res.status(401).send({
        message: "Unauthorized access",
        status: 401
      })
    }
})
});
router.put('/update-task/:id',async (req,res)=>{
  
  let token = req.headers.authorization;
  jwt.verify(token, "RANDOM-TOKEN", async (err, decode)=> {
    if(err){
      return res.status(401).send({
        message: "Can't verify user, hence tasks not loaded " + err.message,
        status: 401
      })
    }
    try{
      res.setHeader('Content-Type', 'application/json');
      const task = req.body;
      const taskID = task.UID;
      console.log("Task from update-task req: ", task)
      console.log(`Task ID: ${task.taskID}`);
      // console.log(task);
      const platform = determinePlatform(task.TASKURL);
      console.log(platform)
      var Task = await updateTask(task.TASKNAME, task.TASKURL, platform, task.status, task.TASKNOTE, taskID, decode.EMAIL); 
      if(Task){
        return res.status(200).send({
          message: "Task added",
          status: 200
        });
      }else{
        return res.status(400).send({
          message: "Failed adding task " + err.message,
          status: 400
        });
      }
    }
    catch(err){
      return res.status(500).send({
        message: "Failed adding task " + err.message,
        status: 500
      })
    }
  })
});

router.delete('/delete-task/:UID', async (req, res)=>{
  
  let token = req.headers.authorization;
  const UID = req.params.UID;
  jwt.verify(token, "RANDOM-TOKEN", async (err, decode)=> {
    if(err){
      return res.status(401).send({
        message: "Can't verify user, hence tasks not loaded",
        error: err.message
      })
    }
    try{
      console.log("The task id: ",UID);
      var msg = await deleteTask(UID, decode.EMAIL);
      if(Object.keys(msg)[0]==='error'){
        return res.status(500).send(msg);
      }else if(Object.keys(msg)[0]==='message'){
        return res.status(200).send(msg);
      }else{
        return res.status(400);
      }
    }
    catch(err){
      return res.status(400).send({
        message: "Error deleting task",
        error: err.message
      })
    }
  })
});


export default router;