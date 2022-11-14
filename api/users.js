const express = require('express');
const router = express.Router();
const { createUser, getUser, getUserByUsername } = require("../db")
const jwt = require("jsonwebtoken");
const { requireUser } = require('./utils')

// POST /api/users/login

// POST /api/users/register

// GET /api/users/me
router.get("/me", requireUser, async (req,res,next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error);
    }
})
// GET /api/users/:username/routines

module.exports = router;
