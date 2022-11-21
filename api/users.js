const express = require('express');
const router = express.Router();
const { createUser, getUserByUsername, getPublicRoutinesByUser, getAllRoutinesByUser } = require("../db")
const jwt = require("jsonwebtoken");
const { requireUser } = require('./utils')
const { JWT_SECRET } = process.env;


// POST /api/users/login
router.post(`/login`, async (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }
    try {
        const user = await getUserByUsername(username);
        
        if (user && user.password == password) {
            const token = jwt.sign({username, id:user.id}, JWT_SECRET)
            res.send({ message:"you're logged in!", token, user});
        } else {
            next({
                name: `IncorrectCredentialsError`,
                message: `Username or password is incorrect`
            });
        }
        
    } catch (error) {
        next(error);
    }
})

// POST /api/users/register
router.post(`/register`, async (req, res, next) => {
    const { username, password} = req.body;

    try {
        if(password.length < 8){
            next({
                name: `PasswordLengthError`,
                message: `Password Too Short!`
            });
        }

    const _user = await getUserByUsername(username);

    if (_user) {
        next({
            name: `UserExistsError`,
            message: `User ${username} is already taken.`
        });
    }
    const user = await createUser({
        username,
        password
    });
    const token = jwt.sign({
        id: user.id,
        username
    }, JWT_SECRET, {
        expiresIn: `1w`
    });
    res.send({
        message: "thank you for signing up",
        token, user
    });
}catch ({ name, message }) {
    next({ name , message })
}
})
// GET /api/users/me
router.get("/me", requireUser, async (req,res,next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error);
    }
})
// GET /api/users/:username/routines
router.get("/:username/routines", requireUser, async (req, res, next) =>{
    try {
        const username = req.params.username
        if (req.user && username === req.user.username) {
            const routines = await getAllRoutinesByUser({ username })
            res.send(routines)
        } else {
            const routines = await getPublicRoutinesByUser({ username })
            res.send(routines)
        }

    } catch ({ name, message }) {
        next({ name, message })
    }
})

module.exports = router;
