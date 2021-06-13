var g_MapCursosProfe = new Map();

function loaded(event){
    events(event);
}

function events(event){
    loadFromDB();
    onOpenModal();
    changeProfilePhoto();
    fotoonChange();
}
var myModal = new bootstrap.Modal(document.getElementById('modalImage'), {
    keyboard: false
})
function openImageModal(id,foto) {
    var modalToggle = document.getElementById('modalImage') // relatedTarget
    myModal.show(modalToggle)
    console.log(id,foto)

    $('#id_usuarioModal').val(id);
    $('.avatar-bg').css({
        'background':'url('+foto+')',
        'background-size':'cover',
        'background-position': '50% 50%'
    });
}
function readURL(input) { 
    if (input.files && input.files[0]) {
        var reader = new FileReader(); 
        reader.onload = function (e) {
            $('.avatar-bg').css({
                'background':'url('+e.target.result+')',
                'background-size':'cover',
                'background-position': '50% 50%'
            });
        }; 
        reader.readAsDataURL(input.files[0]);
    }
}
function changeProfilePhoto() {
    $("#profileImageChange").click(function(e) {
        $("#fileFoto").click();
    });
}
function fotoonChange() {
    $("#fileFoto").change(function(event){
        let fileInput = event.currentTarget;
        let archivos = fileInput.files;
        let nombre = archivos[0].name;
        let tipo = nombre.split('.')[archivos.length];
        if(tipo == 'png' || tipo == 'jpg' || tipo == 'jpeg' || tipo == 'PNG' || tipo == 'JPG' || tipo == 'JPEG'){
            readURL(this);
            $('#sendFileFoto').html('')
            $('#sendFileFoto').html(
                '<button class="btn btn-primary btn-sm d-block mx-auto mb-3" '+
                'id="btn_cambiar_foto" type="submit" '+
                'style="display: none;">Cambiar foto</button>'
            );
            $('#formatoImagenInvalido').hide();
        }else{
            $('#formatoImagenInvalido').show();
        }
                    
    });
}
function loadFromDB(){
    let id = $('#idUsuario').html();
    $.ajax({
        type: "GET",
        url: "/api/perfilProfe/cursos",
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
        var recipient = button.data('codigo')
        let curso = g_MapCursosProfe.get(parseInt(recipient))
        
        $('#nombreCursoModal').html(curso.nombre);

        $('#carreraCursoModal').html(curso.universidad);
        $('#creditosCursoModal').html(curso.creditos + " " + curso.codigo + " " + curso.codigo_curso);
       
        $('#carreraCursoModal1').html(curso.universidad);
        $('#creditosCursoModal1').html("Creditos: " + curso.creditos + " Código:" + curso.codigo + "-" + curso.codigo_curso);
        
        $('#descripcionCursoModal').html(curso.descripcion);
    })
}

function llenarCursosStand(data) {
    $('#cursos').html('');
    data.forEach(e => {
        g_MapCursosProfe.set(e.codigo_curso,e);
        printCursos(e);
    });
}

function printCursos(curso) {
    console.log(curso)
    $('#cursos').append(`
    <div class="col-lg animate__animated animate__fadeIn">
        <h6 class="text-center">${curso.nombre}</h6>
        <div class="mx-auto d-block" style="width="200px" role="button" data-codigo="${curso.codigo_curso}" data-bs-toggle="modal" data-bs-target="#detalleCurso">
            <img src="/images/Icons/clipboard.png" width="150px" style="display:block; margin:0 auto;">
        </div>
    </div>

    `);
}

var g_cambioEditar = {
    correo:0,
    user:0
}

function cerrarEdicion(button){
    location.href = "/profe/show"
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
    console.log(id, val);
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

document.addEventListener("DOMContentLoaded", loaded);