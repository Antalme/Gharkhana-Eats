const express = require("express")
const session = require("express-session")
const mongoose = require("mongoose")
const MongoDBSession = require("connect-mongodb-session")(session)
const path = require("path")
const favicon = require('serve-favicon')
const app = express();

//Schemes
const Usuario = require("./schemes/Usuario")
const Plato = require("./schemes/Plato")

const DB_URI = "mongodb+srv://hegispok:OMqUNsN286sFKvJt@clustergke0.xe4ond6.mongodb.net/gke?retryWrites=true&w=majority&appName=ClusterGKE0"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'favicon.ico'))); //Favicon
app.use(express.static('public'));
app.set("view engine", "ejs");

//Conexión con la base de datos de MongoDB
mongoose.connect(DB_URI).then((result) => {
    console.log("Conectado correctamente a la BD: " + result)

    app.listen(3000, () => {
        console.log("Servidor corriendo...")
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

// ---------------------------------
// ----------- API REST ------------
// ---------------------------------

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

    console.log(username, email, pass)

    const usuario = new Usuario({
        nombre: username,
        email: email,
        pass: pass
    })

    Usuario.findOne({ $or: [{ nombre: username }, { email: email }] }).then((usuarioExistente) => {
        if (usuarioExistente) {
            res.send({
                titulo: "¡Aviso!",
                mensaje: "El nombre de usuario o el email que estás utilizando ya está en uso. ¡Prueba con otros diferentes!",
                tipo: "warning"
            })
        } else {
            const nuevoUsuario = new Usuario({
                nombre: username,
                email: email,
                pass: pass
            });

            nuevoUsuario.save().then((result) => {
                res.send({
                    titulo: "¡Registro éxito!",
                    mensaje: "Tu cuenta se ha registrado con correctamete. Ahora puedes iniciar sesión",
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
        console.log(error);
        res.send("ERROR");
    });
})


// Platos
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

app.post('/guardar-plato', function (req, res) {
    const { nombre, descripcion, ingredientes } = req.body;

    const nuevoPlato = new Plato({
        nombre: nombre,
        descripcion: descripcion,
        ingredientes: ingredientes
    });

    nuevoPlato.save()
        .then(platoGuardado => {
            console.log(platoGuardado)
            res.send({
                titulo: "¡Plato guardaro!",
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
})