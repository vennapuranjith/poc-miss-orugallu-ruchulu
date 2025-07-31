const express = require("express");
const { validateUser, registerUser, loginUser } = require("../controllers/userController");
const router = express.Router();

router.post("/signup", validateUser, registerUser);
router.post("/login", loginUser);

module.exports = router;
