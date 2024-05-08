const { parentPort } = require('worker_threads');
const ObtenerIdsPlatos = require('./app'); // Ajusta la ruta según la estructura de tus archivos

const Plato = require("./schemes/Plato")
const PlatoDia = require("./schemes/PlatoDia")

function BucleGestorCalendario() {
    //setInterval(() => {
    console.log('Gestor de gestores o troll de trolles, gran Philippe');
    CargarPlatosDelMes();
    //}, 1000);
}

BucleGestorCalendario();

//Envía un mensaje al hilo principal para indicar que el worker está listo
//No sé para qué sirve o si realmente sirve
parentPort.postMessage({ status: 'ready' });

//Busca todos días de aquí a un mes y añade dos platos a los días que no tengan.
async function CargarPlatosDelMes() {
    try {
        const ids = ObtenerIdsPlatos()
        console.log(ids)
        // Obtener todos los ids de los platos existentes
        console.log("Cargando _id's de los platos...")
        const resultado = await Plato.find({}, '_id')
        const idsPlatos = resultado.map(plato => plato._id);
        console.log(idsPlatos);

        const hoy = new Date();
        const proximoDiaSemana = new Date(hoy);
        proximoDiaSemana.setDate(proximoDiaSemana.getDate() + 7);

        for (let fecha = new Date(hoy); fecha <= proximoDiaSemana; fecha.setDate(fecha.getDate() + 1)) {
            const año = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Poner dos dígitos en el mes
            const dia = String(fecha.getDate()).padStart(2, '0'); // Poner dos dígitos en el día
            const fechaFormateada = `${año}-${mes}-${dia}`;

            await AddPlatoAlDia(idsPlatos, fechaFormateada);
        }
    } catch (error) {
        console.log("Error al cargar los IDs de los platos: " + error);
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