document.addEventListener('DOMContentLoaded', function () {
    $("#botonContratarSemana").click(function () {
        checkoutSemana()
    })
})

//Redirecciona a la página de checkout para suscribirte semanalmente.
function checkoutSemana(){
    $.ajax({
        url: "/checkout-semanal",
        method: "POST",
        success: function (response) {
           window.location.href = response.url
        },
        error: function (xhr, status, error) {
            mostrarMensaje({ titulo: "Fallo al cargar los datos de la compra", mensaje: "El proveedor del servicio de compras actualmente no está disponible.\nEspera unos minutos e inténtalo de nuevo\n" + error, tipo: "error" })
        }
    })
}