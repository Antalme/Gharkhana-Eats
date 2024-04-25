document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.querySelector('form')
    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        $.ajax({
            url: '/login',
            method: 'POST',
            data: {
                usuario: $("#usuario").val(),
                pass: $("#pass").val()
            },
            success: function (data) {
                mostrarMensaje(data)
            },
            error: function (error) {
                console.error(error)
                mostrarMensaje(error.responseText)
            }
        });
    });
});