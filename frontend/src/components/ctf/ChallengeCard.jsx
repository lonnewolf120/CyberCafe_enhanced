  import React, { useState } from "react";
  import { Link } from "react-router-dom";
  import { useSelector } from "react-redux";
  import { Button } from "flowbite-react";
  import "./ChallengeCard.css";
  import Modal from "./Modal";
  import axios from "axios";

  import { toast } from "react-hot-toast";

  const ChallengeCard = ({ title, description, real_flag, cid, user_id, contestID }) => {
    const [open, setOpen] = useState(false);
    const [flag, setFlag] = useState("");
    const { token } = useSelector((state) => state.auth);
    const [bg_color, setBgColor] = useState("");

    const handleSubmit = async () => {
      let stat = "";
      if (flag === real_flag) {
        stat = "Correct";
        setBgColor("bg-gradient-to-br from-green-500 via-green-600 to-green-700")
      } else {
        // toast.error("Incorrent Flag");
        stat = "Incorrect";
        setBgColor("bg-gradient-to-br from-red-500 via-red-600 to-red-700")
      }
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/contest/submit",
          {
            cid: cid,
            user_id: String(user_id),
            status: String(stat),
            contestID: contestID
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
        <h2 className="">{title}</h2>
        <p className="p-2">{description}</p>
        {/* <h1>{real_flag}</h1> */}

        <Button className=" pb-2 card-btn text-center" onClick={() => setOpen(true)}>
          Solve
        </Button>

        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="m ">
            <h2>{title}</h2>
            <p>{description}</p>
            <input
            type="text"
            className="p-2 m-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {/*  </Link> */}
          </div>
        </Modal>
      </div>
    );
  };

  export default ChallengeCard;
