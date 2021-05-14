const express = require('express');
const router = express.Router();
const db = require('../database')
const jwt = require('jsonwebtoken');


// Authorization: Bearer <token>
function ensureToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader === undefined) {
        res.redirect('/api/not_allowed');
    } else {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
}

router.get('/', (req, res) => {
    res.render('Global/login');
});

router.post('/login', (req, res) => {
    db.query("call obtener_usuario(?,?)", 
    [req.body.username, req.body.password], 
    (error, rows, fields) => {
        if (!error) {
            if (rows[0].length !== 0) {
                let user = createUser(rows[0]) 
                req.session.usuario = user
                res.redirect('/home/show');
            } else {
                let error = { status: 404 }
                res.render('Global/login', { error });
            }
        } else {
            let error = { status: 404 }
            res.render('Global/login', { error });
        }
    })
});


router.get('/sesion', ensureToken, (req, res) => {
    let user = req.session.usuario;
    var decoded = jwt.decode(req.token);
    // get the decoded payload and header
    var decoded = jwt.decode(req.token, { complete: true });
    console.log(decoded.payload);
    res.render('sesion', { user });
});

router.get('/register/show', (req, res) => {
    res.render('register');
});

router.post('/register/insert', (req, res) => {

    db.query("call insertar_usuario(?,?,?)", [req.body.email, req.body.name, req.body.password], (error, rows, fields) => {
        if (!error) {
            let user = {
                name: req.body.name,
                email: req.body.email
            }
            console.log(user)
            req.session.usuario = user;
            res.send({ status: 200 })
        } else {
            res.send({ status: 500 })
        }
    })
});

router.get('/home/show', (req, res) => {
    if(req.session.usuario){
        let currentDate = new Date();
        var ciclo = (currentDate.getMonth() <= 5) ? 1 : 2;
        var opiniones = [];
        var cursos = [];
        let user = req.session.usuario;

        db.query("call obtener_opiniones_cursos_seguidos_actual(?,?)", [user.id_usuario, ciclo], (errorOpiniones, opinionRows, fields) => {
            if (!errorOpiniones) {
                opiniones = opinionRows[0];
                db.query("call obtener_cursos_estudiante_actual(?,?)", [user.id_usuario, ciclo],  (errorCursos, cursosRows, fields) => {
                    if (!errorCursos) {
                        cursos = cursosRows[0];
                        console.log(cursos)
                        res.render('estudiante/home', { opiniones, cursos, user });
                    } else {
                        console.log(errorCursos)
                        res.send({ status: 500 })
                    }
                })            
            } else {
                console.log(errorOpiniones)
                res.send({ status: 500 })
            }
        })
    }else{
        res.render('Global/login');
    }
    
});


router.get('/cursos', (req, res) => {
    let user = req.session.usuario;
    console.log(user)
    res.render('estudiante/cursos', { user });
});

router.get('/perfil', (req, res) => {
    let user = req.session.usuario;
    console.log(user)
    res.render('estudiante/Perfil', { user });

});

router.get('/buscar', (req, res) => {
    let user = req.session.usuario;
    console.log(user)
    res.render('Global/buscar', { user });

});

router.get('/traerCursos', (req, res) => {
    db.query("call obtener_cursos();", (error, rows, fields) => {
        if (!error) {
            let cursos = rows[0];
            res.send(cursos);
        } else {
            console.log(error)
            res.send({ status: 500 })
        }
    })
});

function createUser(rows){
    let jsonRows = JSON.stringify(rows[0])
    let user = JSON.parse(jsonRows)
    return user;
}

router.get('/profe/show', (req, res) => {
    res.render('profesor/perfilProfesor');
});

router.get('/misCursos',(req,res)=>{
    let user = req.session.usuario;
    db.query('call obtener_cursos_estudiante(?);',[user.id_usuario],(err,rows,fields)=>{
        if(!err){
            let cursos = rows[0];
            res.render('estudiante/misCursos',{cursos});
        }
        else{
            res.send({status: 500});
        }
    })
})

module.exports = router;
