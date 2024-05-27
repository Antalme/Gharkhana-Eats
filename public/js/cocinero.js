document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        url: "/obtener-cantidad-ingredientes",
        method: "GET",
        success: function (response) {
            Object.keys(response).forEach(function (plato) {
                $("#platos").append("<br><b>" + plato + "</b><br>")
                // Itera sobre cada ingrediente del plato
                Object.keys(response[plato]).forEach(function (ingrediente) {
                    $("#platos").append("&emsp;• " + response[plato][ingrediente] + "<br>")
                });
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: ", status, error);
        }
    });
});