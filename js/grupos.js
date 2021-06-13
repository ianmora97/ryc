
function loaded(event) {
    events(event);
}

function events(event) {
    loadFromDB();
}

function loadFromDB() {
    let id = $('#codCurso').html();
    $.ajax({
        type: "GET",
        url: "/api/gruposPorCurso",
        data: { id },
        contentType: "application/json"
    }).then((grupos) => {
        mostrarGrupos(grupos);
    }, (error) => {
    });
}


function mostrarGrupos(grupos) {
    $('#gruposPorCurso').html('');
    grupos.forEach(grupo => {
        $('#gruposPorCurso').append(`
            <div id="result_grupo" class="d-flex justify-content-between bg-light shadow rounded-cus mb-4 me-5" onclick="seguirGrupo()" data-id="${grupo.id}">
                <div class="bg-primary rounded-cus-left">
                    <img src="/images/Icons/computer.png" style="width: 80px; height: 80px; margin: 20px 10px;">
                </div>
                <div class="d-flex flex-column flex-fill p-3">
                    <h4 class="my-0">${grupo.codigo_curso} - ${grupo.nombre_curso}</h4>
                    <h4 class="my-0 text-secondary" >${grupo.nombre_profesor}</h4>
                    <p class="my-0">${grupo.carrera} - ${grupo.nrc}</p>
                    <div class="d-flex justify-content-between">
                        <p class="my-0">${grupo.ciclo} ciclo - ${grupo.annio}</p>   
                    </div>
                </div>
            </div>
        `);
        $('#idGrupo').html(grupo.id);
    });
    
}

function seguirGrupo(){
    let id = $('#idGrupo').html()
    let user = $('#idUsuario').html();
    $.ajax({
        type: "GET",
        url: "/grupo/seguirGrupo",
        data: {id, user},
        contentType: "application/json"
    }).then((response) => {
        console.log(response)
        if(response.status != 500){
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Sigue el curso exitosamente',
                showConfirmButton: false,
                timer: 1500
            })
        }else{
            
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Ya está suscrito',
            showConfirmButton: false,
            timer: 2000
        })
        }
    }, (error) => {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'No se pudo seguir el curso',
            showConfirmButton: false,
            timer: 1500
        })
    });
}


document.addEventListener("DOMContentLoaded", loaded);