const express = require("express")
const mongoose = require("mongoose")
const app = express();
const Plato = require("./Plato")

const DB_URI = "mongodb+srv://hegispok:OMqUNsN286sFKvJt@clustergke0.xe4ond6.mongodb.net/gke?retryWrites=true&w=majority&appName=ClusterGKE0"

app.use(express.static('public'));
app.set("view engine", "ejs");

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

app.post('/addPlato', function (req, res) {
    const plato = new Plato({
        nombre: "plato 1",
        categoria: "ensalada",
        ingredientes: "tomate, lechuga, pepino..."
    })

    plato.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log(error)
    })
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