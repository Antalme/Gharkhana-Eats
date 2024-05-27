let ingredienteNumero = 0

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

    $("#eliminarTodosUsuarios").click(function () {
        Swal.fire({
            title: 'ELIMINACIÓN DE TODOS LOS USUARIOS',
            text: '¡ESTA ACCIÓN NO SE PUEDE DESHACER!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF0000',
            cancelButtonColor: '#0000FF',
            confirmButtonText: 'Sí, quiero eliminarlos TODOS',
            cancelButtonText: 'No, no quiero eliminarlos'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTodosUsuarios()
            }
        });
    })

    $("#guardarUsuario").click(function () {
        guardarUsuario()
    })

    $("#anadirIngrediente").click(function () {
        const ingredientes = $("#nombreIngrediente").val()
        const cantidad = $("#cantidadIngrediente").val()
        const unidad = $('input[name="unidadMedida"]:checked').val()

        anadirIngrediente(true, ingredientes, cantidad, unidad)
    })

    $("#eliminarIngrediente").click(function () {
        const numeroIngrediente = $("#numeroIngrediente").val()

        eliminarIngrediente(numeroIngrediente)
    })

    $("#eliminarIngredientes").click(function () {
        eliminarIngrediente()
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
            $("#sublistaPlatos").text("Platos totales: " + response.length)

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
    $("#listaIngredientes").empty()
    
    $("#idPlato").val(plato._id)
    $("#nombrePlato").val(plato.nombre)
    $("#ingredientesPlato").val(plato.ingredientes)
    $("#descripcionPlato").val(plato.descripcion)

    ingredienteNumero = 0
    for (var i = 0; i < plato.ingredientes.length; i++) {
        var ingrediente = plato.ingredientes[i]

        const nombre = ingrediente.nombre
        const cantidad = ingrediente.cantidad
        const unidad = ingrediente.unidad

        anadirIngrediente(false, nombre, cantidad, unidad)
    }

    var imagenUrl = 'data:' + plato.imagen.contentType + ';base64,' + arrayBufferToBase64(plato.imagen.data)
    $("#imagenPlato").attr('src', imagenUrl)
}

/*
Añade o actualiza el ingrediente con los datos que se han introducido.
needCheck es un flag que permite saltarse el checkeo de los campos introducidos
para permitir la introducción de ingredientes de forma automática.
*/
function anadirIngrediente(needCheck, ingrediente, cantidad, unidad) {
    if (needCheck) {
        if ($("#nombreIngrediente").val() == "") {
            mostrarMensaje({ titulo: "Ingrediente no introducido", mensaje: "Debes introducir el nombre del ingrediente", tipo: "warning" });
            return
        }

        if ($("#cantidadIngrediente").val() == "") {
            mostrarMensaje({ titulo: "Cantidad no introducida", mensaje: "Debes introducir la cantidad del ingrediente", tipo: "warning" });
            return
        }

        if (!$("input[name='unidadMedida']:checked").val()) {
            mostrarMensaje({ titulo: "Unidad de medida no seleccionada", mensaje: "Debes seleccionar la unidad de medida del ingrediente", tipo: "warning" });
            return;
        }
    }

    ingredienteNumero++

    $("#listaIngredientes").append(`
        <div id="ingrediente_${ingredienteNumero}" class="ingrediente">
            <a class="ingredienteNombre" id="ingredienteNombre_${ingredienteNumero}">${ingrediente}</a>: <a class="ingredienteCantidad" id="ingredienteCantidad_${ingredienteNumero}">${cantidad}</a>  <a class="ingredienteUnidad" id="ingredienteUnidad_${ingredienteNumero}">${unidad}</a>
        </div>
    `);

    (function (numero) {
        $(`#ingrediente_${numero}`).click(function () {
            cargarDatosIngrediente(numero, ingrediente, cantidad, unidad);
        });
    })(ingredienteNumero);
}

//Eliminar el ingrediente seleccionado.
function eliminarIngrediente(numeroIngrediente) {
    $("#ingrediente_" + numeroIngrediente).remove()
    $("#eliminarIngrediente").prop("disabled", true)
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
    if ($("#archivoInput").val() == "") {
        mostrarMensaje({ titulo: "Foto no cargada", mensaje: "Se debe cargar una imagen que represente al plato", tipo: "warning" });
        return
    }

    var formData = new FormData()
    var archivo = $('#archivoInput').get(0).files[0]

    formData.append('idPlato', $("#idPlato").val())
    formData.append('nombrePlato', $("#nombrePlato").val())
    formData.append('descripcionPlato', $("#descripcionPlato").val())
    formData.append('imagen', archivo)

    //Obtiene los ingredientes
    var ingredientes = []

    $(".ingrediente").each(function (index, element) {
        var $element = $(element);
    
        const nombreIngrediente = $element.find(".ingredienteNombre").text()
        const cantidadIngrediente = $element.find(".ingredienteCantidad").text()
        const medidaIngrediente = $element.find(".ingredienteUnidad").text()

        ingredientes.push({ nombre: nombreIngrediente, cantidad: Number(cantidadIngrediente), unidad: medidaIngrediente })
    })

    formData.append('ingredientesPlato', JSON.stringify(ingredientes))

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

function cargarDatosIngrediente(numero, ingrediente, cantidad, unidad) {
    $("#numeroIngrediente").val(numero)
    $("#nombreIngrediente").val(ingrediente)
    $("#cantidadIngrediente").val(cantidad)
    $('input[name="unidadMedida"][value="' + unidad + '"]').prop('checked', true);

    $("#eliminarIngrediente").prop("disabled", false)
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
            $("#sublistaUsuarios").text("Usuarios totales: " + response.length)

            response.forEach(function (usuario, index) {
                const divUsuario = `
                <div id="usuario_${index}" class="usuario">
                    ${usuario.nombreUsuario}
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
    //Habilita los botones de gestión de usuario
    $("#guardarUsuario").prop("disabled", false)
    $("#eliminarUsuario").prop("disabled", false)

    //Carga los datos del usuario en los campos definidos
    $("#idUsuario").val(usuario._id)
    $("#nombreUsuario").val(usuario.nombreUsuario)
    $("#emailUsuario").val(usuario.email)
    $("#passUsuario").val(usuario.pass)
    $("#rangoUsuario").val(usuario.rango)
    $("#planUsuario").val(usuario.planActual)
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

//Eliminar todos los usuarios de la base de datos.
function eliminarTodosUsuarios() {
    $.ajax({
        url: '/eliminar-todos-usuarios',
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

//Actualiza el usuario seleccionado.
function guardarUsuario() {
    $.ajax({
        url: '/cambiar-rango-usuario',
        method: 'POST',
        data: {
            idUsuario: $("#idUsuario").val(),
            rango: $("#rangoUsuario").val()
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