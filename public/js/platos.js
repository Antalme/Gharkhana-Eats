document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        url: "/obtener-platos",
        method: "GET",
        success: function (response) {
            $('#platos').empty()

            response.forEach(function (plato) {
                console.log(plato)
                const divPlato = `
                <div id="platos">
                    <div class="plato">
                        <div class="foto">FOTO</div>
                        <div class="datos">
                            <div class="titulo">${plato.nombre}</div>
                            <div class="ingredientes">${plato.ingredientes}</div>
                            <div class="desc">Descripcion</div>
                        </div>
                    </div>
                </div>
                `

                $('#platos').append(divPlato)
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: :", status, error)
        }
    });
});