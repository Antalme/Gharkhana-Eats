document.addEventListener('DOMContentLoaded', function () {
    cargarListaPlatos()
    cargarListaUsuarios()

    $("#limpiarPlato").click(function () {
        limpiarCamposPlato()
    })

    $("#guardarPlato").click(function () {
        guardarPlato()
    })

    $("#eliminarPlato").click(function () {
        eliminarPlato()
    })

    $("#eliminarUsuario").click(function () {
        eliminarUsuario()
    })

    //Al pulsar en el botón de subir foto, simula que se ha hecho click en unbotón tipo fileinput
    //para que se abra el examniador de archivos del sistema operativo permitiendo elegir una foto.
    $("#cargarFotoPlato").click(function () {
        $("#archivoInput").click();
    })
    $("#archivoInput").change(function () {
        var archivo = event.target.files[0];
        // Verificar si se seleccionó un archivo
        if (archivo) {
            //Crear un objeto URL para la imagen seleccionada
            var urlImagen = URL.createObjectURL(archivo);
            //Actualizar el atributo src del elemento img
            document.getElementById('imagenPlato').src = urlImagen;
        } else {
            //Si no se seleccionó un archivo, restaura la imagen de marcador de posición
            //document.getElementById('imagenPlato').src = "/images/placeholder.png";
            $("#archivoInput").attr('src', imagenUrl);
        }
    })
})

/*
Hace una petición AJAX para cargar y poblar la lista de platos 
con todos los platos que existen en la base de datos.
*/
function cargarListaPlatos() {
    $.ajax({
        url: "/obtener-platos",
        method: "GET",
        success: function (response) {
            $('#listaPlatos').empty()

            response.forEach(function (plato, index) {
                const divPlato = `
                <div id="plato_${index}" class="plato">
                    ${plato.nombre}
                </div>
                `

                $('#listaPlatos').append(divPlato)

                $(`#plato_${index}`).click(function () {
                    cargarDatosPlato(plato)
                });
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: :", status, error)
        }
    })
}

//Vacía los campos del formulario plato.
function limpiarCamposPlato() {
    $("#idPlato").val("")
    $("#nombrePlato").val("")
    $("#ingredientesPlato").val("")
    $("#descripcionPlato").val("")
    $("#imagenPlato").attr('src', "");
    $("#archivoInput").val("");
}

//Carga los datos del plato pasado por parámetro.
function cargarDatosPlato(plato) {
    $("#idPlato").val(plato._id)
    $("#nombrePlato").val(plato.nombre)
    $("#ingredientesPlato").val(plato.ingredientes)
    $("#descripcionPlato").val(plato.descripcion)

    var imagenUrl = 'data:' + plato.imagen.contentType + ';base64,' + arrayBufferToBase64(plato.imagen.data)
    $("#imagenPlato").attr('src', imagenUrl)
}

//Guardar o edita el plato dependiendo de si el campo ID tiene algo escrito.
function guardarPlato() {
    // Comprobación de datos incorrectos.
    if ($("#nombrePlato").val() == "") {
        mostrarMensaje({ titulo: "Nombre no introducido", mensaje: "El plato debe tener un nombre", tipo: "warning" });
        return
    }
    if ($("#descripcionPlato").val() == "") {
        mostrarMensaje({ titulo: "Descripción no introducida", mensaje: "El plato debe tener una descripción", tipo: "warning" });
        return
    }
    if ($("#ingredientesPlato").val() == "") {
        mostrarMensaje({ titulo: "Ingredientes no introducidos", mensaje: "Se debe especificar los ingredientes que lleva el plato", tipo: "warning" });
        return
    }
    if ($("#archivoInput").val() == "") {
        mostrarMensaje({ titulo: "Foto no cargada", mensaje: "Se debe cargar una imagen que represente al plato", tipo: "warning" });
        return
    }

    var formData = new FormData();
    var archivo = $('#archivoInput').get(0).files[0];

    formData.append('idPlato', $("#idPlato").val());
    formData.append('nombrePlato', $("#nombrePlato").val());
    formData.append('ingredientesPlato', $("#ingredientesPlato").val());
    formData.append('descripcionPlato', $("#descripcionPlato").val());
    formData.append('imagen', archivo);

    $.ajax({
        url: '/guardar-plato',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false, //Evita que jQuery procese los datos
        success: function (data) {
            mostrarMensaje(data)
        },
        error: function (error) {
            console.error(error)
            mostrarMensaje(error.responseText)
        }
    })
}

//Elimina el plato de la base de datos utilizando su ID.
function eliminarPlato(idPlato) {
    $.ajax({
        url: '/eliminar-plato',
        method: 'POST',
        data: {
            idPlato: $("#idPlato").val(),
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

/*
Hace una petición AJAX para cargar y poblar la lista de usuarios 
con todos los usuarios que existen en la base de datos.
*/
function cargarListaUsuarios() {
    $.ajax({
        url: "/obtener-usuarios",
        method: "GET",
        success: function (response) {
            $('#listaUsuarios').empty()

            response.forEach(function (usuario, index) {
                const divUsuario = `
                <div id="usuario_${index}" class="usuario">
                    ${usuario.nombre}
                </div>
                `

                $('#listaUsuarios').append(divUsuario)

                $(`#usuario_${index}`).click(function () {
                    cargarDatosUsuario(usuario)
                });
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: :", status, error)
        }
    })
}

//Carga los datos del usuario pasado por parámetro.
function cargarDatosUsuario(usuario) {
    $("#idUsuario").val(usuario._id)
    $("#nombreUsuario").val(usuario.nombre)
    $("#emailUsuario").val(usuario.email)
    $("#passUsuario").val(usuario.pass)

    var imagenUrl = 'data:' + plato.imagen.contentType + ';base64,' + arrayBufferToBase64(plato.imagen.data)
    $("#imagenPlato").attr('src', imagenUrl)
}

//Elimina el usuario de la base de datos utilizando su ID.
function eliminarUsuario(idUsuario) {
    $.ajax({
        url: '/eliminar-usuario',
        method: 'POST',
        data: {
            idUsuario: $("#idUsuario").val(),
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
