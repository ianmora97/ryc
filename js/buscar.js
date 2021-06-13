var g_cursos = [];

function loaded(event) {
    traerDelaBase();
}

function traerDelaBase(){
    $.ajax({
        type: "GET",
        url: "/traerCursos", //este es un path nuevo, hay que hacerlo
        contentType: "appication/json",
    }).then((cursos) => {
        g_cursos = cursos;
        mostrarCursos(cursos);
    }, (error) => {
    
    });
}


function buscarCursos(){
    let val = $('#buscarInputModal').val();
    let valN = $('#buscarInputModal').val();
    val = val != '' ? val[0].toUpperCase() + val.slice(1) : '';
    let resultado = g_cursos.filter(e => (e.nombre.includes(val) || e.nombre.includes(valN)))
    mostrarCursos(resultado);
}

function mostrarCursos(cursos) {
    $('#cursosFiltrados').html('');
    cursos.forEach(curso => {
        $('#cursosFiltrados').append(`
            <div id="card-buscar-curso" class="d-flex justify-content-between bg-light shadow rounded-cus mb-4" onclick="location.href='/curso/detalle?id_curso=${curso.codigo_curso}' " style="cursor:pointer;">
                <div class="bg-primary rounded-cus-left">
                    <img src="/images/Icons/computer.png" style="width: 80px; height: 80px; margin: 20px 10px;">
                </div>
                <div class="d-flex flex-column flex-fill p-3">
                    <h4 class="my-0">${curso.nombre}</h4>
                    <p class="my-0">${curso.carrera} - ${curso.codigo_curso}</p>
                    <div class="d-flex justify-content-between">
                        <p class="my-0">${curso.universidad}</p>
                        <p class="my-0">${curso.creditos} creditos</p>   
                    </div>
                </div>
            </div>
        `);
    });
}



document.addEventListener("DOMContentLoaded", loaded);