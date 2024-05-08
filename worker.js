const { parentPort } = require('worker_threads')
const axios = require('axios')

const Plato = require("./schemes/Plato")
const PlatoDia = require("./schemes/PlatoDia")
const Usuario = require('./schemes/Usuario')

function BucleGestorCalendario() {
    //setInterval(() => {
    console.log('Gestor de gestores o troll de trolles, gran Philippe')
    CargarPlatosDelMes()
    //}, 1000);
}

BucleGestorCalendario();

//Envía un mensaje al hilo principal para indicar que el worker está listo
//No sé para qué sirve o si realmente sirve
parentPort.postMessage({ status: 'ready' })

//Busca todos días de aquí a un mes y añade dos platos a los días que no tengan.
async function CargarPlatosDelMes() {
    try {
        const response = await axios.post('http://0.0.0.0:3000/obtener-platos-ids')
        const idsPlatos = response.data
        console.log('IDs de los platos:', idsPlatos)
        return idsPlatos
    } catch (error) {
        console.error('Error al obtener los IDs de los platos:', error)
        throw new Error('Error al obtener los IDs de los platos')
    }
}

//Añade el plato al día.
function AddPlatoAlDia(idPlato, dia) {
    const nuevoDia = new PlatoDia({
        idPlato: idPlato,
        fecha: dia
    });

    nuevoDia.save()
        .then(platoDiaGuardado => {
            console.log("Añadido plato " + idPlato + " al día " + dia)
        })
        .catch(error => {
            console.error("Error al guardar el plato " + idPlato + " al día " + dia)
        });
}