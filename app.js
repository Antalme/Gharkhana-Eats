//Importación de módulos
const { Worker } = require('worker_threads')
var worker = null
const express = require("express")
const session = require("express-session")
const bodyParser = require('body-parser');
const Stripe = require("stripe")
const mongoose = require("mongoose")
const MongoDBSession = require("connect-mongodb-session")(session)
const multer = require('multer');
const path = require("path")
const favicon = require('serve-favicon')
const app = express();

const stripe = new Stripe("sk_test_51PFaWnCjZnfRslZLQxWaspzwIwLmzIJCIn8wGrfOMZvMyndv1WCwMj0PEgL4tzWKFgoGYcBtqKHPgr8AV4z4a9W900tzN7ovON")

//Variables
const puerto = 3000
const hostname = "0.0.0.0"

const tiempoSesion = 3600000 //En milisegundos (86400000 = 24 horas / 3600000 = 1 hora)

//Schemes
const Usuario = require("./schemes/Usuario")
const Plato = require("./schemes/Plato")
const Menus = require("./schemes/Menus")

const DB_URI = "mongodb+srv://hegispok:OMqUNsN286sFKvJt@clustergke0.xe4ond6.mongodb.net/gke?retryWrites=true&w=majority&appName=ClusterGKE0"

app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'favicon.ico'))); //Favicon
app.use(express.static('public'));
app.set("view engine", "ejs");
//app.use(bodyParser.raw({type: 'application/json'}));
app.use(express.json({
    limit: '5mb',
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

//Configura multer para manejar la carga de archivos
const storage = multer.memoryStorage(); //Almacena la imagen en memoria
const upload = multer({ storage: storage });

//Conexión con la base de datos de MongoDB
mongoose.connect(DB_URI).then((result) => {
    console.log("Conectado correctamente a la BD: " + result)

    app.listen(puerto, hostname, () => {
        console.log("Servidor corriendo por " + hostname + ":" + puerto)

        //Cuando todo esté corriendo, se pone a funcionar el worker.
        worker = new Worker('./worker.js')
    })
}).catch((error) => {
    console.log("Error: " + error)
})

const store = new MongoDBSession({
    uri: DB_URI,
    collection: "sesiones"
})

app.use(session({
    secret: 'secretooo',
    resave: true,
    saveUnitialized: false,
    store: store,
    cookie: {
        maxAge: tiempoSesion
    }
}))

// ---------------------------------
// ---------- MIDDLEWARES ----------
// ---------------------------------

//Evita que el usuario pase si no tiene la sesión iniciada.
function necesitaRegistro(req, res, next) {
    if (req.session.isAuth) {
        return next();
    } else {
        res.redirect("/login")
    }
}

//Evita que el usuario pase si no tiene el rango "Administrador".
function necesitaAdministrador(req, res, next) {
    if (req.session.rango == "Administrador") {
        return next();
    } else {
        res.redirect("/")
    }
}

function necesitaCocinero(req, res, next) {
    if (req.session.rango == "Cocinero") {
        return next();
    } else {
        res.redirect("/")
    }
}

//Evita que el usuario pase si no tiene el rango "Repartidor".
function necesitaRepartidor(req, res, next) {
    if (req.session.rango == "Repartidor") {
        return next();
    } else {
        res.redirect("/")
    }
}

// ---------------------------------
// ------------- VIEWS -------------
// ---------------------------------

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.get('/', function (req, res) {
    res.render("index.ejs")
})

app.get('/perfil', necesitaRegistro, function (req, res) {
    res.render("perfil.ejs")
})

app.get('/login', function (req, res) {
    res.render("login.ejs")
})

app.get('/logout', function (req, res) {
    req.session.destroy((err) => {
        if (err) throw err
        res.redirect("/")
    });
});

app.get('/registro', function (req, res) {
    res.render("registro.ejs")
})

app.get('/perfil', function (req, res) {
    res.render("perfil.ejs")
})

app.get('/platos', function (req, res) {
    res.render("platos.ejs")
})

app.get('/planes', function (req, res) {
    res.render("planes.ejs")
})

app.get('/calendario', function (req, res) {
    res.render("calendario.ejs")
})

app.get('/acercade', function (req, res) {
    res.render("acercade.ejs")
})

app.get('/administracion', necesitaAdministrador, function (req, res) {
    res.render("administracion.ejs")
})

app.get('/cocinero', necesitaCocinero, function (req, res) {
    res.render("cocinero.ejs")
})

app.get('/repartidor', necesitaRepartidor, function (req, res) {
    res.render("repartidor.ejs")
})

app.get('/test', function (req, res) {
    res.render("test.ejs")
})

app.post('/checkout-semanal', async function (req, res) {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    product_data: {
                        name: "Prueba de 1 semana",
                        description: 'Prueba el servicio Gharkhana Eats por una semana sin cobros automáticos. Cuando pase una semana, se acabará el servicio y no se te cobrará más.'
                    },
                    currency: 'eur',
                    unit_amount: 4999
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/compra-exitosa',
        cancel_url: 'http://localhost:3000/compra-cancelada',
        client_reference_id: req.session.idUsuario.toString(),
        metadata: {
            planComprado: 'Plan semanal',
        }
    })

    return res.json(session)
})

app.post('/checkout-mensual', async function (req, res) {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: 'price_1PG0nnCjZnfRslZLsaWU9eIp',
                quantity: 1
            }
        ],
        mode: 'subscription',
        success_url: 'http://localhost:3000/compra-exitosa',
        cancel_url: 'http://localhost:3000/compra-cancelada',
        client_reference_id: req.session.idUsuario.toString(),
        metadata: {
            planComprado: 'Plan mensual',
        }
    })

    return res.json(session)
});

app.get('/compra-exitosa', function (req, res) {

    res.render("compra-exitosa.ejs")
})

app.get('/compra-cancelada', function (req, res) {
    res.render("planes.ejs")
})

// ---------------------------------
// ------------ WEBHOOK ------------
// ---------------------------------

app.post('/webhook', async (req, res) => {
    console.log("/webhookk")

    const endpointSecret = "we_1PI8MQCjZnfRslZLSTRQ8sSJ"
    const sig = req.headers['stripe-signature']

    let event

    try {
        const datos = JSON.parse(req.rawBody)
        const idUsuario = datos.data.object.client_reference_id

        const usuario = await Usuario.findById(idUsuario);
        if (!usuario) {
            throw new Error('Usuario "' + idUsuario + '" no encontrado');
        }

        usuario.planActual = datos.data.object.metadata.planComprado;
        await usuario.save();

        res.status(200).send();
    } catch (err) {
        console.error('⚠️  Webhook signature verification failed.', err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

})

// ---------------------------------------------
// ----------- API REST - ENDPOINTS ------------
// ---------------------------------------------


//[USUARIOS]

//Maneja los inicios de sesión.
app.post('/login', function (req, res) {
    const username = req.body.usuario;
    const pass = req.body.pass;

    // Buscar el usuario en MongoDB
    Usuario.findOne({ $and: [{ nombreUsuario: username }, { pass: pass }] }).then((usuarioExistente) => {
        if (usuarioExistente) {
            //Guarda los datos importantes del usuario en el objeto de la sesión.
            req.session.isAuth = true
            req.session.idUsuario = usuarioExistente._id
            req.session.nombreUsuario = usuarioExistente.nombreUsuario;
            req.session.email = usuarioExistente.email;
            req.session.nombreCompleto = usuarioExistente.nombreCompleto;
            req.session.direccion = usuarioExistente.direccion;
            req.session.planActual = usuarioExistente.planActual;
            req.session.fechaRegistro = usuarioExistente.createdAt;
            req.session.rango = usuarioExistente.rango;

            res.send({
                titulo: "La abuelita te saluda",
                mensaje: "¡Bienvenido a Gharkhana Eats!",
                tipo: "success"
            })
        } else {
            res.send({
                titulo: "Usuario no encontrado",
                mensaje: "El nombre de usuario introducido no existe. Revisa los datos e inténtalo de nuevo.",
                tipo: "warning"
            })
        }
    }).catch((error) => {
        console.log(error);
        res.send("ERROR");
    });
});

//Maneja los registros.
app.post('/registro', function (req, res) {
    const username = req.body.usuario
    const email = req.body.email
    const pass = req.body.pass
    const nombreCompleto = req.body.nombreCompleto
    const direccion = req.body.direccion

    console.log(username, email, pass, nombreCompleto, direccion) //TODO: Eliminar

    Usuario.findOne({ $or: [{ nombre: username }, { email: email }] }).then((usuarioExistente) => {
        if (usuarioExistente) {
            if (usuarioExistente.nombre === username) {
                res.send({
                    titulo: "¡Aviso!",
                    mensaje: "El nombre de usuario que estás utilizando ya está en uso. ¡Prueba con otros diferentes!",
                    tipo: "warning"
                })
            } else {
                res.send({
                    titulo: "¡Aviso!",
                    mensaje: "El email que estás utilizando ya está en uso. Si ya te has registrado, puedes intentar iniciar sesión.",
                    tipo: "warning"
                })
            }
        } else {
            const usuario = new Usuario({
                nombreUsuario: username,
                email: email,
                pass: pass,
                nombreCompleto: nombreCompleto,
                direccion: direccion
            })

            usuario.save().then((result) => {
                res.send({
                    titulo: "¡Te has registrado con éxito!",
                    mensaje: "Tu cuenta se ha registrado correctamete. Ahora puedes iniciar sesión.",
                    tipo: "success"
                })
            }).catch((error) => {
                console.log(error);
                res.send({
                    titulo: "¡Registro fallido!",
                    mensaje: "Ha habido un error a la hora de registrar tu cuenta. Inténtalo de nuevo más tarde",
                    tipo: "error"
                });
            });
        }
    }).catch((error) => {
        console.log(error)
        res.send("ERROR")
    });
})

//Maneja el cambio de contraseña.
app.post('/cambiar-contrasena', function (req, res) {
    const { passActual, passNueva } = req.body;
    const idUsuario = req.session.idUsuario; // Obtener el ID del usuario desde la sesión

    console.log(req.session);
    console.log(passActual, passNueva, idUsuario);

    Usuario.findOne({ _id: idUsuario, pass: passActual })
        .then(usuario => {
            if (!usuario) {
                res.status(401).send({
                    titulo: "Error de autenticación",
                    mensaje: "Usuario no encontrado o contraseña actual incorrecta",
                    tipo: "error"
                });
                return;
            }

            usuario.pass = passNueva;

            return usuario.save();
        })
        .then(usuarioActualizado => {
            if (usuarioActualizado) {
                res.send({
                    titulo: "¡Contraseña cambiada con éxito!",
                    mensaje: "Tu contraseña ha sido cambiada y ya podrás usarla de aquí en adelante",
                    tipo: "success"
                });
            }
        })
        .catch(error => {
            console.error("Error: ", error);
            res.status(500).send({
                titulo: "Error del servidor",
                mensaje: "Hubo un error al procesar tu solicitud. Por favor, inténtalo nuevamente más tarde.",
                tipo: "error"
            });
        });
});

app.get('/obtener-usuarios', function (req, res) {
    Usuario.find().then((resultado) => {
        res.send(resultado)
    }).catch((error) => {
        console.log("Error: " + error)
    })
})

//Devuelve el usuario pasado por parámetros
app.get('/obtener-usuario', function (req, res) {
    Usuario.find().then((resultado) => {
        res.send(resultado)
    }).catch((error) => {
        console.log("Error: " + error)
    })
})

//Guarda los datos del usuario
app.post('/cambiar-rango-usuario', function (req, res) {
    const { idUsuario, rango } = req.body

    Usuario.findById(idUsuario)
        .then(usuario => {
            usuario.rango = rango

            return usuario.save()
        })
        .then(usuarioActualizado => {
            res.send({
                titulo: "¡Usuario actualizado!",
                mensaje: "El usuario se ha actualizado con éxito.",
                tipo: "success"
            })
        })
        .catch(error => {
            res.send({
                titulo: "¡Error!",
                mensaje: "El usuario no se ha podido actualizar:\n" + error,
                tipo: "error"
            })
        })
})

//Elimina el usuario pasado por parámetros.
app.post('/eliminar-usuario', function (req, res) {
    const { idUsuario } = req.body

    Usuario.deleteOne({ _id: idUsuario })
        .then(result => {
            if (result.deletedCount === 1) {
                res.send({
                    titulo: "Usuario eliminado",
                    mensaje: "El usuario se ha eliminado correctamente.",
                    tipo: "success"
                });
            } else {
                res.send({
                    titulo: "Error al eliminar",
                    mensaje: "No se encontró ningún usuario con ese ID.",
                    tipo: "error"
                });
            }
        })
        .catch(error => {
            res.send({
                titulo: "Error al eliminar",
                mensaje: "Hubo un error al eliminar el usuario.",
                tipo: "error"
            })
        })
})

//Elimina a TODOS los usuarios pasados por parámetros.
app.post('/eliminar-todos-usuarios', function (req, res) {
    Usuario.deleteMany({})
        .then(result => {
            if (result.deletedCount > 0) {
                res.send({
                    titulo: "Usuarios eliminados",
                    mensaje: "Todos los usuarios se han eliminado correctamente.",
                    tipo: "success"
                })
            } else {
                res.send({
                    titulo: "Error al eliminar",
                    mensaje: "No hay usuarios que eliminar.",
                    tipo: "error"
                })
            }
        })
        .catch(error => {
            res.send({
                titulo: "Error al eliminar",
                mensaje: "Hubo un error al eliminar los usuarios.",
                tipo: "error"
            })
        })
})


//[PLATOS]

app.get('/obtener-platos', function (req, res) {
    Plato.find().sort({
        hora: 1,    // Primero ordena por hora, donde 'almuerzo' vendría antes que 'cena'
        nombre: 1   // Luego ordena alfabéticamente por el campo nombre
    }).then((resultado) => {
        res.send(resultado)
    }).catch((error) => {
        console.log("Error: " + error)
        res.status(500).send("Hubo un error al obtener los platos.")
    })
})

app.get('/obtener-plato', function (req, res) {
    const { idPlato } = req.body

    Plato.findById(idPlato).then((resultado) => {
        res.send(resultado)
    }).catch((error) => {
        console.log("Error: " + error)
    })
})

//Obtiene las IDs de TODOS los platos y los separa en "almuerzo" y "cena".
app.get('/obtener-platos-ids', function (req, res) {
    Plato.find({ hora: "Almuerzo" }, '_id')
        .then(idsPlatosAlmuerzo => {
            // Obtener los platos cuya hora sea "Almuerzo"
            const almuerzo = idsPlatosAlmuerzo.map(plato => plato._id);

            // Obtener los platos cuya hora sea "Cena"
            Plato.find({ hora: "Cena" }, '_id')
                .then(idsPlatosCena => {
                    const cena = idsPlatosCena.map(plato => plato._id);

                    // Devolver las dos tablas como respuesta
                    res.status(200).json({ almuerzo, cena });
                })
                .catch(error => {
                    console.error("Error al obtener los IDs de los platos de cena:", error);
                    res.status(500).json({ error: "Error al obtener los IDs de los platos de cena" });
                });
        })
        .catch(error => {
            console.error("Error al obtener los IDs de los platos de almuerzo:", error);
            res.status(500).json({ error: "Error al obtener los IDs de los platos de almuerzo" });
        });
});

//Guarda el plato usando los datos pasados por parámetros.
app.post('/guardar-plato', upload.single('imagen'), function (req, res) {
    var { idPlato, nombrePlato, descripcionPlato, horaPlato, ingredientesPlato } = req.body
    ingredientesPlato = JSON.parse(ingredientesPlato)

    //Convierte la imagen a un Buffer y obtiene su tipo de contenido
    const imagenData = req.file.buffer;
    const contentType = req.file.mimetype;

    //Si tiene ID, hay que actualizar los datos del plato
    if (idPlato) {
        // Encontrar el plato existente en la base de datos
        Plato.findById(idPlato)
            .then(platoExistente => {
                platoExistente.nombre = nombrePlato
                platoExistente.descripcion = descripcionPlato
                platoExistente.hora = horaPlato
                platoExistente.ingredientes = ingredientesPlato
                platoExistente.imagen.data = req.file.buffer
                platoExistente.imagen.contentType = req.file.mimetype

                return platoExistente.save()
            })
            .then(platoActualizado => {
                res.send({
                    titulo: "¡Plato actualizado!",
                    mensaje: "El plato se ha actualizado con éxito.",
                    tipo: "success"
                });
            })
            .catch(error => {
                res.send({
                    titulo: "¡Error!",
                    mensaje: "El plato no se ha podido actualizar:\n" + error,
                    tipo: "error"
                });
            });
    } else {
        const nuevoPlato = new Plato({
            nombre: nombrePlato,
            descripcion: descripcionPlato,
            hora: horaPlato,
            ingredientes: ingredientesPlato,
            imagen: {
                data: imagenData,
                contentType: contentType
            }
        });

        nuevoPlato.save()
            .then(platoGuardado => {
                res.send({
                    titulo: "¡Plato guardado!",
                    mensaje: "El plato se ha guardado con éxito.",
                    tipo: "success"
                });
            })
            .catch(error => {
                res.send({
                    titulo: "¡Error!",
                    mensaje: "El plato no se ha podido guardar:\n" + error,
                    tipo: "error"
                });
            });
    }
})

//Eliminar el plato pasado por parámetro.
app.post('/eliminar-plato', function (req, res) {
    const { idPlato } = req.body

    Plato.deleteOne({ _id: idPlato })
        .then(result => {
            if (result.deletedCount === 1) {
                res.send({
                    titulo: "Plato eliminado",
                    mensaje: "El plato se ha eliminado correctamente.",
                    tipo: "success"
                })
            } else {
                res.send({
                    titulo: "Error al eliminar",
                    mensaje: "No se encontró ningún plato con ese ID.",
                    tipo: "error"
                })
            }
        })
        .catch(error => {
            res.send({
                titulo: "Error al eliminar",
                mensaje: "Hubo un error al eliminar el plato.",
                tipo: "error"
            })
        })
})

//[MENU]

//Obtiene todos los menús y los platos de esos menús relacionados.
app.get('/obtener-menus', function (req, res) {
    Menus.aggregate([
        {
            $lookup: {
                from: 'platos', // Nombre de la colección de platos en MongoDB
                localField: 'idPlatoManana', // Campo en la colección de menús
                foreignField: '_id', // Campo en la colección de platos
                as: 'platoManana' // Nombre del campo resultante
            }
        },
        {
            $lookup: {
                from: 'platos',
                localField: 'idPlatoNoche',
                foreignField: '_id',
                as: 'platoNoche'
            }
        },
        {
            $unwind: {
                path: '$platoManana',
                preserveNullAndEmptyArrays: true // Permitir menús sin plato de mañana
            }
        },
        {
            $unwind: {
                path: '$platoNoche',
                preserveNullAndEmptyArrays: true // Permitir menús sin plato de noche
            }
        },
        {
            $addFields: {
                platoManana: { $ifNull: ['$platoManana', null] },
                platoNoche: { $ifNull: ['$platoNoche', null] }
            }
        }
    ])
        .then(menusConPlatos => {
            res.status(200).json(menusConPlatos);
        })
        .catch(error => {
            console.error("Error al obtener los menús con platos:", error);
            res.status(500).json({ error: "Error al obtener los menús con platos" });
        });
});

//Guarda el menú pasado por parámetro.
app.post('/guardar-menu', function (req, res) {
    const { fecha, idPlatoManana, idPlatoNoche } = req.body;

    const nuevoPlatoDia = new Menus({
        fecha: fecha,
        idPlatoManana: idPlatoManana,
        idPlatoNoche: idPlatoNoche
    });

    nuevoPlatoDia.save()
        .then(platoDiaGuardado => {
            res.status(200).json({ message: "Menú del día " + fecha + " creado correctamente." });
        })
        .catch(error => {
            console.error(error)
            res.status(500).json({ error: "Error al guardar el plato en la base de datos" });
        });
})

//Elimina todos los menús que son anteriores a la fecha actual.
app.post('/eliminar-menus-anteriores', function (req, res) {
    //Obtiene la fecha actual
    var fechaActual = new Date()

    //Formatea la fecha actual para compararla con las fechas almacenadas en la base de datos
    var fechaActualFormateada = fechaActual.toISOString().split('T')[0]

    //Elimina los registros con fecha anterior a la actual
    Menus.deleteMany({ fecha: { $lt: fechaActualFormateada } })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: "Menús antiguos eliminados: " + result.deletedCount })
            }
        })
        .catch(error => {
            console.error(error)
            res.status(500).json({ error: "Error al eliminar los menus antiguos" })
        })
})

/*
Obtiene la cantidad total de ingredientes necesarios para cada uno de los platos
considerando la cantidad de usuarios cuyo plan actual sea "Plan semanal" o "Plan mensual".
*/
app.get('/obtener-cantidad-ingredientes', async function (req, res) {
    try {
        // Encuentra todos los usuarios cuyo plan actual sea "Plan semanal" o "Plan mensual"
        const usuarios = await Usuario.find({
            planActual: { $in: ['Plan semanal', 'Plan mensual'] }
        });

        // Objeto para almacenar la cantidad total de ingredientes necesarios para cada plato
        const cantidadIngredientesPlatos = {};

        // Itera sobre todos los platos
        const platos = await Plato.find();

        for (const plato of platos) {
            // Inicializa un objeto para almacenar los ingredientes detallados
            const ingredientesDetallados = {};

            // Itera sobre los ingredientes del plato
            for (const ingrediente of plato.ingredientes) {
                // Calcula la cantidad total de cada ingrediente para el número total de usuarios con planes semanales o mensuales
                const cantidadTotalIngrediente = ingrediente.cantidad * usuarios.length;

                // Almacena los detalles del ingrediente en el objeto
                ingredientesDetallados[ingrediente.nombre] = cantidadTotalIngrediente + " " + ingrediente.unidad;
            }

            // Almacena los ingredientes detallados del plato en el objeto principal
            cantidadIngredientesPlatos[plato.nombre] = ingredientesDetallados;
        }

        // Envía los detalles de los ingredientes necesarios para cada plato como respuesta
        res.send(cantidadIngredientesPlatos);
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).send("Error al obtener los detalles de los ingredientes necesarios");
    }
});

//Obtiene la dirección de todos los usuarios con algún
app.get('/obtener-direcciones-usuarios', function (req, res) {
    Usuario.find({ planActual: { $ne: 'Sin plan' } }, 'direccion')
        .then(usuarios => {
            // Extrae solo las direcciones de los usuarios y las envía como respuesta
            const direcciones = usuarios.map(usuario => usuario.direccion);
            res.send(direcciones);
        })
        .catch(error => {
            console.error("Error: ", error);
            res.status(500).send("Error al obtener las direcciones de los usuarios");
        });
});