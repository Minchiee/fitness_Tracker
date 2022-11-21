/* eslint-disable no-useless-catch */
const client = require('./client')

async function getRoutineActivityById(id){
  try {
    const {
      rows: [routines],
    } = await client.query(`
  SELECT *
  FROM routine_activities
  WHERE id=${id};
  `);

    return routines;
  } catch (error) {
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(`
      
        INSERT INTO routine_activities( "routineId", "activityId", count, duration)
        VALUES ($1,$2,$3,$4)
        RETURNING *;
        `,
      [routineId, activityId, count, duration]
    );
    return routine_activity;
  } catch (error) {
    console.log(error)
  }
}

async function getRoutineActivitiesByRoutine({id}) {
  try {
    const {rows: [routines],
    }= await client.query(`
    SELECT routine_activities.*
    FROM routine_activities
    JOIN routines
    ON routines.id = routine_activities.id
    WHERE "creatorId"=${id}
    `);

    return routines;
  } catch (error) {
    throw error;
  }

}

async function updateRoutineActivity ({id, ...fields}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

    if (setString.length === 0) {
      return;
    }

    try {
      const {
        rows: [routine],
      } = await client.query(
        `
        UPDATE routine_activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
        
      return routine;
    } catch (error) {
      throw error;
    }
}

async function destroyRoutineActivity(id) {
  const {rows: [deletedRoutineActivity]} = await client.query(`
  DELETE FROM routine_activities
  WHERE id=${id}
  RETURNING *
  ;`)
  return deletedRoutineActivity
}

async function canEditRoutineActivity(routineActivityId, userId) {
  const {rows: [checkedRoutineActivity]} = await client.query(`
    SELECT "creatorId"
    FROM routines
    WHERE id IN (SELECT "routineId" FROM routine_activities WHERE id=${routineActivityId})
  ;`)

  return checkedRoutineActivity.creatorId === userId
}
module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
