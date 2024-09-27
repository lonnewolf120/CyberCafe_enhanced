const express = require("express");
const { connection } = require("../database/database.js");
const {
  submit,
  allcontests,
  challenges,
  addContest,
  leaderboard,
  addChallenge,
  getSubmission,
} = require("../controllers/contests2.js");
const router = express.Router();

// Middlewares
const { auth, isAdmin, isInstructor, isStudent } = require('../middleware/auth')

const {contestSearch} =  require("../controllers/search.js");

// Contest Routes
router.post("/search", contestSearch);

router.post("/submit", auth, submit);

router.get("/leaderboard/:cid", leaderboard);

router.get("/all-contests", auth, allcontests);

router.get("/submissions/:userId", auth, getSubmission);

router.get("/:contestID/challenges", auth, challenges);

router.post("/add-contest", auth, addContest);

router.post("/add-challenge", auth, isAdmin, addChallenge);

module.exports = router;
