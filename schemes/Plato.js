const mongoose = require("mongoose")

const platoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    ingredientes: {
        type: String,
        required: true
    },
    imagen: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true })

const Plato = mongoose.model("Plato", platoSchema)

module.exports = Plato;