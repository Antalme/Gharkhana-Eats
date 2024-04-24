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

app.get('/registro', function (req, res) {
    res.render("registro.ejs")
})

// ---------------------------------
// ----------- API REST ------------
// ---------------------------------

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
            res.status(400).send("El usuario o el email ya han sido utilizados.");
        } else {
            const nuevoUsuario = new Usuario({
                nombre: username,
                email: email,
                pass: pass
            });

            nuevoUsuario.save().then((result) => {
                //res.render("perfil.ejs");
                res.status(200).send("Usuario registrado correctamente.");
            }).catch((error) => {
                console.log(error);
                res.status(400).send("Ha ocurrido un error inesperado: " + error)
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