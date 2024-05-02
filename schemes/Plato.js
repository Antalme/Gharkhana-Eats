const mongoose = require("mongoose")

const platoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true
    },
    descripcion: {
        type: String,
        require: true
    },
    ingredientes: {
        type: String,
        require: true
    }
}, { timestamps: true })

const Plato = mongoose.model("Plato", platoSchema)

module.exports = Plato;