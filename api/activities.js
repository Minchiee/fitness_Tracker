const express = require('express');
const router = express.Router();
const { getAllActivities } = require("../db")
const { requireUser } = require('./utils')

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get('/activities', async (req, res, next) =>{
    try {
        console.log("hello");
        const activities = await getAllActivities();
        console.log(activities);
        res.send(activities);
    } catch (error) {
        next(error);
    }
});
// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
