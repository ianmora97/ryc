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
        [req.body.username, req.body.clave],
        (error, rows, fields) => {
            if (!error) {
                if (rows[0].length !== 0) {
                    let user = createUser(rows[0])
                    req.session.usuario = user;
                    if (user.rol == 1) {
                        res.redirect('/profe/show');
                    } else {
                        res.redirect('/home/show');
                    }

                } else {
                    let error = {
                        status: 404
                    }
                    res.render('Global/login', {
                        error
                    });
                }
            } else {
                
                let error = {
                    status: 404
                }
                res.render('Global/login', {
                    error
                });
            }
        })
});


router.get('/sesion', ensureToken, (req, res) => {
    let user = req.session.usuario;
    var decoded = jwt.decode(req.token);
    // get the decoded payload and header
    var decoded = jwt.decode(req.token, {
        complete: true
    });
    console.log(decoded.payload);
    res.render('sesion', {
        user
    });
});

router.get('/register/show', (req, res) => {
    res.render('register');
});

router.get('/curso/show', (req, res) => {
    let user = req.session.usuario;
    console.log(req.query.id_curso)
    db.query("call obtener_curso_id(?)", [req.query.id_curso],
        (errorCurso, cursoRow, fields) => {
            let curso = JSON.parse(JSON.stringify(cursoRow[0][0]))

            if (!errorCurso) {
                db.query("call obtener_opiniones_curso(?)", [req.query.id_curso],
                    (errorOpiniones, opinionesRows, fields) => {
                        console.log("opiniones del curso:" + opinionesRows[0])
                        if (!errorOpiniones) {
                            let opiniones = opinionesRows[0]
                            res.render('Global/detalle', {
                                curso,
                                opiniones,
                                user
                            });
                        } else {
                            console.log(errorCurso)
                            res.send({
                                status: 500
                            })
                        }
                    });
            } else {
                console.log(errorCurso)
                res.send({
                    status: 500
                })
            }
        });
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
            res.send({
                status: 200
            })
        } else {
            res.send({
                status: 500
            })
        }
    })
});

router.get('/home/show', (req, res) => {
    if (req.session.usuario) {
        let currentDate = new Date();
        var ciclo = (currentDate.getMonth() <= 5) ? 1 : 2;
        var opiniones = [];
        var cursos = [];
        let user = req.session.usuario;

        db.query("call obtener_opiniones_cursos_seguidos_actual(?,?)", [user.id_usuario, ciclo], (errorOpiniones, opinionRows, fields) => {
            if (!errorOpiniones) {
                opiniones = opinionRows[0];
                db.query("call obtener_cursos_estudiante_actual(?,?)", [user.id_usuario, ciclo], (errorCursos, cursosRows, fields) => {
                    if (!errorCursos) {
                        cursos = cursosRows[0];
                        res.render('estudiante/home', {
                            pag:'Feed',
                            opiniones,
                            cursos,
                            user
                        });
                    } else {
                        console.log(errorCursos)
                        res.send({
                            status: 500
                        })
                    }
                })
            } else {
                console.log(errorOpiniones)
                res.send({
                    status: 500
                })
            }
        })
    } else {
        res.render('Global/login');
    }

});


router.get('/cursos', (req, res) => {
    let user = req.session.usuario;
    res.render('estudiante/cursos', {
        pag:'Cursos',
        user
    });
});

router.get('/survey', (req, res) => {
    db.query("call obtener_encuesta_token(?)", [req.query.token], 
    (error, rows, fields) => {
        if (!error) {
            let encuesta = rows[0][0];
            res.render('Global/ResponderEncuesta',{encuesta});
        } else {
            res.send(error)
        }
    })
});

router.get('/agregar/survey', (req, res) => {
    db.query("call insert_respuesta(?,?,?)", [req.query.correo, req.query.respuesta, req.query.id], 
    (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else {
            res.send(error)
        }
    })
});

router.get('/encuestas', (req, res) => {
    if(req.session.usuario){
        if(req.session.usuario.rol == 1){
            let user = req.session.usuario;
            res.render('profesor/encuestas', {
                pag:'Encuestas',
                user
            });
        }else{
            res.render('Global/login');
        }
    }else{
        res.render('Global/login');
    }
});

router.get('/api/encuestas', (req, res) => {
    if(req.session.usuario){
        if(req.session.usuario.rol == 1){
            db.query("call obtener_encuestas(?)", [req.query.id], 
            (error, rows, fields) => {
                if (!error) {
                    res.send(rows[0])
                } else {
                    res.send(error)
                }
            })
        }else{
            res.render('Global/login');
        }
    }else{
        res.render('Global/login');
    }
});

router.get('/api/encuestas/respuesta', (req, res) => {
    if(req.session.usuario){
        if(req.session.usuario.rol == 1){
            db.query("call obtener_respuestas_encuesta_all()",
            (error, rows, fields) => {
                if (!error) {
                    res.send(rows[0])
                } else {
                    res.send(error)
                }
            })
        }else{
            res.render('Global/login');
        }
    }else{
        res.render('Global/login');
    }
});

router.get('/insertar/encuesta', (req, res) => {
    if(req.session.usuario){
        if(req.session.usuario.rol == 1){
            let text = req.query;
            jwt.sign({text},'secretKeyToken',(err,token)=>{
                db.query("call insert_encuesta(?,?,?,?)", [req.query.codigo, req.query.encuesta, req.query.titulo, token], 
                (error, rows, fields) => {
                    if (!error) {
                        res.send({
                            status: 200
                        })
                    } else {
                        console.log(error)
                        res.send({
                            status: 500
                        })
                    }
                })
            });
        }else{
            res.render('Global/login');
        }
    }else{
        res.render('Global/login');
    }
});

router.get('/perfil', (req, res) => {
    if (req.session.usuario) {
        let user = req.session.usuario;
        db.query("call obtener_estudiante_id(?)", [user.id_usuario],
            (error, rows, fields) => {
                if (!error) {
                    let perfil = rows[0][0];
                    console.log(perfil)
                    res.render('estudiante/Perfil', {
                        pag:'Perfil',
                        perfil,
                        user
                    });
                } else {
                    res.send({
                        status: 500
                    })
                }
            })
    } else {
        res.render('Global/login');
    }
});

router.get('/buscar', (req, res) => {
    let user = req.session.usuario;
    console.log(user)
    res.render('Global/buscar', {
        user
    });

});

router.get('/opinion', (req, res) => {
    let user = req.session.usuario;
    res.render('Global/buscar', { 
        pag:'Opinion',
        user });
});

router.get('/traerCursos', (req, res) => {
    db.query("call obtener_cursos();", (error, rows, fields) => {
        if (!error) {
            let cursos = rows[0];
            res.send(cursos);
        } else {
            console.log(error)
            res.send({
                status: 500
            })
        }
    })
});

function createUser(rows) {
    let jsonRows = JSON.stringify(rows[0])
    let user = JSON.parse(jsonRows)
    return user;
}

router.get('/profe/show', (req, res) => {
    if (req.session.usuario) {
        let user = req.session.usuario;

        db.query("call obtener_profesor_id(?)", [user.id_usuario], (error, rows, fields) => {
            if (!error) {
                perfil = rows[0][0];
                res.render('profesor/perfilProfesor', {
                    pag:'Perfil',
                    perfil,
                    user
                });
            } else {
                console.log(error)
                res.send({
                    status: 500
                })
            }
        })
    } else {
        res.render('Global/login');
    }
})

router.get('/misCursos', (req, res) => {
    if (req.session.usuario) {
        let user = req.session.usuario;
        db.query('call obtener_cursos_estudiante(?);', [user.id_usuario], (err, rows, fields) => {
            if (!err) {
                let cursos = rows[0];
                res.render('estudiante/cursos', {
                    pag:'Cursos',
                    cursos
                });
            } else {
                res.send({
                    status: 500
                });
            }
        })
    } else {
        res.render('Global/login');
    }
})

router.get('/cursos/show', (req, res) => {
    if (req.session.usuario) {
        let user = req.session.usuario;
        console.log(user)
        res.render('estudiante/cursos', { 
            pag:'Cursos',
            user });
    } else {
        res.render('Global/login');
    }
});

router.get('/cursos/guardarOpinion', (req, res) => {
    db.query("call insert_opinion(?,?,?,?,?,?)", [req.query.id, req.query.grupo, 0, req.query.opinion, 0, 1], (error, rows, fields) => {
        if (!error) {
            console.log("SE GUARDO LA OPINION ==================================================")
            res.send({
                status: 200
            })
        }else{
            console.log(error);
            console.log("NOOOOOOOOOOOO SE GUARDO LA OPINION ==================================================")
            res.send({
                status: 500
            })
        }
    });
});

module.exports = router;    