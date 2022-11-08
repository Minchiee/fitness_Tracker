/* eslint-disable no-useless-catch */
const client = require('./client');

async function getRoutineById(id){
  try {
    const {rows:[user],
    } = await client.query(`
    INSERT INTO routine(id)
    VALUES($1)
    RETURNING *;
    `,
    [id]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities(){
}

async function getAllRoutines() {
}

async function getAllRoutinesByUser({username}) {
}

async function getPublicRoutinesByUser({username}) {
}

async function getAllPublicRoutines() {
}

async function getPublicRoutinesByActivity({id}) {
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  try {
    const {rows:[user],
    } = await client.query(`
    INSERT INTO routine("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [creatorId, isPublic, name, goal]);

    return user;
  } catch (error) {
    throw error;
  }

}

async function updateRoutine({id, ...fields}) {
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