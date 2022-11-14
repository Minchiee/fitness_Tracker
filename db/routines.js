/* eslint-disable no-useless-catch */
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
    SELECT * FROM routines;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({username}) {
  try {
    const { rows: [routinesUser], } = await client.query(`
    SELECT username
    FROM routines
    WHERE "authorId"=${ username }
    `)

    const routines = await Promise.all(routinesUser.map(
      routine => getRoutineById()
    ))
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({username}) {
}

async function getAllPublicRoutines() {
}

async function getPublicRoutinesByActivity({id}) {
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