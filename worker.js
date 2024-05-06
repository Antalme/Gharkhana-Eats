const { parentPort } = require('worker_threads');

function BucleGestorCalendario() {
    //setInterval(() => {
        console.log('Gestor de gestores o troll de trolles, gran Philippe');
    //}, 1000);
}

BucleGestorCalendario();

//Envía un mensaje al hilo principal para indicar que el worker está listo
//No sé para qué sirve o si realmente sirve
parentPort.postMessage({ status: 'ready' });