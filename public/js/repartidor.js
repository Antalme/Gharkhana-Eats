document.addEventListener('DOMContentLoaded', function () {
    cargarEntregas()
})

function cargarEntregas() {
    $.ajax({
        url: "/obtener-direcciones-usuarios",
        method: "GET",
        success: function (response) {
            //Añade la calle en la que se encuentra el negocio.
            response.unshift("Calle Tirso de Molina 35")

            $("#boton_abrirRuta").click(function () {
                window.open(generarRuta(response), '_blank');
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: ", status, error);
        }
    });
}