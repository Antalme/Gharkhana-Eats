const { parentPort } = require('worker_threads')
const axios = require('axios')

function BucleGestorCalendario() {
    //setInterval(() => {
    console.warn('TODO: HACER QUE EL WORKER SE EJECUTE CADA X TIEMPO')
    CargarPlatosDelMes()
    //}, 1000);
}

//Busca todos días de aquí a un mes y añade dos platos a los días que no tengan.
async function CargarPlatosDelMes() {
    try {
        //Obtiene una lista con la ID de todos los platos.
        const respuestaPlatos = await axios.get('http://localhost:3000/obtener-platos-ids')
        const idsPlatos = respuestaPlatos.data.map(plato => plato._id)

        //Obtiene la lista de los días que ya tienen platos asignados. 
        const respuestaMenus = await axios.get('http://localhost:3000/obtener-menus')
        const menus = respuestaMenus.data

        //Obtiene la fecha de los días desde hoy hasta la semana que viene.
        const diasHastaSiguienteSemana = obtenerFechasHastaSiguienteSemana()

        //Itera sobre todas las fechas desde el día actual hasta dentro de una semana.
        for (var i = 0; i < diasHastaSiguienteSemana.length; i++) {
            const diaSemana = diasHastaSiguienteSemana[i]
            var existe = false

            //Itera sobre todos los días con platos para comprobar si ya existe un plato para ese día.
            for (var j = 0; j < menus.length; j++) {
                menuDia = menus[j]

                if (diaSemana == menuDia.fecha) {
                    existe = true
                    break
                }
            }
            
            //Si no se ha encontrado ningún plato para ese día, lo añade de forma aleatoria (mañana y noche).
            if (!existe) {
                const platoAleatorioManana = idsPlatos[Math.floor(Math.random() * idsPlatos.length)]
                const platoAleatorioNoche = idsPlatos[Math.floor(Math.random() * idsPlatos.length)]

                await axios.post('http://localhost:3000/guardar-menu', {
                    fecha: diaSemana,
                    idPlatoManana: platoAleatorioManana,
                    idPlatoNoche: platoAleatorioNoche
                }).then(res => {
                    console.log(res.data.message);
                }).catch(error => {
                    console.error("Error al enviar la solicitud:", error);
                })
            }
        }

        //Elimina los días anteriores a la fecha actual.
        await axios.post('http://localhost:3000/eliminar-menus-anteriores')
        .then(res => {
            console.log(res.data.message)
        }).catch(error => {
            console.error("Error al enviar la solicitud:", error)
        })

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
BucleGestorCalendario()

//Envía un mensaje al hilo principal para indicar que el worker está listo
//No sé para qué sirve o si realmente sirve
parentPort.postMessage({ status: 'ready' })