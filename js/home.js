

function loaded(event) {
    comentarioAnonimo();
    OPINIONESGLOBALES = JSON.parse(OPINIONESGLOBALES);
}
function closeModal(){ 
    $("#comentario_text").val("");
    $("#html").css("overflow","auto");
}

function getComentarioInArray(id_opinion) {
    console.log("opinion# "+ id_opinion)
    var opinion =  OPINIONESGLOBALES.find(obj => {
        return obj.id_opinion == id_opinion
    })
    return opinion
}

function comentarioAnonimo() {

    $('#anonimo_check').change(function () {
        $("#comentario_anonimo").val("false");
        if (this.checked) {
            $("#comentario_anonimo").val("true")
        }
    });
}

function insertComentario(id_opinion) {
    payload = {
        id_opinion: id_opinion,
        comentario_text: $("#comentario_text").val(),
        anonimo: $("#comentario_anonimo").val(),
        id_usuario: $("#user_session").val(),
    };

    $.ajax({
        type: "PUT",
        url: "/comentarios",
        contentType: "application/json",
        data: JSON.stringify(payload),
    }).then((response) => {
        getComentarios(id_opinion)
        $("#comentario_text").val("")
    }, (error) => {

    });
}

function getComentarios(id_opinion) {
    $("#btn_enviar_comentario").off("click");
    $("#btn_enviar_comentario").on("click", function () { insertComentario(id_opinion); })
    $.ajax({
        type: "GET",
        url: "/comentarios?id_opinion=" + id_opinion,
        contentType: "application/json",
    }).then((result) => {
        cargarComentarios(result)
        actualizarComentarioModal(id_opinion);
        $("#html").css("overflow","hidden");

    }, (error) => {

    });
}

function actualizarComentarioModal(id_opinion) {

    var opinion = getComentarioInArray(id_opinion)
    if(opinion.nombre_opinador == null){
        opinion.img_perfilOp = "anonimo.png"
        opinion.nombre_opinador = "Anonimo"
    }

    $("#opinador-nombre-modal").html(opinion.nombre_opinador)
    $("#opinador-fecha-modal").html(opinion.fecha.split(" ")[0])
    $("#opinador-hora-modal").html(opinion.fecha.split(" ")[1].substring(0,5) )
    $("#opinador-imagen-modal").attr('src', '/images/Perfil/' + opinion.img_perfilOp)
    $("#opinador-opinion-modal").html(opinion.comentario)

}


function cargarComentarios(comentarios) {
    var i = 0;
    $("#comentarios-wrapper").html("")

    comentarios.forEach(comentario => {
        var posicion = ""
        if (i == 0) {
            posicion = "primero"
        } else if (i == comentarios.length - 1) {
            posicion = "ultimo"
        }
        var coment = crearComentario(comentario, posicion)
        $("#comentarios-wrapper").append(coment)
        i++;
    });
}
function like(id_opinion) {
    payload = {
        id_usuario: $("#user_session").val(),
        id_opinion: id_opinion,
    };
    $.ajax({
        type: "POST",
        url: "/opiniones/like",
        contentType: "application/json",
        data: JSON.stringify(payload),
    }).then((response) => {
        var likesCount = response.likesCount
        actualizarLikes(id_opinion, likesCount, "likes_")
    }, (error) => {

    });
}

function dislike(id_opinion) {
    payload = {
        id_usuario: $("#user_session").val(),
        id_opinion: id_opinion,
    };
    $.ajax({
        type: "POST",
        url: "/opiniones/dislike",
        contentType: "application/json",
        data: JSON.stringify(payload),
    }).then((response) => {
        var likesCount = response.likesCount
        actualizarLikes(id_opinion, likesCount, "dislikes_")
    }, (error) => {

    });
}

function meEnoja(id_comentario) {
    payload = {
        id_usuario: $("#user_session").val(),
        id_comentario: id_comentario,
    };
    $.ajax({
        type: "POST",
        url: "/comentarios/meEnoja",
        contentType: "application/json",
        data: JSON.stringify(payload),
    }).then((response) => {
        var count = response.count
        actualizarLikes(id_comentario, count, "enojado_")
    }, (error) => {

    });
}

function mePareceOk(id_comentario) {
    payload = {
        id_usuario: $("#user_session").val(),
        id_comentario: id_comentario,
    };
    $.ajax({
        type: "POST",
        url: "/comentarios/ok",
        contentType: "application/json",
        data: JSON.stringify(payload),
    }).then((response) => {
        console.log(response)
        var count = response.count
        actualizarLikes(id_comentario, count, "ok_")
    }, (error) => {

    });
}
function serio(id_comentario) {
    payload = {
        id_usuario: $("#user_session").val(),
        id_comentario: id_comentario,
    };
    $.ajax({
        type: "POST",
        url: "/comentarios/serio",
        contentType: "application/json",
        data: JSON.stringify(payload),
    }).then((response) => {
        var count = response.count
        actualizarLikes(id_comentario, count, "serio_")
    }, (error) => {

    });
}

function toxico(id_comentario) {
    payload = {
        id_usuario: $("#user_session").val(),
        id_comentario: id_comentario,
    };
    $.ajax({
        type: "POST",
        url: "/comentarios/toxico",
        contentType: "application/json",
        data: JSON.stringify(payload),
    }).then((response) => {
        var count = response.count
        actualizarLikes(id_comentario, count, "toxico_")
    }, (error) => {

    });
}



function crearComentario(comentario, posicion) {
    if (comentario.nombre == null) {
        comentario.nombre = "anonimo"
        comentario.imagen_perfil = "anonimo.png"
    }

    var comment = `<div class="container-comentario">
                        <div class="punto"></div>
                        <div class="linea ${posicion}"></div>
                        <div class="comentario">
                            <div class="card mt-2">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-2 p-0 d-flex justify-content-end">
                                            <div class="container-img-coment"><img
                                                    class="img-comentario"
                                                    src="/images/Perfil/${comentario.imagen_perfil}" alt="">
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div class="row fw-bold text-dark">${comentario.nombre}</div>
                                            <div class="row">${comentario.comentario}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mt-4">
                                        <div class="col mt-1">
                                            <button type="button" onclick="meEnoja(${comentario.id_comentario})"
                                                class="btn btn-sm btn-secondary reaccion-comentario">
                                                <i class="angry-image"></i> <span id="enojado_${comentario.id_comentario}" style="color: #f95428;">
                                                ${comentario.me_enoja}
                                                </span>
                                            </button>
                                        </div>
                                        <div class="col mt-1">
                                            <button type="button" onclick="mePareceOk(${comentario.id_comentario})"
                                                class="btn btn-sm btn-secondary reaccion-comentario">
                                                <i class="ok-image"></i> <span id="ok_${comentario.id_comentario}" style="color: #468ad2;">
                                                ${comentario.me_parece_ok}
                                                </span>
                                            </button>
                                        </div>
                                        <div class="col mt-1 jump-row">
                                            <button type="button" onclick="serio(${comentario.id_comentario})"
                                                class="btn btn-sm btn-secondary reaccion-comentario">
                                                <i class="serious-image"></i> <span id="serio_${comentario.id_comentario}" style="color: #f5b139;">
                                                ${comentario.serio}
                                                </span>
                                            </button>
                                        </div>
                                        <div class="col mt-1">
                                            <button type="button" onclick="toxico(${comentario.id_comentario})"
                                                class="btn btn-sm btn-secondary reaccion-comentario">
                                                <i class="toxic-image"></i> <span id="toxico_${comentario.id_comentario}" style="color: #8ccc41;">
                                                ${comentario.toxico}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
    return comment
}

function actualizarLikes(id_opinion, cantLikes, prefix) {
    $("#" + prefix + id_opinion).html(cantLikes);
}

document.addEventListener("DOMContentLoaded", loaded);