  import React, { useState } from "react";
  import { Link } from "react-router-dom";
  import { useSelector } from "react-redux";
  import { Button } from "flowbite-react";
  import "./ChallengeCard.css";
  import Modal from "./Modal";
  import axios from "axios";
  import { motion, AnimatePresence } from "framer-motion";
  import { toast } from "react-hot-toast";
 // title, description, FLAG, cid, user_id, contestID
  const ChallengeCard = ({ challenge, user }) => {
    const [open, setOpen] = useState(false);
    const [flag, setFlag] = useState("");
    const { token } = useSelector((state) => state.auth);
    const [bg_color, setBgColor] = useState("");
    const [showHint, setShowHint] = useState(false);
    
    // key={index}
    //         title={challenge.C_TITLE}
    //         description={challenge.C_CONTENT}
    //         FLAG={challenge.FLAG}
    //         cid={challenge.CID}
    //         user_id={user.USER_ID}
    //         contestId={challenge.CONTESTID}
    const handleSubmit = async () => {
      let stat = "";
      console.log(flag, challenge?.FLAG  )
      if (flag === challenge?.FLAG) {
        // toast.success("Correct Flag");
        stat = "Correct";
        setBgColor("bg-gradient-to-br from-green-500 via-green-600 to-green-700")
      } else {
        // toast.error("Incorrent Flag");
        stat = "Incorrect";
        setBgColor("bg-gradient-to-br from-red-500 via-red-600 to-red-700")
      }
      console.log("all data (ChallengeCard): ", challenge?.CID, user?.USER_ID, stat, challenge?.CONTESTID);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/contest/submit",
          {
            cid: challenge?.CID,
            user_id: String(user.USER_ID),
            status: String(stat),
            contestID: challenge?.CONTESTID
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Submission Response:", response.data);
        if (response.data.message) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        console.error("Error submitting flag:", error);
      }
    };
    const handleChange = (e) => {
      setFlag(e.target.value);
    };

    return (
      
      <div className={`p-2 m-6 grid place-items-center challenge-card ${bg_color} `}>
        <h2 className="">{challenge?.C_TITLE}</h2>
        <p className="p-2">{challenge?.C_CONTENT}</p>
        {/* <h1>{FLAG}</h1> */}

        <Button className=" pb-2 card-btn text-center" onClick={() => setOpen(true)}>
          Solve
        </Button>
        { open && (
      <AnimatePresence>
<motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 
            bg-gradient-to-r  bg-opacity-70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl rounded-lg shadow-lg bg-black"
            >
              <Modal open={open} onClose={() => setOpen(false)}>
          <div className="m ">
            <h2>{challenge?.C_TITLE}</h2>
            <p>{challenge?.C_CONTENT}</p>
            <input
            type="text"
            className="p-2 m-2 border rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Flag"
            value={flag}
            onChange={handleChange}
          />
          

            {/*  <Link to={link} className="challenge-card-link"> */}
            
            <Button
              className="card-btn"
              onClick={() => {
                handleSubmit();
                setOpen(false);
              }}
            >
              Submit
            </Button>
            {console.log("the challenge: ", challenge)}
        
        <div className="flex justify-center content-center">
            <Button
              className=" bg-caribbeangreen-500 text-white py-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setShowHint(true)}
            >
              Show Hint
            </Button>
            </div>
            {showHint && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <p className="text-gray-700">{challenge?.HNT?.CONTENT}</p>
                <div className="flex justify-center content-center">
                <Button
                  className="bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => setShowHint(false)}
                >
                  Close Hint
                </Button>
                </div>
              </div>
            )}
        {/*  </Link> */}  
          </div>
        </Modal>
        </motion.div></motion.div></AnimatePresence>)}
      </div>
    );
  };

  export default ChallengeCard;
