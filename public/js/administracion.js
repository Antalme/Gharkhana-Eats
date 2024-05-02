document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        url: "/obtener-platos",
        method: "GET",
        success: function (response) {
            $('#platos').empty()

            response.forEach(function (plato) {
                console.log(plato)
                const divPlato = `
                <div class="plato">
                    ${plato.nombre}
                </div>
                `

                $('#listaPlatos').append(divPlato)
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: :", status, error)
        }
    })

    $("#guardarPlato").click(function () {
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

        $.ajax({
            url: '/guardar-plato',
            method: 'POST',
            data: {
                nombrePlato: $("#nombrePlato").val(),
                ingredientesPlato: $("#ingredientesPlato").val(),
                descripcionPlato: $("#descripcionPlato").val()
            },
            success: function (data) {
                mostrarMensaje(data)
            },
            error: function (error) {
                console.error(error)
                mostrarMensaje(error.responseText)
            }
        })
    })

    //Al pulsar, simula que se ha hecho click en un botón tipo fileinput para que
    //se abra el examniador de archivos del sistema operativo permitiendo elegir una foto.
    $("#cargarFotoPlato").click(function () {
        $("#archivoInput").click();
    })
    $("#archivoInput").change(function () {
        var archivo = event.target.files[0];
        // Verificar si se seleccionó un archivo
        if (archivo) {
            // Crear un objeto URL para la imagen seleccionada
            var urlImagen = URL.createObjectURL(archivo);
            // Actualizar el atributo src del elemento img
            document.getElementById('imagenPlato').src = urlImagen;
        } else {
            // Si no se seleccionó un archivo, restaurar la imagen de marcador de posición
            document.getElementById('imagenPlato').src = "/images/placeholder.png";
        }
    })
})