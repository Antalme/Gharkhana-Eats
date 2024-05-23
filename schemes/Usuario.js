const mongoose = require("mongoose")

const usuarioSchema = new mongoose.Schema({
    nombreUsuario: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    pass: {
        type: String,
        require: true
    },
    nombreCompleto: {
        type: String,
        require: true
    },
    direccion: {
        type: String,
        require: true
    },
    planActual: {
        type: String,
        enum: ['Sin plan', 'Plan semanal', 'Plan mensual'],
        default: 'Sin plan'
    },)
    rango: {
        type: String,
        enum: ['Cliente', 'Cocinero', 'Repartidor', 'Administrador'],
        default: 'Cliente'
    }
}, { timestamps: true })

const Usuario = mongoose.model("Usuario", usuarioSchema)

module.exports = Usuario;