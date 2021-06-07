var g_MapCursosProfe = new Map();
var g_questions = new Map();
var g_encuestas = new Map();
var g_respuestas = [];
var g_graficos = [];

var g_vecColores = ['#506AD4','#6F8BFC','#384E85','#2349E4','#B8C4F5','#14225A','#666F95','#5B5B5B','#CFCFCF','#272727','#000000'];

var clipboard = new ClipboardJS('.btn-to-clip');

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
        $.ajax({
            type: "GET",
            url: "/api/encuestas/respuesta",
            contentType: "application/json"
        }).then((respuesta) => {
            g_respuestas = respuesta;
            fillEncuestas(encuestas);
        }, (error) => {
            console.log(error)
        });
    }, (error) => {
        console.log(error)
    });
    
}
function fillEncuestas(data) {
    $('#encuestasList').html('');
    data.forEach((e => {
        let respuestas = g_respuestas.filter(i => parseInt(i.encuesta) == parseInt(e.id_encuesta));
        g_encuestas.set(e.id_encuesta,{encuesta:e,res:respuestas});
        $('#encuestasList').append(`
            <div class="col">
                <div class="card shadow text-center rounded-lg border-0 animate__animated animate__fadeIn" >
                    <div class="card-header bg-white rounded-lg d-flex flex-column">
                        <div>
                            <h3 class="fw-bolder mt-2">${e.titulo}</h3>
                        </div>
                        <div>
                            <span class="text-muted">Encuesta</span>
                        </div>
                        <img src="/images/Icons/clipboard.png" class="mx-auto" width="100px" style="height:100px;">
                    </div>
                    <div class="card-body bg-primary rounded-lg-cardbody d-flex justify-content-between">
                        <div style="width:28px;"></div>
                        <h5 class="text-white" onclick="verEncuesta('${e.id_encuesta}')" role="button">Ver Respuestas</h5>
                        <div role="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Compartir encuesta"
                         class="btn-to-clip" data-clipboard-text="localhost/survey?token=${e.token}">
                            <i class="fas fa-share-alt fa-2x text-white"></i>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }))
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}
function verEncuesta(id) {
    let enc = g_encuestas.get(parseInt(id));
    let respuestas = enc.res;
    let v_r = [];
    respuestas.forEach(r => {
        let print = JSON.parse(r.respuesta);
        v_r.push(print);
    })
    $('#cursoSelectedVer').html(enc.encuesta.titulo);
    let preguntas = JSON.parse(enc.encuesta.text);
    $('#EncuestaVer').html('');
    preguntas.forEach(e =>{
        if(e.type == 2){
            let vec_respuestas = []; // filtra las opciones de respuesta
            v_r.forEach(r =>{
                vec_respuestas.push(r[e.id]);
            })
            let texto = "";
            vec_respuestas.forEach(t => {
                texto += `<h5 class="">${t}</h5>
                <div class="border-bottom mt-2"></div>`;
            });
            $('#EncuestaVer').append(`
                <div id="questionContainer-${e.id}">
                    <div class="bg-primary w-100 mt-5 rounded-lg py-1 px-3 text-white" style="min-height:50px; position:relative;">
                        <h4>${e.pregunta}</h4>
                    </div>
                    <div class="bg-white rounded-lg shadow w-100 p-3 mt-3" style="min-height:100px;">
                        ${texto}
                    </div>
                    <div class="border-bottom mt-4"></div>
                </div>
            `);
        }else{
            let vec_respuestas = []; // filtra las opciones de respuesta
            v_r.forEach(r =>{
                vec_respuestas.push(r[e.id]);
            })
            var repetidos = {};
            vec_respuestas.forEach(function(prof){ // cuenta la cantidad de respuestas por profesor
                repetidos[prof] = (repetidos[prof] || 0) + 1;
            });
            let texto = "";
            for (const property in repetidos) {
                texto += `<h4 class="fw-bold d-inline">${property}: <h3 class="text-primary d-inline">${repetidos[property]}</h3></h4>
                <br>
                <div class="border-bottom mt-2"></div>`;
            }
            $('#EncuestaVer').append(`
                <div id="questionContainer-${e.id}">
                    <div class="bg-primary w-100 mt-5 rounded-lg py-1 px-3 text-white" style="min-height:50px; position:relative;">
                        <h4>${e.pregunta}</h4>
                    </div>
                    <div class="bg-white rounded-lg shadow w-100 p-3 mt-3 row" style="min-height:100px;">
                        <div class="col-8 d-flex justify-content-start" style="min-height:300px;">
                            <canvas id="chart-${e.pregunta}"></canvas>
                        </div>
                        <div class="col-4" id="res-q-${e.id}">
                            <h4 class="mb-2">Respuestas:</h4>
                            ${texto}
                        </div>
                    </div>
                    <div class="border-bottom mt-4"></div>
                </div>
            `);
 
            let valores = [];
            let labels = [];
            let colores = [];
            e.respuestas.forEach(function(o,i){ // se definen los labels y los valores
                labels.push(o.val);
                valores.push(repetidos[o.val]);
                colores.push(g_vecColores[i])
            })

            let chart1 = document.getElementById(`chart-${e.pregunta}`).getContext("2d");
            let chart1Var = new Chart(chart1, {
                type: "doughnut",
                data: {
                    datasets: [{                
                        data:valores,
                        backgroundColor:colores
                    }],
                    labels: labels
                },
                options:{
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
            g_graficos.push(chart1Var);
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
    $('#alertaVacio').html('');
    let codigo = $('#cursoCodigoSelected').html();
    let titulo = $('#tituloEncuesta').val();
    let vec = [];
    g_questions.forEach(e =>{
        vec.push(e);
    })
    let encuesta = JSON.stringify(vec);
    var Options = $("[id*=textarea-q-]");                  
    
    for (let i = 0; i < Options.length; i++) {
        if ($(Options[i]).val() == '') {
            $('#alertaVacio').append(`
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/warning_26a0-fe0f.png" width="24">
                    Las preguntas no pueden estar vacias
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `);
            return;
        }
    }
    if(!titulo){
        $('#alertaVacio').append(`
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/warning_26a0-fe0f.png" width="24">
                Debe dar un titulo a la encuesta!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        return;
    }else{
        $.ajax({
            type: "GET",
            url: "/insertar/encuesta",
            data: {codigo, encuesta, titulo},
            contentType: "application/json"
        }).then((cursos) => {
            location.href = "/encuestas";
        }, (error) => {
            $('#alertaVacio').append(`
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/warning_26a0-fe0f.png" width="24">
                ${error}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        });
    }
    
}


// ! ------------------------------ Ver encuestas -----------------------------



document.addEventListener("DOMContentLoaded", loaded);