const mongoose = require("mongoose")

const ingredienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    unidad: {
        type: String,
        enum: ['Gramos', 'Mililitros', 'Unidades'],
        required: true
    }
})

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
        type: [ingredienteSchema],
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    imagen: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true })

const Plato = mongoose.model("Plato", platoSchema)

module.exports = Plato