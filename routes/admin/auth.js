const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireEmailExist,
    requireValidPasswordForUser
    } = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({req: req}));
});


router.post('/signup',
    [requireEmail, requirePassword, requirePasswordConfirmation],
    handleErrors(signupTemplate),

    async (req, res) => {
        const { email, password } = req.body;

        // Create a user in our repo to represent this person
        const user = await usersRepo.create({email: email, password: password});

        // Store the id of that user inside the users cookie
        req.session.userId = user.id;

        res.send('Account created');
})

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});

router.post('/signin',
    [requireEmailExist, requireValidPasswordForUser],
    handleErrors(signinTemplate),
    async (req, res) => {
        const { email } = req.body;
        const user = await usersRepo.getOneBy({email: email});
        req.session.userId = user.id;
        res.send('You are signed in!!!')
});

module.exports = router;