document.addEventListener('DOMContentLoaded', function () {
    cargarMenus()
})

function cargarMenus() {
    $.ajax({
        url: "/obtener-menus",
        method: "GET",
        success: function (response) {
            $('#menus').empty()

            response.forEach(function (menu) {
                const fechaFormateada = formatearFechaConDiferencia(menu.fecha)

                var imagenUrl_manana = 'data:' + menu.platoManana.imagen.contentType + ';base64,' + menu.platoManana.imagen.data
                var imagenUrl_noche = 'data:' + menu.platoNoche.imagen.contentType + ';base64,' + menu.platoNoche.imagen.data

                console.log(menu.platoNoche.imagen.data)

                const divMenu = `
                    <div class="menu">
                        <div class="fecha">
                            <h3>${fechaFormateada}</h3>
                            <hr>
                            </div>
                            <div class="cajaHora">
                                <div class="hora">
                                    <h4>14:00</h4>
                                </div>
                                <div class="comida">
                                    <div class="nombre">
                                        <p>${menu.platoManana.nombre}</p>
                                    </div>
                                    <img class="foto" src="${imagenUrl_manana}" alt="Imagen del plato">
                                </div>
                            </div>
                            <div class="cajaHora">
                                <div class="hora">
                                    <h4>20:00</h4>
                                </div>
                                <div class="comida">
                                    <div class="nombre">
                                        <p>${menu.platoNoche.nombre}</p>
                                    </div>
                                    <img class="foto" src="${imagenUrl_noche}" alt="Imagen del plato">
                                </div>
                            </div>
                    </div>
                `

                $('#menus').append(divMenu)
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: :", status, error)
        }
    })
}