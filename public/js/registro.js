var paso = 1

document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.querySelector('form')
    formulario.addEventListener('submit', function (event) {
        event.preventDefault()

        if (paso == 1) {
            $("#formularioDatosPersonales").removeClass("oculto")
            paso = 2
        } else {
            mensajeError = camposCorrectos()

            if (mensajeError == "") {
                enviarDatosRegistro()
            } else {
                mostrarMensaje({
                    titulo: "¡Aviso!",
                    mensaje: mensajeError,
                    tipo: "warning"
                })
            }
        }
    })
})

function enviarDatosRegistro() {
    $.ajax({
        url: '/registro',
        method: 'POST',
        data: {
            usuario: $("#usuario").val(),
            email: $("#email").val(),
            pass: $("#pass").val(),
            nombreCompleto: $("#nombreCompleto").val(),
            direccion: $("#direccion").val()
        },
        success: function (data) {
            mostrarMensaje(data)
        },
        error: function (error) {
            console.error(error)
            mostrarMensaje(error.responseText)
        }
    })
}

//Comprueba que todos los campos del formulario pasen por los requisitos necesarios.
function camposCorrectos() {
    var mensaje = ""

    if (!$("#usuario").val()){
        mensaje += " Debes introducir un nombre de usuario."
    }
    if (!$("#email").val()){
        mensaje += " Debes introducir un email."
    }
    if (!$("#pass").val()){
        mensaje += " Debes introducir una contraseña."
    }
    if (!$("#nombreCompleto").val()){
        mensaje += " Debes introducir tu nombre real completo."
    }
    if (!$("#direccion").val()){
        mensaje += " Debes introducir la dirección de tu vivienda."
    }

    return mensaje
}