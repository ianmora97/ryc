const express = require('express');
const router = express.Router();
const db = require('../database')
const jwt = require('jsonwebtoken');
const chalk = require('chalk');

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

router.get('/logout', (req, res) => { //logout
    if (req.session.usuario) {
        req.session.destroy((err) => {
            console.log('[', chalk.green('OK'), ']', 'Session Cerrada');
            res.render('Global/login');
        })
    } else {
        res.render('Global/login');
    }
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
    res.render('Global/register');
});
router.post('/cambiarfotoperfil', (req, res) => {
    if (req.session.usuario) {
        db.query('call update_imagen_perfil_usuario(?, ?)',
            [req.body.id_usuario, req.file.filename], (err, rows, fields) => {
                req.session.usuario.imagen_perfil = req.file.filename;
                if(req.session.usuario.rol == 0){
                    res.redirect('/perfil');
                }else{
                    res.redirect('/perfil/show');
                }
            });
    } else {
        res.redirect('/');
    }
});
router.get('/curso/detalle', (req, res) => {
    let user = req.session.usuario;
    if (req.session.usuario) {
        db.query("call obtener_curso_id(?)", [parseInt(req.query.id_curso)],
            (errorCurso, cursoRow, fields) => {
                console.log(errorCurso)
                if (!errorCurso) {
                    let curso = JSON.parse(JSON.stringify(cursoRow[0][0]))
                    console.log(user)
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
    } else {
        res.render('Global/login');
    }
});

router.get('/grupo/seguirGrupo', (req, res) => {
    if (req.session.usuario) {
        db.query("call insert_cursoEstudiante(?,?,?)", [req.query.user, req.query.id, 1],
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
    } else {
        res.render('Global/login');
    }
});

router.post('/register/insert', (req, res) => {
    console.log(req.body)
    db.query("call insertar_usuario(?,?,?,?)",
        [req.body.email, req.body.name, req.body.username, req.body.password],
        (error, rows, fields) => {
            if (!error) {
                res.render('Global/login', {
                    register: "1",
                    correo: req.body.email,
                    clave: req.body.password
                });
            } else {
                res.render('Global/register', {
                    err: "No se pudo registrar"
                });
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
                        db.query("call obtener_anuncios()", [],
                        (error, anunciosRows, fields) => {
                            if (!error) {
                                anuncios = anunciosRows[0];
                                console.log(anuncios)
                                res.render('estudiante/home', {
                                    pag: 'Feed',
                                    opiniones,
                                    cursos,
                                    anuncios,
                                    user
                                });
                            } else {
                                res.send({
                                    status: 500
                                })
                            }
                        })
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
        pag: 'Cursos',
        user
    });
});

router.get('/survey', (req, res) => {
    db.query("call obtener_encuesta_token(?)", [req.query.token],
        (error, rows, fields) => {
            if (!error) {
                let encuesta = rows[0][0];
                res.render('Global/ResponderEncuesta', {
                    encuesta
                });
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
    if (req.session.usuario) {
        if (req.session.usuario.rol == 1) {
            let user = req.session.usuario;
            res.render('profesor/encuestas', {
                pag: 'Encuestas',
                user
            });
        } else {
            res.render('Global/login');
        }
    } else {
        res.render('Global/login');
    }
});

router.get('/api/encuestas', (req, res) => {
    if (req.session.usuario) {
        if (req.session.usuario.rol == 1) {
            db.query("call obtener_encuestas(?)", [req.query.id],
                (error, rows, fields) => {
                    if (!error) {
                        res.send(rows[0])
                    } else {
                        res.send(error)
                    }
                })
        } else {
            res.render('Global/login');
        }
    } else {
        res.render('Global/login');
    }
});

router.get('/api/encuestas/respuesta', (req, res) => {
    if (req.session.usuario) {
        if (req.session.usuario.rol == 1) {
            db.query("call obtener_respuestas_encuesta_all()",
                (error, rows, fields) => {
                    if (!error) {
                        res.send(rows[0])
                    } else {
                        res.send(error)
                    }
                })
        } else {
            res.render('Global/login');
        }
    } else {
        res.render('Global/login');
    }
});

router.get('/insertar/encuesta', (req, res) => {
    if (req.session.usuario) {
        if (req.session.usuario.rol == 1) {
            let text = req.query;
            jwt.sign({
                text
            }, 'secretKeyToken', (err, token) => {
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
        } else {
            res.render('Global/login');
        }
    } else {
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
                        pag: 'Perfil',
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
        pag: 'Opinion',
        user
    });
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
        console.log(user)
        db.query("call obtener_profesor_id(?)", [user.id_usuario], (error, rows, fields) => {
            if (!error) {
                perfil = rows[0][0];
                res.render('profesor/perfilProfesor', {
                    pag: 'Perfil',
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
                    pag: 'Cursos',
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
            pag: 'Cursos',
            user
        });
    } else {
        res.render('Global/login');
    }
});

router.get('/paquetes/show', (req, res) => {
    if (req.session.usuario) {
        let user = req.session.usuario;
        res.render('Global/paquetes', {
            pag: 'Cursos',
            user
        });
    } else {
        res.render('Global/login');
    }
});


router.put('/cursos/guardarOpinion', (req, res) => {
    console.log(req.body)
    usuario_id = req.body.id
    if (req.body.id == "") {
        usuario_id = null
    }
    db.query("call insert_opinion(?,?,?,?,?,?)", [usuario_id, req.body.grupo, 0, req.body.opinion, 0, 1], (error, rows, fields) => {
        console.log(usuario_id)
        if (!error) {
            res.send({
                status: 200
            })
        } else {
            console.log(error);
            res.send({
                status: 500
            })
        }
    });
});

router.get('/api/gruposPorCurso', (req, res) => {
    if (req.session.usuario) {
        db.query("call obtener_grupos_curso(?)", [req.query.id],
            (error, rows, fields) => {
                if (!error) {
                    res.send(rows[0])
                } else {
                    res.send(error)
                }
            })
    } else {
        res.render('Global/login');
    }
});

router.put('/paquetes/compra', (req, res) => {
    let user = req.session.usuario;
        if (req.session.usuario) {
            console.log(req.body.numPaquete)
        db.query("call insert_tokens(?,?)", [user.id_usuario, req.body.numPaquete],
            (error, rows, fields) => {
                if (!error) {
                    console.log("MONEDEROOOO!! => ", rows[0])
                    req.session.usuario.monedero = rows[0][0].monedero
                    res.send({monedero: req.session.usuario.monedero})
                } else {
                    res.send(error)
                }
            })
    } else {
        res.render('Global/login');
    }

});


module.exports = router;