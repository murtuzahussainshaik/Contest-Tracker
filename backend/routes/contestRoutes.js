const express = require("express");
const { getAllContests } = require("../controllers/contestController");

const router = express.Router();

router.get("/", getAllContests);

module.exports = router;
