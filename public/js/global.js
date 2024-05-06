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
Función que convierte un ArrayBuffer en una cadena Base64.
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