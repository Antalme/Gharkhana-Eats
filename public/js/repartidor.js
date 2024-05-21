document.addEventListener('DOMContentLoaded', function () {
    cargarEntregas()
})

function cargarEntregas() {
    $.ajax({
        url: "/usuarios-obtener-aptos",
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