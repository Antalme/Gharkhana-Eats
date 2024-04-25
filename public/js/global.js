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