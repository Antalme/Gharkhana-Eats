document.addEventListener('DOMContentLoaded', function() {
    const mensajeFlotante = document.getElementById('mensajeFlotante');

    // Función para mostrar el mensaje flotante
    function mostrarMensaje(mensaje, exito) {
        mensajeFlotante.textContent = mensaje;

        if (exito) {
            mensajeFlotante.style.backgroundColor = '#d4edda'; // Color de fondo verde para éxito
        } else {
            mensajeFlotante.style.backgroundColor = '#f8d7da'; // Color de fondo rojo para error
        }

        mensajeFlotante.classList.add('mostrar');

        //Oculta el mensaje tras cierto tiempo
        setTimeout(function() {
            mensajeFlotante.classList.remove('mostrar');
        }, 3000);
    }

    //Función que envis el formulario y maneja la respuesta
    const formulario = document.querySelector('form');
    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        fetch('/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: document.getElementById("usuario").value,
                email: document.getElementById("email").value,
                pass: document.getElementById("pass").value
            })
        })
        .then(response => response.text())
        .then(data => {
            if (data === 'Usuario registrado correctamente.') {
                mostrarMensaje(data, true);
            } else {
                mostrarMensaje(data, false);
            }
        })
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
            mostrarMensaje('Ocurrió un error. Por favor, intenta de nuevo.', false);
        });
    });
});