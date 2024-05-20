document.addEventListener('DOMContentLoaded', function () {
    cargarPlatosDestacados()
})

//Carga todos los platos de la base de datos y muestra 3 platos destacados aleatorios.
function cargarPlatosDestacados() {
    $.ajax({
        url: "/obtener-platos",
        method: "GET",
        success: function (response) {
            for (var i = 0; i < 3; i++) {
                const rnd = Math.floor(Math.random() * response.length)
                const plato = response[rnd]
                response.splice(rnd, 1) //Elimina el plato que ha tocado del array

                var imagenUrl = 'data:' + plato.imagen.contentType + ';base64,' + arrayBufferToBase64(plato.imagen.data)

                $("#platoDestacado" + i).append(`
                    <p class="nombrePlato">${plato.nombre}</p>
                    <img class="imagen" src="${imagenUrl}">
                `)
            }
        },
        error: function (xhr, status, error) {
            console.error("Error: :", status, error)
        }
    })
}