document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        url: "/obtener-platos",
        method: "GET",
        success: function (response) {
            $('#platos').empty()

            response.forEach(function (plato) {
                var imagenUrl = 'data:' + plato.imagen.contentType + ';base64,' + arrayBufferToBase64(plato.imagen.data);

                const divPlato = `
                <div id="platos">
                    <div class="plato">
                    <div class="fotoDiv">
                        <img class="foto" src="${imagenUrl}" alt="Imagen del plato">
                    </div>
                    <div class="datos">
                            <div class="titulo">${plato.nombre}</div>
                            <div class="ingredientes">${plato.ingredientes}</div>
                            <div class="desc">${plato.descripcion}</div>
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