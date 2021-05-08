-- =============================================================================
--                              USUARIOS
-- =============================================================================

-- ? INSERT
delimiter //
CREATE PROCEDURE `insertar_usuario`(in p_correo varchar(100), in p_nombre varchar(250), in p_clave varchar(100))
BEGIN
	insert into Usuario values (0, p_correo, p_nombre, p_clave);
END//

-- ? SELECT
delimiter //
CREATE PROCEDURE `obtener_usuario`(in p_correo varchar(100), in p_clave varchar(100))
begin
    select id_usuario, correo, nombre, clave from Usuario
    where correo = p_correo 
    and clave = p_clave;
END//



-- =============================================================================
--                              ESTUDIANTES
-- =============================================================================

-- ? INSERT
delimiter //
CREATE PROCEDURE `insert_estudiante` (in p_id_usuario INT(11), in p_carrera varchar(150))
BEGIN
	insert into Estudiante(id_usuario,carrera) values (p_id_usuario,p_carrera);
	commit;
END//

-- =============================================================================
--                              PROFESORES
-- =============================================================================

-- ? INSERT
delimiter //
CREATE PROCEDURE `insert_profesor` (in p_id_usuario INT(11), in p_titulo varchar(150))
BEGIN
	insert into Profesor(id_usuario, titulo, annio_ingreso) 
    values (p_id_usuario, p_titulo , CURDATE());
	commit;
END//


-- =============================================================================
--                              CARRERA
-- =============================================================================

-- ? INSERT
delimiter //
CREATE PROCEDURE `insert_carrera` (in p_codigo INT(10), in p_nombre varchar(150))
BEGIN
	insert into Carrera(codigo,nombre) 
	VALUES(p_codigo,p_nombre); 
	commit;
END//


-- =============================================================================
--                              CURSOS
-- =============================================================================

-- ? INSERT
delimiter //
CREATE PROCEDURE `insert_curso` (in p_codigo_curso INT(10), in p_carrera varchar(10),in p_nombre varchar(150), in p_carta varchar(50), in p_creditos INT(11), in p_descripcion varchar(255), in p_universidad varchar(100))
BEGIN
insert into Cursos (codigo_curso,carrera, nombre, carta, creditos,descripcion,universidad) 
	VALUES 
	(p_codigo_curso,p_carrera,p_nombre,p_carta,p_creditos,p_descripcion,p_universidad);
	commit;
END//

-- ? SELECT TODOS
delimiter //
CREATE PROCEDURE `obtener_cursos`()
begin
    select codigo_curso,carrera, nombre, carta, creditos,descripcion,universidad from cursos;
END//

-- ? SELECT ESPECIFICO
delimiter //
CREATE PROCEDURE `obtener_curso`(IN p_codigo_curso INT(11))
begin
    select codigo_curso,carrera, nombre, carta, creditos,descripcion,universidad
    from cursos
    where codigo_curso = p_codigo_curso;
END//

-- =============================================================================
--                              GRUPO
-- =============================================================================

-- ? INSERT
delimiter //
CREATE PROCEDURE `insert_grupo` (in p_codigo_curso INT(11) ,in p_id_profesor INT(11),in p_nrc INT(11),in p_ciclo INT(11),in p_annio INT(11),in p_cantidad_semanas INT(11))
BEGIN
	insert into Grupo (codigo_curso, id_profesor, nrc, ciclo, annio, cantidad_semanas) 
    VALUES (p_codigo_curso,p_id_profesor,p_nrc, p_ciclo,p_annio,p_cantidad_semanas);
	commit;
END//


-- =============================================================================
--                              CURSOS DE ESTUDIANTE
-- =============================================================================

-- ? INSERT
delimiter //
CREATE PROCEDURE `insert_cursoEstudiante` (in p_id_usuario INT(11) ,in p_id_grupo INT(11),in p_estado INT(11))
BEGIN
	insert into CursoEstudiante (id_usuario, id_grupo, estado) 
    VALUES (p_id_usuario, p_id_grupo, p_estado);
	commit;
END//

-- ? SELECT COMPLETO DE CURSOS DE UN ESTUDIANTE
delimiter //
CREATE PROCEDURE `obtener_cursos_estudiante`(IN p_id_usuario INT(11))
BEGIN
    select g.id_grupo, ce.estado estado_grupo , cur.codigo_curso, car.nombre nombre_carrera , cur.nombre curso_nombre,
    cur.carta ruta_carta, cur.creditos, cur.descripcion curso_descripcion , cur.universidad, pUsuario.nombre nombre_profesor
    from CursoEstudiante ce
    inner join Grupo g on ce.id_grupo = g.id
    inner join Cursos cur on g.codigo_curso = cur.codigo_curso
	inner join Carrera car on car.codigo= cur.carrera
	inner join Profesor p on g.id_profesor = p.id_usuario
    inner join Uuuario pUsuario on p.id_usuario= pUsuario.id_usuario
    where ce.id_usuario = p_id_usuario;
END//

-- =============================================================================
--                              OPINIONES
-- =============================================================================
-- ? INSERT
delimiter //
CREATE PROCEDURE `insert_opinion` (in p_id_usuario INT(11), in p_id_grupo INT(11),in p_calificacion DOUBLE,in p_comentario VARCHAR(350),in p_semana INT(11),in p_anonimo INT(11))
BEGIN
	insert into Opinion (id_usuario, id_grupo,calificacion,comentario,fecha,semana,anonimo)
	VALUES(p_id_usuario,p_id_grupo, p_calificacion,p_comentario,sysdate(),p_semana,p_anonimo);
	commit;
END//

-- ? SELECT COMPLETO DE OPINIONES DE LOS CURSOS A LOS QUE UN ESTUDIANTE ESTÁ SUSCRITO
delimiter //
CREATE PROCEDURE `obtener_opiniones_cursos_seguidos`(IN p_id_usuario INT(11))
BEGIN
    select op.id, op.id_usuario,op.comentario, op.fecha, op.semana, op.anonimo,
    g.id_grupo, ce.estado estado_grupo , cur.codigo_curso, car.nombre nombre_carrera , cur.nombre curso_nombre,
    cur.carta ruta_carta, cur.creditos, cur.descripcion curso_descripcion , cur.universidad, pUsuario.nombre nombre_profesor
    from Opiniones op
    inner join CursoEstudiante ce on ce.id_usuario = p_id_usuario
    inner join Grupo g on ce.id_grupo = g.id
    inner join Cursos cur on g.codigo_curso = cur.codigo_curso
	inner join Carrera car on car.codigo= cur.carrera
	inner join Profesor p on g.id_profesor = p.id_usuario
    inner join Uuuario pUsuario on p.id_usuario= pUsuario.id_usuario
    where ce.id_usuario = p_id_usuario;
END//