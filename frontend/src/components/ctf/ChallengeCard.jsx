import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from 'flowbite-react';
import "./ChallengeCard.css";
import Modal from "./Modal";
import axios from "axios";

import { toast } from "react-hot-toast";

const ChallengeCard = ({ title, description, real_flag, cid, user_id }) => {
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState("");
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const handleSubmit = async () => {
    if (flag === real_flag) {
      // enqueueSnackbar("Correct Flag", { variant: 'success' });
      toast.success("Correct Flag");
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/contest/submit",
          {
            cid: cid,
            user_id: String(user.USER_ID),
            status: "Correct",
            submissionID: generateSubmissionID(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Submission Response:", response.data);
      } catch (error) {
        console.error("Error submitting flag:", error);
      }
    } else {
      // enqueueSnackbar("Incorrect Flag", { variant: 'error' });
      toast.error("Incorrent Flag");
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/contest/submit",
          {
            cid: cid,
            user_id: user_id,
            status: "Incorrect",
            submissionID: generateSubmissionID(),
          }
        );
        console.log("Submission Response:", response.data);
      } catch (error) {
        console.error("Error submitting flag:", error);
      }
    }
  };

  const handleChange = (e) => {
    setFlag(e.target.value);
  };
  let counter = 5;
  const generateSubmissionID = () => {
    const number = counter.toString().padStart(3, "0");
    counter++;
    return "S" + number;
  };
  return (
    <div className="challenge-card">
      <h2>{title}</h2>
      <p>{description}</p>
      {/* <h1>{real_flag}</h1> */}

      <Button className="card-btn" onClick={() => setOpen(true)}>
        Solve
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="m">
          <h2>{title}</h2>
          <p>{description}</p>
          <input
            type="text"
            className="textbox"
            placeholder="Flag"
            value={flag}
            onChange={handleChange}
          />
          {/*  <Link to={link} className="challenge-card-link"> */}
          <Button onClick={handleSubmit}>Submit</Button>
          {/*  </Link> */}
        </div>
      </Modal>
    </div>
  );
};

export default ChallengeCard;
