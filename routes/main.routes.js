const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    console.log(req.query);
    if (req.query.username == 'ian' && req.query.password == '123') {
        let user = {
            username: req.query.username,
            password: req.query.password
        }
        res.render('sesion', { user });
    } else {
        res.render('login')
    }
});

router.get('/sesion', (req, res) => {
    let user = req.session.usuario;
    res.render('sesion', { user });
});

module.exports = router;