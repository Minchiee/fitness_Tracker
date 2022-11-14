/* eslint-disable no-useless-catch */
const { attachActivitiesToRoutines } = require('./activities');
const client = require('./client');

async function getRoutineById(id){
  try {
    const {rows:[routines],
    } = await client.query(`
    SELECT *
    FROM routines
    WHERE id=${id};
    `
    );

    return routines;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities(){
  try {
    const {rows: [routines],} = await client.query(`
    SELECT *
    FROM routines;
    `);

    return routines
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const {rows} = await client.query(`
    SELECT routines.*, username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    `);
    return attachActivitiesToRoutines(rows)
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({username}) {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId"=users.id
    WHERE username=$1
    `,[username])

    return attachActivitiesToRoutines(rows)
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({username}) {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId"=users.id
    WHERE username=$1 AND "isPublic"=true
    `,[username])

    return attachActivitiesToRoutines(rows)
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    WHERE "isPublic"=true
    `);
    
    return attachActivitiesToRoutines(rows)
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({id}) {
  try {
    const {rows} = await client.query(`
    SELECT routines.*, username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    JOIN routine_activities
    ON routine_activities."routineId" = routines.id
    WHERE "isPublic"=true AND routine_activities."activityId" = $1
    `, [id]);

    return attachActivitiesToRoutines(rows)
  } catch (error) {
    throw error;
  }
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  try {
    const {rows:[routines],
    } = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [creatorId, isPublic, name, goal]);

    return routines;
  } catch (error) {
    throw error;
  }

}

async function updateRoutine({id, ...fields}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      UPDATE routines
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

async function destroyRoutine(id) {
  try {
    const { rows } = await client.query(`
DELETE * FROM routines WHERE id=${id}
    `, [id])



    return rows
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}