/* eslint-disable no-cond-assign */
const express = require("express");
const router = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityById,
  updateActivity,
  getActivityByName,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines
router.get(`/:activityId/routines`, requireUser, async (req, res, next) => {});

// GET /api/activities
router.get("/", async (req, res, next) => {
  const postData = {};

  try {
    const activities = await getAllActivities(postData);
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const activities = await createActivity({ name, description });
    res.send(activities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params.activityId;
  const { name, description } = req.body;

  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }

  if (description) {
    updateFields.description = description;
  }

  try {
    const updatedActivity = await updateActivity({
      id: activityId,
      updateFields,
    });
    console.log("hello");
    res.send({ updatedActivity });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
