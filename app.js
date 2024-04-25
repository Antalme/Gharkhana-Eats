const express = require("express")
const mongoose = require("mongoose")
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

// ---------------------------------
// ------------- VIEWS -------------
// ---------------------------------

app.get('/', function (req, res) {
    res.render("index.ejs")
})

app.get('/login', function (req, res) {
    res.render("login.ejs")
})

app.get('/registro', function (req, res) {
    res.render("registro.ejs")
})

app.get('/perfil', function (req, res) {
    res.render("perfil.ejs")
})

// ---------------------------------
// ----------- API REST ------------
// ---------------------------------

//Maneja los inicios de sesión.
app.post('/login', function (req, res) {
    const username = req.body.usuario;
    const pass = req.body.pass;

    // Buscar el usuario en MongoDB
    Usuario.findOne({ $or: [{ nombre: username }, { pass: pass }] }).then((usuarioExistente) => {
        if (usuarioExistente) {
            res.send({
                titulo: "La abuelita te saluda",
                mensaje: "¡Bienvenido a Gharkhana Eats!",
                tipo: "success"
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

app.get('/platos', function (req, res) {
    Plato.find().then((resultado) => {
        res.send(resultado)
    }).catch((error) => {
        console.log("Error: " + error)
    })
})

app.get('/plato', function (req, res) {
    Plato.findById("662626b0a018fb0bdd33b33f").then((resultado) => {
        res.send(resultado)
    }).catch((error) => {
        console.log("Error: " + error)
    })
})