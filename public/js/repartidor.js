document.addEventListener('DOMContentLoaded', function () {
    cargarEntregas()
})

function cargarEntregas() {
    $.ajax({
        url: "/obtener-direcciones-usuarios",
        method: "GET",
        success: function (response) {
            $("#boton_abrirRuta").click(function () {
                window.open(generarRuta(response), '_blank');
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: ", status, error);
        }
    });
}