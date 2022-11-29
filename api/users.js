const express = require('express');
const router = express.Router();
const { createUser, getUserByUsername, getPublicRoutinesByUser, getAllRoutinesByUser, getUser } = require("../db")
const jwt = require("jsonwebtoken");
const { requireUser } = require('./utils')
const { JWT_SECRET } = process.env;

router.use((req, res, next) => {
    console.log("A request has been made to users...")
    next();
})

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
        const user = await getUser({ username, password })
        
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
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    if (password.length < 8) {
        next({
            error: 'short',
            message: "Password is less than 8 letters.",
            name: "PasswordIncomplete",
        })
    }

    try {
        const _user = await getUserByUsername(username)

        if (_user) {
            next({
                error: "error",
                name: 'UserTakenError',
                message: `User ${username} is already taken.`
            });
        } else {
            const createdUser = await createUser({ username, password });

            const token = jwt.sign(createdUser, process.env.JWT_SECRET, { expiresIn: '1w' })

            res.send({
                message: 'Thank you for signing up!',
                token,
                user: createdUser
            });
        }
    } catch ({ name, message }) {
        next({
            name,
            message
        });
    }

})
// GET /api/users/me
router.get('/me', requireUser, async (req, res) => {
    res.send(req.user)
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
