document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        url: "/obtener-menus",
        method: "GET",
        success: function (response) {
            $('#menus').empty()

            response.forEach(function (menu) {
                const fechaFormateada = formatearFechaConDiferencia(menu.fecha)

                const divMenu = `
                    <div class="menu">
                        <div class="fecha">
                            <h3>${fechaFormateada}</h3>
                            </div>
                            <div class="hora">
                                <h4>14:00</h4>
                            </div>
                            <div class="comida">${menu.idPlatoManana}</div>
                            <div class="hora">
                                <h4>20:00</h4>
                            </div>
                        <div class="comida">${menu.idPlatoNoche}</div>
                    </div>
                `

                $('#menus').append(divMenu)
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: :", status, error)
        }
    })
})