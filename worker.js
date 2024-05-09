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

//Busca todos días de aquí a un mes y añade dos platos a los días que no tengan.
async function CargarPlatosDelMes() {
    try {
        //Obtiene una lista con la ID de todos los platos.
        const respuestaPlatos = await axios.post('http://0.0.0.0:3000/obtener-platos-ids')
        const idsPlatos = respuestaPlatos.data.map(plato => plato._id)

        //Obtiene la lista de los días que ya tienen platos asignados. 
        const respuestaDiasConPlato = await axios.post('http://0.0.0.0:3000/obtener-platos-semana')
        const diasConPlato = respuestaDiasConPlato.data.map(plato => plato._id);

        //Obtiene la fecha de los días desde hoy hasta la semana que viene.
        const diasHastaSiguienteSemana = obtenerFechasHastaSiguienteSemana()

        //Itera sobre todas las fechas desde el día actual hasta dentro de una semana.
        for (var i = 0; i < diasHastaSiguienteSemana.length; i++) {
            console.log("Buscando si el día " + diasHastaSiguienteSemana[i] + " tiene platos")
            var existe = false
            //Itera sobre todos los días con platos para comprobar si ya existe un plato para ese día.
            for (var j = 0; j < respuestaDiasConPlato.length; j++) {
                if (diasHastaSiguienteSemana[i] == respuestaDiasConPlato[j]) {
                    console.log("El plato existe")
                    existe = true
                    break
                }
            }

            //Si no se ha encontrado ningún plato para ese día, lo añade de forma aleatoria.
            if (!existe) {
                console.log("   No tiene plato")
                const platoAleatorioMañana = idsPlatos[Math.floor(Math.random() * idsPlatos.length)]
                //console.log("Plato: " + platoAleatorioMañana + " del día " + platoAleatorioMañana)
                const platoAleatorioNoche = idsPlatos[Math.floor(Math.random() * idsPlatos.length)]
                //console.log("Plato: " + platoAleatorioNoche + " en la comida del")

                await axios.post('http://0.0.0.0:3000/guardar-plato-dia', {
                    fecha: "a",
                    idPlato: "b",
                    hora: "c"
                })
            }
        }

    } catch (error) {
        console.error('Error al obtener los IDs de los platos:', error)
        throw new Error('Error al obtener los IDs de los platos')
    }
}

function obtenerFechasHastaSiguienteSemana() {
    const fechas = []
    const hoy = new Date()
    const proximoDiaSemana = new Date(hoy)

    // Obtener el día de la semana del próximo día
    proximoDiaSemana.setDate(proximoDiaSemana.getDate() + 7)

    // Agregar las fechas hasta el próximo día de la semana
    for (let fecha = new Date(hoy); fecha <= proximoDiaSemana; fecha.setDate(fecha.getDate() + 1)) {
        const año = fecha.getFullYear()
        const mes = String(fecha.getMonth() + 1).padStart(2, '0') // Poner dos dígitos en el mes
        const dia = String(fecha.getDate()).padStart(2, '0') // Poner dos dígitos en el día
        const fechaFormateada = `${año}-${mes}-${dia}`
        fechas.push(fechaFormateada)
    }

    return fechas
}

//Comienza el bucle.
BucleGestorCalendario();

//Envía un mensaje al hilo principal para indicar que el worker está listo
//No sé para qué sirve o si realmente sirve
parentPort.postMessage({ status: 'ready' })