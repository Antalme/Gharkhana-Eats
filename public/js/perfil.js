document.addEventListener('DOMContentLoaded', function () {
    $("#tituloCambiarContrasena").click(() => {
        $("#contenedorNuevaContrasena").removeClass("escondido");
    })

    $("#eliminarIngrediente").click(() => {
        cambiarContrasena()
    })
})

function cambiarContrasena() {
    if ($("#contraActual").val() == ""){
        mostrarMensaje({
            titulo: "¡Falta la contraseña actual!",
            mensaje: "Debes introducir la contraseña que usas actualmente antes de cambiarla.",
            tipo: "warning"
        })
        return
    }
    if ($("#contraNueva").val() == ""){
        mostrarMensaje({
            titulo: "¡Falta la contraseña nueva!",
            mensaje: "Debes introducir la contraseña que quieres usar antes de cambiarla.",
            tipo: "warning"
        })
        return
    }
    if ($("#contraActual").val() == $("#contraNueva").val()){
        mostrarMensaje({
            titulo: "¡Las contraseñas coinciden!",
            mensaje: "Tu contraseña nueva no puede ser la misma que la que ya tenías.",
            tipo: "warning"
        })
        return
    }

    $.ajax({
        url: "/cambiar-contrasena",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            passActual: $("#contraActual").val(),
            passNueva: $("#contraNueva").val()
        }),
        success: function (response) {
            mostrarMensaje({
                titulo: response.titulo,
                mensaje: response.mensaje,
                tipo: response.tipo
            })
        },
        error: function (xhr, status, error) {
            mostrarMensaje({
                titulo: "¡La contraseña no ha cambiado!",
                mensaje: "Tu contraseña no se ha podido cambiar por el siguiente motivo: " + error,
                tipo: "warning"
            })
            console.error("Error: :", status, error)
        }
    })
}