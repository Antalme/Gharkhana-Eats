const mongoose = require("mongoose")

const usuarioSchema = new mongoose.Schema({
    nombre: {
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
}, { timestamps: true })

const Usuario = mongoose.model("Usuario", usuarioSchema)

module.exports = Usuario;