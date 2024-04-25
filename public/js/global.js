document.addEventListener('DOMContentLoaded', function () {
    function mostrarMensaje(respuesta) {
        console.log(respuesta)
        Swal.fire({
            title: respuesta.titulo,
            text: respuesta.mensaje,
            icon: respuesta.tipo
        }).then((result) => {
            if (respuesta.tipo == "success") {
                window.location.href = '/'
            }
        })
    }
})