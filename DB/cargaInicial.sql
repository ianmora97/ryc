use ryc2;
call insertar_usuario("test", "Testing test", 1234);
select * from Usuario;

insert into Estudiante(id_usuario,carrera) values (16,"Ingeniería en Sistemas");

insert into Profesor(id_usuario, titulo, annio_ingreso) values (17, "Bachillerato en ciencias de computación", CURDATE() );
select * from Profesor;


insert into Carrera(codigo,nombre) values('EIF404','Ingeniería en Sistemas'); 
select * from Carrera;

call insertar_usuario("profesor@gmail.com", "Juan de Dios", 1234);



insert into Cursos (codigo_curso,carrera, nombre, carta, creditos,descripcion,universidad) values 
("40047","EIF404", "Estructuras de Datos", "/storage/cartasAlEstudiante/202105071900.pdf", 4,
"Curso enfocado en la correcta utilización de las estructuras de Datos de programación, para mejorar la complejidad de espacio y recorrido en la generación de algoritmos.",
"Universidad Nacional");

select * from Cursos;

insert into Grupo (codigo_curso, id_profesor, nrc, ciclo, annio, cantidad_semanas) values 
("40047",17,"40032",1,2021, 18);

select * from Grupo;

insert into CursoEstudiante(id_usuario, id_grupo,estado)
values(16, 1,1);


insert into Opinion (id_usuario, id_grupo,calificacion,comentario,fecha,semana,anonimo)
VALUES(null,1,5, "Hasta el momento, el curso parece ser bastante bueno, el profe se ve que es bueno dando clases y creo que puede ser de mucho provecho para un futuro",sysdate(),3,1)

