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

    console.log(routines);
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
      await client.query(`
      INSERT INTO routine_activities ("routineId", "activityId",duration,count)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT ("routineId", "activityId") DO NOTHING;
      `, [routineId, activityId, duration, count]);
    } catch (error) {
      throw error;
    }
}
async function getRoutineActivitiesByRoutine({id}) {

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
}

async function canEditRoutineActivity(routineActivityId, userId) {
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
