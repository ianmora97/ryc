var g_MapCursosProfe = new Map();
var g_questions = new Map();
var g_encuestas = new Map();

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
        url: "/api/perfilProfe/cursos",
        data: {id},
        contentType: "application/json"
    }).then((cursos) => {
        llenarCursos(cursos);
    }, (error) => {
    });
    $.ajax({
        type: "GET",
        url: "/api/encuestas",
        data: {id},
        contentType: "application/json"
    }).then((encuestas) => {
        fillEncuestas(encuestas);
    }, (error) => {
        console.log(error)
    });
}
function fillEncuestas(data) {
    $('#encuestasList').html('');
    data.forEach((e => {
        g_encuestas.set(e.id_encuesta,e);
        $('#encuestasList').append(`
            <div class="col">
                <div class="card shadow text-center rounded-lg border-0" onclick="verEncuesta('${e.id_encuesta}')" role="button">
                    <div class="card-header bg-white rounded-lg d-flex flex-column">
                        <div>
                            <h3 class="fw-bolder mt-2">${e.titulo}</h3>
                        </div>
                        <div>
                            <span class="text-muted">Encuesta</span>
                        </div>
                        <img src="/images/Icons/clipboard.png" class="mx-auto" width="100px" style="height:100px;">
                    </div>
                    <div class="card-body bg-primary rounded-lg-cardbody">
                    <h5 class="text-white stretched-link">Ver Respuestas</h5>
                    </div>
                </div>
            </div>
        `);
    }))
}
function verEncuesta(id) {
    let encuesta = g_encuestas.get(parseInt(id));
    $('#cursoSelectedVer').html(encuesta.titulo);
    let preguntas = JSON.parse(encuesta.text);
    $('#EncuestaVer').html('');
    preguntas.forEach(e =>{
        if(e.type == 2){
            $('#EncuestaVer').append(`
                <div id="questionContainer-${e.id}">
                    <div class="bg-primary w-100 mt-5 rounded-lg py-1 px-3 text-white" style="min-height:50px; position:relative;">
                        <h4>${e.pregunta}</h4>
                    </div>
                    <div class="bg-white rounded-lg shadow w-100 p-3 mt-3" style="height:100px;">
                        
                    </div>
                    <div class="border-bottom mt-4"></div>
                </div>
            `);
        }else{
            $('#EncuestaVer').append(`
                <div id="questionContainer-${e.id}">
                    <div class="bg-primary w-100 mt-5 rounded-lg py-1 px-3 text-white" style="min-height:50px; position:relative;">
                        <h4>${e.pregunta}</h4>
                    </div>
                    <div class="bg-white rounded-lg shadow w-100 p-3 mt-3" style="height:100px;">
                        <div class="row py-2 px-3" style="height:400px;">
                            <canvas id="chart-${e.pregunta}"></canvas>
                        </div>
                    </div>
                    <div class="border-bottom mt-4"></div>
                </div>
            `);
            // por terminar
            let chart1 = document.getElementById(`chart-${e.pregunta}`).getContext("2d");
            let chart1Var = new Chart(chart1, {
                type: "doughnut",
                data: {
                    datasets: [
                        {                
                            borderWidth: [2],
                            backgroundColor: [
                                '#28a745',
                                "#4c84ff",
                                '#ffc107',
                            ],
                            borderColor: [
                                "#28a745",
                                "#4c84ff",
                                "#ffc107",
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options:{
                    cutoutPercentage: 70,
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        }
        
    })

    var myModal = new bootstrap.Modal(document.getElementById('verEncuesta'))
    var modalToggle = document.getElementById('verEncuesta') // relatedTarget
    myModal.show(modalToggle)

    
    
}
function onOpenModal(){
    $('#agregarEncuesta').on('show.bs.modal', function (event) {
        let curso = {
            codigo: $('#cursosDropdownAgregar option:selected').val(), 
            text: $('#cursosDropdownAgregar option:selected').text() 
        };
        $('#cursoSelected').html('');
        $('#cursoCodigoSelected').html('');

        $('#cursoSelected').html(curso.text);
        $('#cursoCodigoSelected').html(curso.codigo);
    })
}

function llenarCursos(data) {
    $('#cursosDropdownAgregar').html('');
    data.forEach(e => {
        g_MapCursosProfe.set(e.id_profesorCurso,e);
        printCursos(e);
    });
}

function printCursos(curso) {
    $('#cursosDropdownAgregar').append(`
        <option value="${curso.id_profesorCurso}">${curso.nombre}</option>
    `);
}

// ! -------------------------------- AGREGAR PREGUNTAS ------------------------------ 

function addQShortA(params) {
    let cont = g_questions.size; // obtiene el numero de la pregunta
    g_questions.set(cont,{ // asigna al map de preguntas una nueva preguntas con los valores predeterminados
        id: cont,
        type: 2,
        pregunta:''
    });
    $('#preguntas').append(`
        <div id="questionContainer-${cont}">
            <div class="bg-primary w-100 mt-5 rounded-lg py-1" style="min-height:50px; position:relative;">
                <div class="d-flex justify-content-between align-items-center">
                    <textarea class="textarea-cus" rows="2" id="textarea-q-${cont}" onkeyup="changeValQuestion('textarea-q-${cont}')"></textarea>
                    <button type="button" class="btn bg-white p-2 me-3 rounded-3" onclick="deleteQuestion('#questionContainer-${cont}')">
                        <i class="fas fa-trash text-danger" style="font-size:25px;"></i>
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow w-100 p-3 mt-3" style="height:100px;">
                <small class="text-muted">Respuesta corta...</small>
            </div>
            <div class="border-bottom mt-4"></div>
        </div>
    `);
    
}

function addQUniqueQ() { // agregar un bloque de pregunta
    let cont = g_questions.size; // obtiene el numero de la pregunta
    g_questions.set(cont,{ // asigna al map de preguntas una nueva preguntas con los valores predeterminados
        id: cont,
        type: 1,
        pregunta:'',
        respuestas: [
            {id:0,val:'Si'},
            {id:1,val:'No'}
        ],
    });
    $('#preguntas').append(`
    <div id="questionContainer-${cont}">
        <div class="bg-primary w-100 mt-5 rounded-lg py-1" style="min-height:50px; position:relative;">
            <div class="d-flex justify-content-between align-items-center">
                <textarea class="textarea-cus" rows="2" id="textarea-q-${cont}" onkeyup="changeValQuestion('textarea-q-${cont}')"></textarea>
                <button type="button" class="btn bg-white p-2 me-3 rounded-3" onclick="deleteQuestion('#questionContainer-${cont}')">
                    <i class="fas fa-trash text-danger" style="font-size:25px;"></i>
                </button>
            </div>
        </div>
        <div class="bg-white rounded-lg shadow w-100 p-3 mt-3">
            <div id="answerOp-q-${cont}" class="d-flex flex-column">
                <div class="form-check mb-1">
                    <input class="form-check-input" type="radio" name="flexRadioDisabled" disabled>
                    <input type="text" class="form-control-cus" id="res-q-${cont}-0" placeholder="Si.." value="Si" onkeyup="changeValueAns('res-q-${cont}-0')">
                </div>
                <div class="form-check mb-1">
                    <input class="form-check-input" type="radio" name="flexRadioDisabled" disabled>
                    <input type="text" class="form-control-cus" id="res-q-${cont}-1" placeholder="No.." value="No" onkeyup="changeValueAns('res-q-${cont}-1')">
                </div>
            </div>
            <div class="bg-primary w-100 mt-2 rounded-3" style="height:10px; position:relative;">
                <div class="bg-primary rounded-circle text-center addAnsBtn" role="button" onclick="addUniqueAns('answerOp-q-${cont}')">
                    <i class="fas fa-plus text-white lh-base"></i>
                </div>
            </div>
        </div>
        <div class="border-bottom mt-5"></div>
    </div>
    `);
}

function addUniqueAns(pregunta) { // agrega una respuesta a una pregunta
    let cont = pregunta.split('-')[2]; // obtengo el id de la pregunta
    let qu = g_questions.get(parseInt(cont));
    let sr = qu.respuestas.length;
    qu.respuestas.push({id:sr, val:'Otro'});
    $(`#${pregunta}`).append(`
        <div class="d-flex justify-content-between align-items-center mb-1" id="resContainer-${cont}-${sr}">
            <div>
                <input class="form-check-input" type="radio" name="flexRadioDisabled" disabled>
                <input type="text" class="form-control-cus" id="res-q-${cont}-${sr}" placeholder="Otro.." value="Otro" onkeyup="changeValueAns('res-q-${cont}-${sr}')">
            </div>
            <button type="button" class="btn bg-light p-2 rounded-3" onclick="deleteAnswer('#res-q-${cont}-${sr}')">
                    <i class="fas fa-trash text-danger"></i>
            </button>
        </div>
    `);

}
function changeValQuestion(question){
    let cont = question.split('-')[2]; // obtengo el id de la pregunta
    let qu = g_questions.get(parseInt(cont)); // obtengo la pregunta en el map por el id
    qu.pregunta = $(`#${question}`).val();
}
function changeValueAns(respuesta){ // actualiza el valor en el map de la respuesta
    let cont = respuesta.split('-')[2]; // obtengo el id de la pregunta
    let qu = g_questions.get(parseInt(cont)); // obtengo la pregunta en el map por el id
    let re = parseInt(respuesta.split('-')[3]); // obtengo la respuesta de la pregunta
    qu.respuestas.filter(e => e.id == re)[0].val = $(`#${respuesta}`).val();
}
function deleteQuestion(pregunta){ // elimina una pregunta
    let cont = pregunta.split('-')[1];
    $(pregunta).remove();
    g_questions.delete(parseInt(cont));
}
function deleteAnswer(respuesta) {
    let cont = respuesta.split('-')[2]; // obtengo el id de la pregunta
    let qu = g_questions.get(parseInt(cont)); // obtengo la pregunta en el map por el id
    let re = parseInt(respuesta.split('-')[3]); // obtengo la respuesta de la pregunta
    let vec = qu.respuestas;
    let resp = $(respuesta).val();
    qu.respuestas = vec.filter(e => e.val != resp);
    $(`#resContainer-${cont}-${re}`).remove();
}

// ! ------------------------------ Agregar encuesta -----------------------------

function agregarEncuesta(){
    let codigo = $('#cursoCodigoSelected').html();
    let vec = [];
    g_questions.forEach(e =>{
        vec.push(e);
    })
    let encuesta = JSON.stringify(vec);
   
    $.ajax({
        type: "GET",
        url: "/insertar/encuesta",
        data: {codigo, encuesta},
        contentType: "application/json"
    }).then((cursos) => {
        console.log(cursos)
    }, (error) => {
        console.log(error)
    });
}


// ! ------------------------------ Ver encuestas -----------------------------



document.addEventListener("DOMContentLoaded", loaded);