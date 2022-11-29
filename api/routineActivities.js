const express = require('express');
const router = express.Router();
const { getRoutineActivityById, getRoutineById, updateRoutineActivity, destroyRoutineActivity } = require('../db');
const { requireUser } = require('./utils')

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const routineActivityId = req.params.routineActivityId
        const routineActivity = await getRoutineActivityById(routineActivityId)
        if (routineActivity) {
            const routine = await getRoutineById(routineActivity.routineId)
            if (req.user.id === routine.creatorId) {
                const fields = req.body
                const updatedActivity = await updateRoutineActivity({id: routineActivityId, ...fields})
                res.send(updatedActivity)
            } else {
                next({
                    error: "error",
                    name: 'UnauthorizedUser',
                    message: `User ${req.user.username} is not allowed to update.`
                })
            }
        } else {
            next({
                name: 'RoutineActivityNotFound',
                message: `Routine Activity ${routineActivityId} was not found`
            })
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})
// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const routineActivityId = req.params.routineActivityId
        const routineActivity = await getRoutineActivityById(routineActivityId)
        if (routineActivity) {
            const routine = await getRoutineById(routineActivity.routineId)
            if (req.user.id === routine.creatorId) {
                const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId)
                res.send(deletedRoutineActivity)
            } else {
                res.status(403)
                next({
                    error: 'explosion',
                    name: 'UnauthorizedUser',
                    message: `User ${req.user.username} is not allowed to delete ${routine.name}`
                })
            }
        } else {
            next({
                name: 'RoutineActivityNotFound',
                message: `Routine Activity ${routineActivityId} was not found`
            })
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
})
module.exports = router;
