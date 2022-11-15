const express = require('express');
const router = express.Router();
const { getAllActivities, createActivity } = require("../db")
const { requireUser } = require('./utils')



// GET /api/activities/:activityId/routines

// GET /api/activities
router.get('/', async (req, res, next) =>{
    const postData = {};

    try {
        const activities = await getAllActivities(postData);
        res.send(activities);
    } catch (error) {
        next(error);
    }
});
// POST /api/activities
router.post('/', async (req, res, next) => {
    try {
        const create = await createActivity();
        
        res.send({ create })
    } catch (error) {
        next (error);
    }
})


// PATCH /api/activities/:activityId

module.exports = router;
