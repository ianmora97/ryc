var clipboard = new ClipboardJS('.btn-to-clip');
var g_preguntas = [];
function loaded(event){
    events(event);
}

function events(event){
    fillEncuestas();
}

function fillEncuestas() {
    let texto = JSON.parse($('#textoEncuesta').html());
    g_preguntas = texto;
    texto.forEach(e => {
        if(e.type == 1){ // seleccion unica
            $('#preguntas').append(`
                <div id="questionContainer-${e.id}">
                    <div id="feedback-${e.id}" class="my-4"></div>
                    <div class="bg-primary w-100 mt-3 rounded-lg py-1 px-3 text-white" style="min-height:38px; position:relative;">
                        <h4>${e.pregunta}</h4>
                    </div>
                    <div class="bg-white rounded-lg shadow w-100 p-3 mt-3" style="min-height:100px;" id="unique-q-${e.id}">
                        
                    </div>
                    <div class="border-bottom mt-4"></div>
                </div>
            `);
            e.respuestas.forEach(i =>{
                $(`#unique-q-${e.id}`).append(`
                    <div class="form-check mb-1">
                        <input class="form-check-input" id="encuestaCheckQ_${e.id}_${i.id}" type="radio" name="encuestaCheckQ_${e.id}" value="${i.val}">
                        <label class="form-check-label" for="encuestaCheckQ_${e.id}_${i.id}">${i.val}</label>
                    </div>
                `)
            })
        }else{
            $('#preguntas').append(`
                <div id="questionContainer-${e.id}">
                    <div id="feedback-${e.id}" class="my-4"></div>
                    <div class="bg-primary w-100 mt-3 rounded-lg py-1 px-3 text-white" style="min-height:38px; position:relative;">
                        <h4>${e.pregunta}</h4>
                    </div>
                    <div class="bg-white rounded-lg shadow w-100 p-3 mt-3" style="min-height:100px;">
                        <div class="row py-2 px-3" style="min-height:100px;">
                            <textarea class="form-control" id="encuestaShortQ_${e.id}" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="border-bottom mt-4"></div>
                </div>
            `);
        }
        
    });
}
function enviarEncuesta(){
    let respuestas = {};
    g_preguntas.forEach(e =>{
        $(`#feedback-${e.id}`).html('');
        if(e.type == 1){
            let a = $(`[name=encuestaCheckQ_${e.id}]:checked`).val();
            if(a != undefined){
                respuestas[`${e.id}`] = $(`[name=encuestaCheckQ_${e.id}]:checked`).val();
            }else{
                $(`#feedback-${e.id}`).html(`
                    <div class="alert alert-secondary rounded-lg alert-dismissible fade show" role="alert">
                        <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/warning_26a0-fe0f.png" width="24">
                        Debe seleccionar una respuesta
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
                return;
            }
        }else{
            let a = $(`#encuestaShortQ_${e.id}`).val();
            if(a != ""){
                respuestas[`${e.id}`] = $(`#encuestaShortQ_${e.id}`).val();
            }else{
                $(`#feedback-${e.id}`).html(`
                    <div class="alert alert-secondary rounded-lg alert-dismissible fade show" role="alert">
                        <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/warning_26a0-fe0f.png" width="24">
                        Debe escribir una respuesta
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
                return;
            }
            
        }
    })
    let correo = $('#emailRegistro').val();
    if(correo != ''){
        let id = $('#idEncuesta').html();
        let respuesta = JSON.stringify(respuestas);
        $.ajax({
            type: "GET",
            url: "/agregar/survey",
            data: {id,correo,respuesta},
            contentType: "application/json"
        }).then((response) => {
            location.href = "/"
        }, (error) => {
            if(error.sqlMessage.match(`cannot be null`)){
                $('#feedback-correo').append(`
                    <div class="alert alert-secondary alert-dismissible fade show" role="alert">
                        <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/warning_26a0-fe0f.png" width="24">
                        No existe este correo registrado
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
            }
            
        });
    }else{
        $('#feedback-correo').append(`
            <div class="alert alert-secondary alert-dismissible fade show" role="alert">
                <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/warning_26a0-fe0f.png" width="24">
                Digite su correo
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
    }
}

document.addEventListener("DOMContentLoaded", loaded);