var g_MapCursosEstudiante = new Map();

function loaded(event){
    events(event);
}

function events(event){
    loadFromDB();
    onOpenModal();
}

function loadFromDB(){
    let id = $('#idUsuario').html();
    $.ajax({
        type: "GET",
        url: "/api/perfil/cursos",
        data: {id},
        contentType: "application/json"
    }).then((cursos) => {
        llenarCursosStand(cursos);
    }, (error) => {
    });
}
function onOpenModal(){
    $('#detalleCurso').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var recipient = button.data('id')
        let curso = g_MapCursosEstudiante.get(parseInt(recipient))
        
        $('#nombreCursoModal').html(curso.curso_nombre);

        $('#carreraCursoModal').html(curso.universidad);
        $('#creditosCursoModal').html(curso.creditos + " " + curso.codigo_area + " " + curso.codigo_curso);
       
        $('#carreraCursoModal1').html(curso.universidad);
        $('#creditosCursoModal1').html(curso.creditos + " " + curso.codigo_area + " " + curso.codigo_curso);
        
        $('#descripcionCursoModal').html(curso.curso_descripcion);
    })
}
var g_cambioEditar = {
    correo:0,
    user:0
};
function cerrarEdicion(button){
    location.href = "/perfil"
}

function editarPerfilPrompt() {
    let usuario = $('#perfilUsernameE').html().split('@')[1];
    let correo = $('#userCorreoE').html();

    $('#botonEditarPerfil').html('');
    $('#botonEditarPerfil').html(`<button class="btn btn-sm btn-dark" onclick="cerrarEdicion(this)">Cerrar Edicion</button>`);

    $('#perfilUsernameE').html('');
    $('#perfilUsernameE').html(`
        <div class="input-group mb-3">
            <input value="${usuario}" class="form-control from-control-sm" id="cambioUsuarioID">
            <span role="button" class="input-group-text" id="basic-addon1" 
            onclick="cambiarNombreUsuario(this)"><i class="far fa-save"></i></span>
        </div>
    `);

    $('#userCorreoE').html('');
    $('#userCorreoE').html(`
        <div class="input-group mb-3">
            <input value="${correo}" class="form-control from-control-sm" id="cambioCorreoID">
            <span role="button" class="input-group-text" id="basic-addon2" 
            onclick="cambiarCorreoUsuario(this)"><i class="far fa-save"></i></span>
        </div>
    `);
}
function cambiarNombreUsuario(input) {
    let id = $('#idUsuario').html();
    let val = $('#cambioUsuarioID').val();

    $.ajax({
        type: "GET",
        url: "/perfil/cambiarNombreUsuario",
        data: {id, val},
        contentType: "application/json"
    }).then((cursos) => {
        g_cambioEditar.user = 1;
        $('#perfilUsernameE').html('');
        $('#perfilUsernameE').html(`@${val}`);
    }, (error) => {
    });
}
  
function cambiarCorreoUsuario(input) {
    let id = $('#idUsuario').html();
    let val = $('#cambioCorreoID').val();
    
    $.ajax({
        type: "GET",
        url: "/perfil/cambiarCorreo",
        data: {id, val},
        contentType: "application/json"
    }).then((cursos) => {
        g_cambioEditar.correo = 1;
        $('#userCorreoE').html('');
        $('#userCorreoE').html(`${val}`);
    }, (error) => {
    });
}
function llenarCursosStand(data) {
    $('#cursosRestantes').html('');
    data.forEach(e => {
        g_MapCursosEstudiante.set(e.id,e);
        printCursos(e);
    });
}
function printCursos(curso) {
    
    $('#cursosRestantes').append(`
    <div class="col-lg animate__animated animate__fadeIn">
        <h6 class="text-center">${curso.curso_nombre}</h6>
        <div class="libroCus mx-auto d-block" role="button" data-id="${curso.id}" data-bs-toggle="modal" data-bs-target="#detalleCurso">
            <div class="lineBookO1"></div>
            <div class="lineBookO2"></div>
        </div>
    </div>
    `);
}
document.addEventListener("DOMContentLoaded", loaded);