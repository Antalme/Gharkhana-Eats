//Muestra en pantalla la alerta personalizada de Swal.
function mostrarMensaje(respuesta, redirect) {
    redirect = redirect || ""
    Swal.fire({
        title: respuesta.titulo,
        text: respuesta.mensaje,
        icon: respuesta.tipo
    }).then((result) => {
        if (respuesta.tipo == "success") {
            window.location.href = redirect
        }
    })
}

/*
Convierte un ArrayBuffer en una cadena Base64.
Se utiliza para convertir en una imagen visible, la cadena
de texto guardada en MongoDB.
*/
function arrayBufferToBase64(buffer) {
    var binary = ''
    var bytes = new Uint8Array(buffer.data)
    var len = bytes.byteLength

    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }

    return window.btoa(binary)
}

//Formatea la fecha como "mañana", "pasado mañana" o fecha normal
function formatearFechaConDiferencia(fecha) {
    fecha = new Date(fecha)
    var fechaFormateada = ""

    const fechaActual = new Date()

    const fechaManana = new Date()
    fechaManana.setDate(fechaActual.getDate() + 1)

    const fechaPasadoManana = new Date();
    fechaPasadoManana.setDate(fechaActual.getDate() + 2)

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    const diaSemana = diasSemana[fecha.getDay()]
    const diaMes = fecha.getDate()
    const mes = meses[fecha.getMonth()]
    const año = fecha.getFullYear()

    //Comprueba si la fecha es mañana, pasado mañana o más allá.
    if (fecha.getFullYear() === fechaActual.getFullYear() && fecha.getMonth() === fechaActual.getMonth() && fecha.getDate() === fechaActual.getDate()) {
        fechaFormateada = "Hoy - "
    } else if (fecha.getFullYear() === fechaManana.getFullYear() && fecha.getMonth() === fechaManana.getMonth() && fecha.getDate() === fechaManana.getDate()) {
        fechaFormateada = "Mañana - "
    } else if (fecha.getFullYear() === fechaPasadoManana.getFullYear() && fecha.getMonth() === fechaPasadoManana.getMonth() && fecha.getDate() === fechaPasadoManana.getDate()) {
        //Compueba si la fecha es pasado mañana
        fechaFormateada = "Pasado mañana - "
    }

    return `${fechaFormateada} ${diaSemana} ${diaMes} de ${mes} de ${año}`
}