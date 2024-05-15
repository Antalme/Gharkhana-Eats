//Importación de módulos
const { Worker } = require('worker_threads')
var worker = null
const express = require("express")
const session = require("express-session")
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

//Schemes
const Usuario = require("./schemes/Usuario")
const Plato = require("./schemes/Plato")
const Menus = require("./schemes/Menus")

const DB_URI = "mongodb+srv://hegispok:OMqUNsN286sFKvJt@clustergke0.xe4ond6.mongodb.net/gke?retryWrites=true&w=majority&appName=ClusterGKE0"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'favicon.ico'))); //Favicon
app.use(express.static('public'));
app.set("view engine", "ejs");

//Configura multer para manejar la carga de archivos
const storage = multer.memoryStorage(); //Almacena la imagen en memoria
const upload = multer({ storage: storage });

//Conexión con la base de datos de MongoDB
mongoose.connect(DB_URI).then((result) => {
    console.log("Conectado correctamente a la BD: " + result)

    //app.listen(puerto, () => {
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
        maxAge: 30000
    }
}))

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect("/login")
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

app.get('perfil', function (req, res) {
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

app.get('/administracion', function (req, res) {
    res.render("administracion.ejs")
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
        cancel_url: 'http://localhost:3000/compra-cancelada'
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
        cancel_url: 'http://localhost:3000/compra-cancelada'
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
// ----------- API REST ------------
// ---------------------------------


//[USUARIOS]

//Maneja los inicios de sesión.
app.post('/login', function (req, res) {
    const username = req.body.usuario;
    const pass = req.body.pass;

    // Buscar el usuario en MongoDB
    Usuario.findOne({ $and: [{ nombre: username }, { pass: pass }] }).then((usuarioExistente) => {
        if (usuarioExistente) {
            req.session.isAuth = true
            req.session.username = username;
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
                nombre: username,
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

app.get('/obtener-usuarios', function (req, res) {
    Usuario.find().then((resultado) => {
        res.send(resultado)
    }).catch((error) => {
        console.log("Error: " + error)
    })
})

//Devuelve el usuario pasado por GET
app.get('/obtener-usuario', function (req, res) {
    Usuario.find().then((resultado) => {
        res.send(resultado)
    }).catch((error) => {
        console.log("Error: " + error)
    })
})

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
            });
        });
})


//[PLATOS]

app.get('/obtener-platos', function (req, res) {
    Plato.find().then((resultado) => {
        res.send(resultado)
    }).catch((error) => {
        console.log("Error: " + error)
    })
})

app.get('/obtener-plato', function (req, res) {
    Plato.findById("662626b0a018fb0bdd33b33f").then((resultado) => {
        res.send(resultado)
    }).catch((error) => {
        console.log("Error: " + error)
    })
})

app.get('/obtener-platos-ids', function (req, res) {
    Plato.find({}, '_id')
        .then(idsPlatos => {
            res.status(200).json(idsPlatos);
        })
        .catch(error => {
            console.error("Error al obtener los IDs de los platos:", error);
            res.status(500).json({ error: "Error al obtener los IDs de los platos" });
        });
})

app.post('/guardar-plato', upload.single('imagen'), function (req, res) {
    const { idPlato, nombrePlato, ingredientesPlato, descripcionPlato } = req.body;

    //Convierte la imagen a un Buffer y obtiene su tipo de contenido
    const imagenData = req.file.buffer;
    const contentType = req.file.mimetype;

    //Si tiene ID, hay que actualizar los datos del plato
    if (idPlato) {
        // Encontrar el plato existente en la base de datos
        Plato.findById(idPlato)
            .then(platoExistente => {
                platoExistente.nombre = nombrePlato;
                platoExistente.descripcion = descripcionPlato;
                platoExistente.ingredientes = ingredientesPlato;
                platoExistente.imagen.data = req.file.buffer;
                platoExistente.imagen.contentType = req.file.mimetype;

                return platoExistente.save();
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

app.get('/obtener-menus', function (req, res) {
    Menus.find({})
        .then(platosDia => {
            res.status(200).json(platosDia)
        })
        .catch(error => {
            console.error("Error al obtener los platos del día:", error)
            res.status(500).json({ error: "Error al obtener los platos del día" })
        })
})

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

//Elimina todos los menús que anteriores a la fecha actual.
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