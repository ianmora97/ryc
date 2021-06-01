var g_MapCursosEstudiante = new Map();

function loaded(event) {
    events(event);
}

function events(event) {
    loadFromDB();
    onOpenModal();
}

function onOpenModal(){
    $('#detalleCurso').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var recipient = button.data('id')
        let curso = g_MapCursosEstudiante.get(parseInt(recipient))
        
        $('#nombreCursoModal').html(curso.nombre);

        $('#carreraCursoModal').html(curso.universidad);
        $('#creditosCursoModal').html(curso.creditos + " " + curso.codigo + " " + curso.codigo_curso);
       
        $('#carreraCursoModal1').html(curso.universidad);
        $('#creditosCursoModal1').html("Creditos: " + curso.creditos + " Código:" + curso.codigo + "-" + curso.codigo_curso);
        
        $('#descripcionCursoModal').html(curso.descripcion);
    })

    $('#modalOpinar').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var recipient = button.data('id')
        let curso = g_MapCursosEstudiante.get(parseInt(recipient))
        $('#idGrupo').html(curso.id);
    })

}

function loadFromDB() {
    let id = $('#idUsuario').html();
    $.ajax({
        type: "GET",
        url: "/api/cursos",
        data: { id },
        contentType: "application/json"
    }).then((cursos) => {
        console.log(cursos)
        llenarCursosCard(cursos);
    }, (error) => {
    });
}

function llenarCursosCard(data) {
    $('#miscursos').html('');
    data.forEach(e => {
        g_MapCursosEstudiante.set(e.id, e);
        printCursos(e);
    });
}

function guardarOpinion(){
    let opinion = $('#opinion').val();
    let id = $('#idUsuario').html();
    let grupo = $('#idGrupo').html();
    console.log(grupo)
    $.ajax({
        type: "GET",
        url: "/cursos/guardarOpinion",
        data: {id, grupo, opinion},
        contentType: "application/json"
    }).then((response) => {
        console.log("ESTE ES EL RESPONSE")
    },(error)=>{
        console.log("ESTE ES EL ERROR")
    });
}

function printCursos(curso) {

    $('#miscursos').append(`
    <div
        class="u-container-style u-expanded-width-md u-expanded-width-sm u-expanded-width-xs u-group u-white u-group-1">
        <div class="u-container-layout u-container-layout-1">
            <div class="u-container-style u-custom-color-4 u-expanded-width u-group u-radius-25 u-shape-round u-group-2">
            <div class="u-container-layout u-valign-top-md u-valign-top-sm u-valign-top-xs u-container-layout-2" role="button" data-id="${curso.id}" style="background-color: #506ad4; color:white;">
                <h3 class="u-text u-text-1">${curso.curso_nombre}</h3>
                <h5 class="u-text u-text-custom-color-3 u-text-2">${curso.nombre_profesor}</h5>
                <h6 class="u-text u-text-custom-color-3 u-text-3">
                <span style="font-size: 1rem;">${curso.codigo_curso}</span>
                <span style="font-size: 1rem;">${curso.creditos}</span>
                <br>
                </h6>
            </div>
            </div>
            <div data-id="${curso.id}" role="button" data-bs-toggle="modal" data-bs-target="#modalOpinar">
            <div style="margin: 10px;"><i class="fa fa-comment fa-2x" aria-hidden="true"></i></div>
            <p class="u-text u-text-grey-50 u-text-4">Opinar</p>
            </div>
        </div>
    </div>
    `);
}
document.addEventListener("DOMContentLoaded", loaded);