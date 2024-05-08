const mongoose = require("mongoose")

const platoDiaSchema = new mongoose.Schema({
    fecha: {
        type: String,
        require: true
    },
    idPlato: {
        type: String,
        require: true
    },
    hora: {
        type: String,
        require: true
    }
}, { timestamps: true })

const PlatoDia = mongoose.model("PlatoDia", platoDiaSchema)

module.exports = PlatoDia;