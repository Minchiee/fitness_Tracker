/* eslint-disable no-useless-catch */
const client = require("./client");
const bcrypt = require("bcrypt");
// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)

  try {
    const { rows: [user] } = await client.query(`
  INSERT INTO users(username, password)
  VALUES ($1, $2)
  ON CONFLICT (username) DO NOTHING
  RETURNING *;
  `, [username, password]);

  return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUserName(username);
  const hashedPassword = user.password;
// isValid will be a boolean based on wether the password matches the hashed password
  const isValid = await bcrypt.compare(password, hashedPassword)
}

async function getUserById(userId) {
try {
  const { rows: [user] } = await client.query(`
  SELECT (username)
  FROM users
  WHERE id=${userId}
  `);

  if (!user) {
    return null
  }
  console.log(user)
  return user;
} catch (error) {
  throw error;
}
}

async function getUserByUsername(userName) {
  try { 
    const { rows: [user] } = await client.query(`
    SELECT *
    FROM users
    WHERE username=$1;
    `, [username]);
    return user;
  } catch (error) {
    throw error;
  }

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
